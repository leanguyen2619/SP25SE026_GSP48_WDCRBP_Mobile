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
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import ImageUpload from "../../../../components/Utility/ImageUpload";
import { useCreatePostMutation } from "../../../../services/postApi";
import useAuth from "../../../../hooks/useAuth";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import { validatePostData } from "../../../../validations";

export default function PostCreateModal({ refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [imgUrls, setImgUrls] = useState("");
  const notify = useNotify();
  const { auth } = useAuth();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      imgUrls: imgUrls,
      woodworkerId: auth?.wwId,
    };

    // Validate post data
    const errors = validatePostData(data);
    if (errors.length > 0) {
      notify("Lỗi khi tạo bài viết", errors.join(" [---] "), "error", 3000);
      return;
    }

    try {
      await createPost(data).unwrap();

      notify("Bài viết đã được tạo thành công", "", "success", 3000);

      setImgUrls("");
      onClose();
      refetch?.();
    } catch (error) {
      notify(
        "Lỗi khi tạo bài viết",
        error.data?.message || "Vui lòng thử lại sau",
        "error",
        3000
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
        Thêm bài viết mới
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
          <ModalHeader>Thêm bài viết mới</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1" pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tiêu đề</FormLabel>
                  <Input
                    name="title"
                    placeholder="Nhập tiêu đề bài viết"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mô tả</FormLabel>
                  <Textarea
                    whiteSpace={"pre-wrap"}
                    name="description"
                    placeholder="Nhập mô tả bài viết"
                    bg="white"
                    rows={10}
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

                <Stack direction="row" justify="flex-end" spacing={4}>
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
                    isDisabled={buttonDisabled}
                    leftIcon={<FiSave />}
                  >
                    Lưu
                  </Button>
                </Stack>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
