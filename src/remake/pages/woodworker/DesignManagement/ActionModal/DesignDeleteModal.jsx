import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiTrash } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";

export default function DesignDeleteModal({ design, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const handleDelete = async () => {
    try {
      // TODO: Gọi API xóa thiết kế
      onClose();
      refetch?.();
    } catch (error) {
      console.error("Lỗi khi xóa thiết kế:", error);
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
          <FiTrash />
        </Button>
      </Tooltip>

      <Modal
        size="md"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xóa</ModalHeader>
          <ModalCloseButton />
          <ModalBody bgColor="app_grey.1" pb={6}>
            <VStack spacing={4} align="stretch">
              <Text>
                Bạn có chắc chắn muốn xóa thiết kế &ldquo;{design?.name}&rdquo;
                không? Hành động này không thể hoàn tác.
              </Text>

              <Box display="flex" justifyContent="flex-end" gap={3}>
                <Button onClick={onClose}>Hủy</Button>
                <Button colorScheme="red" onClick={handleDelete}>
                  Xóa
                </Button>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
