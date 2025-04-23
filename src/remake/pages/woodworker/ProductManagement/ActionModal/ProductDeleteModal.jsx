import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import { useDeleteProductMutation } from "../../../../services/productApi";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";

export default function ProductDeleteModal({ product, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const notify = useNotify();

  // Mutation hook for deleting products
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct(product.productId).unwrap();

      notify("Thành công", "Sản phẩm đã được xóa thành công", "success");
      onClose();
      refetch?.();
    } catch (error) {
      console.error("Error deleting product:", error);
      notify(
        "Lỗi",
        error.data?.message || "Không thể xóa sản phẩm. Vui lòng thử lại sau.",
        "error"
      );
    }
  };

  return (
    <>
      <Tooltip label="Xóa" hasArrow>
        <Button
          p="1px"
          color={appColorTheme.red_0}
          bg="none"
          border={`1px solid ${appColorTheme.red_0}`}
          _hover={{ bg: appColorTheme.red_0, color: "white" }}
          onClick={onOpen}
        >
          <FiTrash2 />
        </Button>
      </Tooltip>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xóa sản phẩm</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1">
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm &quot;{product?.productName}
              &quot;?
            </p>
            <p>Hành động này không thể hoàn tác.</p>

            <Box mt={4}>
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
            </Box>
          </ModalBody>
          <ModalFooter bgColor="app_grey.1" gap={2}>
            <Button leftIcon={<FiX />} onClick={onClose} isDisabled={isLoading}>
              Đóng
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isLoading={isLoading}
              isDisabled={buttonDisabled}
              leftIcon={<FiTrash2 />}
            >
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
