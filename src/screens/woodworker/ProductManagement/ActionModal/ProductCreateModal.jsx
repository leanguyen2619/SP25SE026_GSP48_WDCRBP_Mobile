import {
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
  Stack,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  Textarea,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import ImageUpload from "../../../../components/Utility/ImageUpload";
import { formatPrice } from "../../../../utils/utils";
import { useCreateProductMutation } from "../../../../services/productApi";
import useAuth from "../../../../hooks/useAuth";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import CategorySelector from "../../../../components/Utility/CategorySelector";
import { validateProductData } from "../../../../validations";

export default function ProductCreateModal({ refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [mediaUrls, setMediaUrls] = useState("");
  const [price, setPrice] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isInstall, setIsInstall] = useState(false);
  const { auth } = useAuth();
  const notify = useNotify();

  // State for category
  const [categoryId, setCategoryId] = useState(null);

  // Mutation hook for creating products
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      // Create an object from form entries
      const formEntries = Object.fromEntries(formData.entries());

      // Build the product data with spread operator for cleaner code
      const productData = {
        ...formEntries,
        price: Number(formEntries.price),
        stock: Number(formEntries.stock),
        warrantyDuration: Number(formEntries.warrantyDuration),
        length: Number(formEntries.length),
        width: Number(formEntries.width),
        height: Number(formEntries.height),
        mediaUrls: mediaUrls,
        status: true,
        isInstall: isInstall,
        woodworkerId: auth?.wwId,
        categoryId: Number(categoryId),
      };

      // Validate product data
      const errors = validateProductData(productData);
      if (errors.length > 0) {
        notify("Lỗi khi tạo sản phẩm", errors.join(" [---] "), "error", 3000);
        return;
      }

      // Send API request
      await createProduct(productData).unwrap();

      notify("Thành công", "Sản phẩm đã được tạo thành công", "success");
      onClose();
      refetch?.();
    } catch (error) {
      console.error("Error creating product:", error);
      notify(
        "Lỗi",
        error.data?.message || "Không thể tạo sản phẩm. Vui lòng thử lại sau.",
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
        Thêm sản phẩm mới
      </Button>

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
          <ModalHeader>Thêm sản phẩm mới</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1" pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Hình ảnh</FormLabel>
                  <ImageUpload
                    maxFiles={4}
                    onUploadComplete={(result) => {
                      setMediaUrls(result);
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Danh mục</FormLabel>
                  <Box bg="white" borderRadius="md" p={4}>
                    <CategorySelector
                      setCategoryId={setCategoryId}
                      initialCategoryId={categoryId}
                    />
                  </Box>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <Input
                    name="productName"
                    placeholder="Nhập tên sản phẩm"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mô tả</FormLabel>
                  <Textarea
                    name="description"
                    placeholder="Nhập mô tả"
                    bg="white"
                    rows={5}
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

                <HStack spacing={4}>
                  <FormControl flex="1" isRequired>
                    <FormLabel>Giá</FormLabel>
                    <HStack>
                      <Text flex="1" as="b" color={appColorTheme.brown_2}>
                        {formatPrice(price)}
                      </Text>

                      <NumberInput
                        name="price"
                        min={0}
                        flex="1"
                        max={50000000}
                        step={1000}
                        value={price}
                        onChange={(value) => setPrice(Number(value))}
                      >
                        <NumberInputField bg="white" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </HStack>
                  </FormControl>

                  <FormControl flex="1" isRequired>
                    <FormLabel>Tồn kho</FormLabel>
                    <NumberInput name="stock" min={0} max={1000} step={1}>
                      <NumberInputField bg="white" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Bảo hành (tháng)</FormLabel>
                    <NumberInput
                      name="warrantyDuration"
                      min={0}
                      max={120}
                      step={1}
                    >
                      <NumberInputField bg="white" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Chiều dài (cm)</FormLabel>
                    <NumberInput name="length" min={0} max={1000} step={1}>
                      <NumberInputField bg="white" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Chiều cao (cm)</FormLabel>
                    <NumberInput name="height" min={0} max={1000} step={1}>
                      <NumberInputField bg="white" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Chiều rộng (cm)</FormLabel>
                    <NumberInput name="width" min={0} max={1000} step={1}>
                      <NumberInputField bg="white" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Loại gỗ</FormLabel>
                  <Input
                    name="woodType"
                    placeholder="Nhập loại gỗ (ví dụ: Gỗ công nghiệp, Gỗ tự nhiên, Gỗ ép)"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Màu sắc</FormLabel>
                  <Input name="color" placeholder="Nhập màu sắc" bg="white" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tính năng đặc biệt</FormLabel>
                  <Input
                    name="specialFeature"
                    placeholder="Nhập tính năng đặc biệt"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phong cách</FormLabel>
                  <Input
                    name="style"
                    placeholder="Nhập phong cách (ví dụ: Hiện đại, Cổ điển, Tối giản, Đương đại)"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Điêu khắc</FormLabel>
                  <Input
                    name="sculpture"
                    placeholder="Nhập kiểu điêu khắc (ví dụ: Không, Đơn giản, Phức tạp)"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mùi hương</FormLabel>
                  <Input
                    name="scent"
                    placeholder="Nhập mùi hương (ví dụ: Không, Gỗ thông, Gỗ sồi, Gỗ trầm)"
                    bg="white"
                  />
                </FormControl>

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

                <HStack justify="flex-end" mt={4}>
                  <Button
                    onClick={onClose}
                    leftIcon={<FiX />}
                    isDisabled={isLoading}
                  >
                    Đóng
                  </Button>
                  <Button
                    colorScheme="green"
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={buttonDisabled || !categoryId}
                    leftIcon={<FiSave />}
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
