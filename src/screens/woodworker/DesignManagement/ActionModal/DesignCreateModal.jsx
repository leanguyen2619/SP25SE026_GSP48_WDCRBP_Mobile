import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  VStack,
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  Flex,
  Textarea,
  Checkbox,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiPlus, FiTrash, FiX, FiXCircle } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import ImageUpload from "../../../../components/Utility/ImageUpload";
import { formatPrice } from "../../../../utils/utils";
import { useAddDesignIdeaMutation } from "../../../../services/designIdeaApi";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import useAuth from "../../../../hooks/useAuth";
import CategorySelector from "../../../../components/Utility/CategorySelector";
import { validateDesignData } from "../../../../validations";

export default function DesignCreateModal({ refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [configurations, setConfigurations] = useState([
    {
      id: 1,
      name: "Kích thước (dài x rộng x cao cm)",
      values: [],
    },
  ]);
  const [prices, setPrices] = useState([]);
  const [imgUrls, setImgUrls] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [categoryId, setCategoryId] = useState(null);
  const [isInstall, setIsInstall] = useState(false);
  const notify = useNotify();
  const { auth } = useAuth();

  const [addDesignIdea, { isLoading }] = useAddDesignIdeaMutation();

  const handleAddConfig = () => {
    const newConfigId = configurations.length + 1;
    setConfigurations([
      ...configurations,
      {
        id: newConfigId,
        name: "",
        values: [],
      },
    ]);
  };

  const handleAddValue = (configId) => {
    const configIndex = configurations.findIndex((c) => c.id == configId);
    if (configIndex === -1) return;

    const newValueId =
      configId * 100 + (configurations[configIndex].values.length + 1);
    const newConfigurations = [...configurations];
    newConfigurations[configIndex].values.push({
      id: newValueId,
      name: "",
    });
    setConfigurations(newConfigurations);
    updatePrices(newConfigurations);
  };

  const handleConfigChange = (configId, field, value) => {
    const configIndex = configurations.findIndex((c) => c.id == configId);
    if (configIndex === -1) return;

    const newConfigurations = [...configurations];
    newConfigurations[configIndex][field] = value;
    setConfigurations(newConfigurations);
  };

  const handleValueChange = (configId, valueId, value) => {
    const configIndex = configurations.findIndex((c) => c.id == configId);
    if (configIndex === -1) return;

    const valueIndex = configurations[configIndex].values.findIndex(
      (v) => v.id == valueId
    );
    if (valueIndex === -1) return;

    const newConfigurations = [...configurations];
    newConfigurations[configIndex].values[valueIndex].name = value;
    setConfigurations(newConfigurations);
  };

  const handleRemoveConfig = (configId) => {
    setConfigurations(configurations.filter((c) => c.id != configId));
    updatePrices(configurations.filter((c) => c.id != configId));
  };

  const handleRemoveValue = (configId, valueId) => {
    const configIndex = configurations.findIndex((c) => c.id == configId);
    if (configIndex === -1) return;

    const newConfigurations = [...configurations];
    newConfigurations[configIndex].values = newConfigurations[
      configIndex
    ].values.filter((v) => v.id != valueId);
    setConfigurations(newConfigurations);
    updatePrices(newConfigurations);
  };

  const updatePrices = (configs) => {
    // Tạo tất cả các tổ hợp có thể có của các giá trị cấu hình
    const combinations = generateCombinations(configs);
    const newPrices = combinations.map((combo) => {
      const existingPrice = prices.find(
        (p) =>
          JSON.stringify(p.config) == JSON.stringify(combo.config) &&
          JSON.stringify(p.configValue) == JSON.stringify(combo.configValue)
      );
      return (
        existingPrice || {
          config: combo.config,
          configValue: combo.configValue,
          price: 0,
        }
      );
    });
    setPrices(newPrices);
  };

  const generateCombinations = (configs) => {
    if (configs.length === 0) return [];

    const result = [];
    const configIds = configs.map((c) => c.id);
    const valueIds = configs.map((c) => c.values.map((v) => v.id));

    function generate(current, index) {
      if (index === configs.length) {
        result.push({
          config: [...configIds],
          configValue: [...current],
        });
        return;
      }

      for (const valueId of valueIds[index]) {
        current.push(valueId);
        generate(current, index + 1);
        current.pop();
      }
    }

    generate([], 0);
    return result;
  };

  const handlePriceChange = (config, configValue, price) => {
    const priceIndex = prices.findIndex(
      (p) =>
        JSON.stringify(p.config) == JSON.stringify(config) &&
        JSON.stringify(p.configValue) == JSON.stringify(configValue)
    );
    if (priceIndex === -1) return;

    const newPrices = [...prices];
    newPrices[priceIndex].price = price;
    setPrices(newPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      woodworkerId: auth?.wwId,
      name: formData.get("name"),
      img: imgUrls,
      categoryId: +categoryId,
      description: formData.get("description"),
      configurations,
      prices,
      isInstall: isInstall,
    };

    // Validate data before submission
    const validationErrors = validateDesignData(data);
    if (validationErrors.length > 0) {
      notify("Vui lòng kiểm tra", validationErrors[0], "error");
      return;
    }

    try {
      await addDesignIdea(data).unwrap();
      notify("Thêm thiết kế thành công");

      // Reset form
      setConfigurations([]);
      setPrices([]);
      setImgUrls([]);

      refetch?.();
      onClose();
    } catch (error) {
      notify(
        "Thêm thiết kế thất bại",
        error.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <Button
        px={2}
        color={appColorTheme.green_0}
        bg="none"
        border={`1px solid ${appColorTheme.green_0}`}
        _hover={{ bg: appColorTheme.green_0, color: "white" }}
        leftIcon={<FiPlus />}
        onClick={onOpen}
      >
        Thêm thiết kế mới
      </Button>

      <Modal
        size="6xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={isLoading ? null : onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm thiết kế mới</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1" pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tên thiết kế</FormLabel>
                  <Input
                    name="name"
                    placeholder="Nhập tên thiết kế"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Hình ảnh</FormLabel>
                  <ImageUpload
                    maxFiles={4}
                    onUploadComplete={(result) => {
                      setImgUrls(result);
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Danh mục</FormLabel>
                  <CategorySelector
                    initialCategoryId={1}
                    setCategoryId={setCategoryId}
                  />
                </FormControl>

                <Box py={2}>
                  <Checkbox
                    isChecked={isInstall}
                    onChange={(e) => setIsInstall(e.target.checked)}
                    size="md"
                    colorScheme="green"
                  >
                    <Text fontWeight="medium">
                      Cần giao hàng + lắp đặt bởi xưởng
                    </Text>
                  </Checkbox>
                </Box>

                <FormControl isRequired>
                  <FormLabel>Mô tả</FormLabel>
                  <Textarea
                    name="description"
                    placeholder="Nhập mô tả"
                    bg="white"
                    rows={5}
                  />
                </FormControl>

                <Box>
                  <HStack justify="space-between" mb={4}>
                    <Text fontWeight="bold">Cấu hình sản phẩm</Text>
                    <Button
                      leftIcon={<FiPlus />}
                      onClick={handleAddConfig}
                      size="sm"
                    >
                      Thêm cấu hình
                    </Button>
                  </HStack>

                  <VStack spacing={4} align="stretch">
                    {configurations.map((config) => (
                      <Box
                        key={config.id}
                        p={5}
                        borderWidth="1px"
                        borderRadius="lg"
                        bg="white"
                        position="relative"
                      >
                        <HStack mb={2}>
                          <FormControl isRequired>
                            <FormLabel>Tên cấu hình</FormLabel>

                            <Input
                              value={config.name}
                              onChange={(e) =>
                                handleConfigChange(
                                  config.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Nhập tên cấu hình"
                            />
                          </FormControl>
                          {config.name !=
                            "Kích thước (dài x rộng x cao cm)" && (
                            <IconButton
                              position="absolute"
                              right={1}
                              top={1}
                              icon={<FiXCircle />}
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleRemoveConfig(config.id)}
                            />
                          )}
                        </HStack>

                        <VStack spacing={2} align="stretch">
                          <FormLabel m={0}>
                            Giá trị <span style={{ color: "red" }}>*</span>
                          </FormLabel>
                          {config.values.map((value) => (
                            <HStack key={value.id}>
                              <FormControl isRequired>
                                <Input
                                  value={value.name}
                                  onChange={(e) =>
                                    handleValueChange(
                                      config.id,
                                      value.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Nhập giá trị"
                                />
                              </FormControl>
                              <IconButton
                                icon={<FiTrash />}
                                colorScheme="red"
                                variant="ghost"
                                onClick={() =>
                                  handleRemoveValue(config.id, value.id)
                                }
                              />
                            </HStack>
                          ))}
                          <Button
                            leftIcon={<FiPlus />}
                            onClick={() => handleAddValue(config.id)}
                            size="sm"
                          >
                            Thêm giá trị
                          </Button>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>

                <Text mb={4}>
                  * Lưu ý: Hãy tính phần tiền giao hàng + lắp đặt vào trong giá
                  của sản phẩm
                </Text>

                {prices.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" mb={4}>
                      Bảng giá theo cấu hình
                    </Text>
                    <VStack spacing={4} align="stretch">
                      {prices.map((price, index) => (
                        <Box
                          key={index}
                          p={5}
                          borderWidth="1px"
                          borderRadius="lg"
                          bg="white"
                        >
                          <HStack justify="space-between">
                            <Box pr={4} borderRight="1px solid #CCC" flex="1">
                              {price.configValue.map((valueId) => {
                                const configId = Math.floor(valueId / 100);
                                const config = configurations.find(
                                  (c) => c.id == configId
                                );
                                const value = config?.values.find(
                                  (v) => v.id == valueId
                                );
                                return (
                                  <Flex justify="space-between" key={valueId}>
                                    <Text>{config?.name}:</Text>
                                    <Text as="b">{value?.name}</Text>
                                  </Flex>
                                );
                              })}
                            </Box>

                            <HStack justifyContent="flex-end" flex="1">
                              <Text as="b" color={appColorTheme.brown_2}>
                                {formatPrice(price.price)}
                              </Text>

                              <FormControl isRequired maxW="200px">
                                <NumberInput
                                  value={price.price}
                                  onChange={(value) =>
                                    handlePriceChange(
                                      price.config,
                                      price.configValue,
                                      parseInt(value)
                                    )
                                  }
                                  min={0}
                                  max={50000000}
                                  step={1000}
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </FormControl>
                            </HStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}

                <HStack mt={6}>
                  <CheckboxList
                    items={[
                      {
                        isOptional: false,
                        description:
                          "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                      },
                    ]}
                    setButtonDisabled={setButtonDisabled}
                  />
                </HStack>

                <HStack justify="flex-end" mt={4}>
                  <Button
                    leftIcon={<FiX />}
                    isLoading={isLoading}
                    onClick={onClose}
                  >
                    Đóng
                  </Button>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={buttonDisabled}
                    leftIcon={<FiPlus />}
                  >
                    Lưu
                  </Button>
                </HStack>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
