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
  Tooltip,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import { formatPrice } from "../../../../utils/utils";
import ImageUpdateUploader from "../../../../components/Utility/ImageUpdateUploader";
import { useUpdateProductMutation } from "../../../../services/productApi";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import CategorySelector from "../../../../components/Utility/CategorySelector";
import { validateProductData } from "../../../../validations";

export default function ProductUpdateModal({ product, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [price, setPrice] = useState(product?.price);
  const [mediaUrls, setMediaUrls] = useState(product?.mediaUrls || "");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isInstall, setIsInstall] = useState(product?.isInstall || false);
  const notify = useNotify();

  // State for category
  const [categoryId, setCategoryId] = useState(product?.categoryId);

  // Mutation hook for updating products
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formEntries = Object.fromEntries(formData.entries());

    try {
      // Use spread operator for cleaner code
      const productData = {
        ...formEntries,
        // Add id and required properties
        id: product.productId,
        // Convert string values to numbers
        price: Number(formEntries.price),
        stock: Number(formEntries.stock),
        warrantyDuration: Number(formEntries.warrantyDuration),
        length: Number(formEntries.length),
        width: Number(formEntries.width),
        height: Number(formEntries.height),
        // Add additional properties
        mediaUrls: mediaUrls,
        status: true,
        isInstall: isInstall,
        woodworkerId: product.woodworkerId,
        categoryId: Number(categoryId),
      };

      // Validate product data
      const errors = validateProductData(productData);
      if (errors.length > 0) {
        notify(
          "Lỗi khi cập nhật sản phẩm",
          errors.join(" [---] "),
          "error",
          3000
        );
        return;
      }

      // Send API request
      await updateProduct(productData).unwrap();

      notify("Thành công", "Sản phẩm đã được cập nhật thành công", "success");
      onClose();
      refetch?.();
    } catch (error) {
      console.error("Error updating product:", error);
      notify(
        "Lỗi",
        error.data?.message ||
          "Không thể cập nhật sản phẩm. Vui lòng thử lại sau.",
        "error"
      );
    }
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
          <ModalHeader>Chỉnh sửa sản phẩm</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1" pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Mã sản phẩm</FormLabel>
                  <Input
                    name="productId"
                    bg="white"
                    value={product?.productId}
                    bgColor={"app_grey.2"}
                    isReadOnly
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Danh mục</FormLabel>
                  <Box bg="white" borderRadius="md" p={4}>
                    <CategorySelector
                      setCategoryId={setCategoryId}
                      initialCategoryId={product?.categoryId}
                    />
                  </Box>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <Input
                    name="productName"
                    placeholder="Nhập tên sản phẩm"
                    bg="white"
                    defaultValue={product?.productName}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mô tả</FormLabel>
                  <Textarea
                    name="description"
                    whiteSpace={"pre-wrap"}
                    placeholder="Nhập mô tả"
                    bg="white"
                    rows={5}
                    defaultValue={product?.description}
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
                    <NumberInput
                      name="stock"
                      min={0}
                      max={1000}
                      step={1}
                      defaultValue={product?.stock}
                    >
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
                      defaultValue={product?.warrantyDuration}
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
                    <NumberInput
                      name="length"
                      min={0}
                      max={1000}
                      step={1}
                      defaultValue={product?.length}
                    >
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
                    <NumberInput
                      name="height"
                      min={0}
                      max={1000}
                      step={1}
                      defaultValue={product?.height}
                    >
                      <NumberInputField bg="white" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Chiều rộng (cm)</FormLabel>
                    <NumberInput
                      name="width"
                      min={0}
                      max={1000}
                      step={1}
                      defaultValue={product?.width}
                    >
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
                    placeholder="Nhập loại gỗ"
                    bg="white"
                    defaultValue={product?.woodType}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Màu sắc</FormLabel>
                  <Input
                    name="color"
                    placeholder="Nhập màu sắc"
                    bg="white"
                    defaultValue={product?.color}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tính năng đặc biệt</FormLabel>
                  <Input
                    name="specialFeature"
                    placeholder="Nhập tính năng đặc biệt"
                    bg="white"
                    defaultValue={product?.specialFeature}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phong cách</FormLabel>
                  <Input
                    name="style"
                    placeholder="Nhập phong cách"
                    bg="white"
                    defaultValue={product?.style}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Điêu khắc</FormLabel>
                  <Input
                    name="sculpture"
                    placeholder="Nhập kiểu điêu khắc"
                    bg="white"
                    defaultValue={product?.sculpture}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mùi hương</FormLabel>
                  <Input
                    name="scent"
                    placeholder="Nhập mùi hương"
                    bg="white"
                    defaultValue={product?.scent}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Hình ảnh</FormLabel>
                  <ImageUpdateUploader
                    maxFiles={4}
                    onUploadComplete={(result) => {
                      setMediaUrls(result);
                    }}
                    imgUrls={mediaUrls}
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
                    colorScheme="blue"
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={buttonDisabled || !categoryId}
                    leftIcon={<FiSave />}
                  >
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
