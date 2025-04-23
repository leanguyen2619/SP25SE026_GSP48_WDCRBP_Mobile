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
  Tooltip,
  Checkbox,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEdit2, FiPlus, FiTrash, FiXCircle } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import { formatPrice } from "../../../../utils/utils";
import ImageUpdateUploader from "../../../../components/Utility/ImageUpdateUploader";

export default function DesignUpdateModal({ design, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [imgUrls, setImgUrls] = useState(design?.imgUrls || "");
  const [isInstall, setIsInstall] = useState(design?.isInstall || false);

  const [configurations, setConfigurations] = useState([
    {
      id: 1,
      name: "Loại gỗ",
      values: [
        { id: 101, name: "Gỗ Sồi" },
        { id: 102, name: "Gỗ Óc Chó" },
      ],
    },
    {
      id: 2,
      name: "Bề mặt hoàn thiện",
      values: [
        { id: 201, name: "Tự nhiên" },
        { id: 202, name: "Sơn bóng" },
      ],
    },
  ]);
  const [prices, setPrices] = useState([
    { config: [1, 2], configValue: [101, 201], price: 12000000 },
    { config: [1, 2], configValue: [101, 202], price: 14000000 },
    { config: [1, 2], configValue: [102, 201], price: 15000000 },
    { config: [1, 2], configValue: [102, 202], price: 17000000 },
  ]);

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
      name: formData.get("name"),
      imgUrls: formData.get("imgUrls"),
      category: formData.get("category"),
      description: formData.get("description"),
      configurations,
      prices,
      isInstall: isInstall,
    };
    onClose();
  };

  return (
    <>
      <Tooltip label="Chỉnh sửa" hasArrow>
        <Button
          p="1px"
          color={appColorTheme.blue_0}
          bg="none"
          border={`1px solid ${appColorTheme.blue_0}`}
          _hover={{ bg: appColorTheme.blue_0, color: "white" }}
          onClick={onOpen}
        >
          <FiEdit2 />
        </Button>
      </Tooltip>

      <Modal
        size="6xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chỉnh sửa thiết kế</ModalHeader>
          <ModalCloseButton />
          <ModalBody bgColor="app_grey.1" pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tên thiết kế</FormLabel>
                  <Input
                    name="name"
                    placeholder="Nhập tên thiết kế"
                    bg="white"
                    defaultValue="Bàn gỗ thủ công"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Danh mục</FormLabel>
                  <Select
                    name="category"
                    placeholder="Chọn danh mục"
                    bg="white"
                    defaultValue="Bàn"
                  >
                    <option value="Bàn ăn">Bàn ăn</option>
                    <option value="Tủ quần áo">Tủ quần áo</option>
                    <option value="Giường ngủ">Giường ngủ</option>
                  </Select>
                </FormControl>

                <Box py={2}>
                  <Checkbox
                    isChecked={isInstall}
                    onChange={(e) => setIsInstall(e.target.checked)}
                    size="md"
                    colorScheme="green"
                    bg="white"
                    p={2}
                    borderRadius="md"
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
                    defaultValue="Không có gì"
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
                          <IconButton
                            position="absolute"
                            right={1}
                            top={1}
                            icon={<FiXCircle />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleRemoveConfig(config.id)}
                          />
                        </HStack>

                        <VStack spacing={2} align="stretch">
                          <FormLabel m={0} isRequired>
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

                <FormControl isRequired>
                  <FormLabel>Hình ảnh</FormLabel>
                  <ImageUpdateUploader
                    maxFiles={4}
                    onUploadComplete={(result) => {
                      setImgUrls(result);
                    }}
                    imgUrls={imgUrls}
                  />
                </FormControl>

                <HStack justify="flex-end" mt={4}>
                  <Button onClick={onClose}>Hủy</Button>
                  <Button colorScheme="blue" type="submit">
                    Cập nhật
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
