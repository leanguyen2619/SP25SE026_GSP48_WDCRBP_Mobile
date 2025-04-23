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
  Tooltip,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import ImageUpdateUploader from "../../../../components/Utility/ImageUpdateUploader";
import { useUpdatePostMutation } from "../../../../services/postApi";
import { useNotify } from "../../../../components/Utility/Notify";
import useAuth from "../../../../hooks/useAuth";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import { validatePostData } from "../../../../validations";

export default function PostUpdateModal({ post, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [imgUrls, setImgUrls] = useState(post?.imgUrls || "");
  const notify = useNotify();
  const { auth } = useAuth();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [updatePost, { isLoading }] = useUpdatePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      id: post.postId,
      title: formData.get("title"),
      description: formData.get("description"),
      imgUrls: imgUrls,
      woodworkerId: post.woodworkerId || auth?.wwId || 0,
    };

    // Validate post data
    const errors = validatePostData(data);
    if (errors.length > 0) {
      notify(
        "Lỗi khi cập nhật bài viết",
        errors.join(" [---] "),
        "error",
        3000
      );
      return;
    }

    try {
      await updatePost(data).unwrap();

      notify("Bài viết đã được cập nhật thành công", "", "success", 3000);

      onClose();
      refetch?.();
    } catch (error) {
      notify(
        "Lỗi khi cập nhật bài viết",
        error.data?.message || "Vui lòng thử lại sau",
        "error",
        3000
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
          <ModalHeader>Chỉnh sửa bài viết</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1" pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Mã bài viết</FormLabel>
                  <Input
                    name="postId"
                    bg="white"
                    value={post?.postId}
                    bgColor={"app_grey.2"}
                    isReadOnly
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tiêu đề</FormLabel>
                  <Input
                    name="title"
                    placeholder="Nhập tiêu đề bài viết"
                    bg="white"
                    defaultValue={post?.title}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mô tả</FormLabel>
                  <Textarea
                    name="description"
                    placeholder="Nhập mô tả bài viết"
                    bg="white"
                    rows={10}
                    defaultValue={post?.description}
                  />
                </FormControl>

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
                    colorScheme="blue"
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={buttonDisabled}
                    leftIcon={<FiSave />}
                  >
                    Cập nhật
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
