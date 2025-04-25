import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Tooltip,
  VStack,
  Text,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiEye } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import ImageListSelector from "../../../../components/Utility/ImageListSelector";
import { formatDateString } from "../../../../utils/utils";

export default function PostDetailModal({ post }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  return (
    <>
      <Tooltip label="Xem chi tiết" hasArrow>
        <Button
          p="1px"
          color={appColorTheme.brown_2}
          bg="none"
          border={`1px solid ${appColorTheme.brown_2}`}
          _hover={{ bg: appColorTheme.brown_2, color: "white" }}
          onClick={onOpen}
        >
          <FiEye />
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
          <ModalHeader>Chi tiết bài viết</ModalHeader>
          <ModalCloseButton />
          <ModalBody bgColor="app_grey.1" pb={6}>
            <VStack spacing={6} align="stretch">
              <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                <GridItem>
                  <VStack spacing={4} align="stretch">
                    <Text>
                      <Text as="b">Mã bài viết:</Text> {post?.postId}
                    </Text>
                    <Text>
                      <Text as="b">Tiêu đề:</Text> {post?.title}
                    </Text>
                    <Text>
                      <Text as="b">Ngày tạo:</Text>{" "}
                      {post?.createdAt ? formatDateString(post?.createdAt) : ""}
                    </Text>
                    {post?.woodworkerName && (
                      <Text>
                        <Text as="b">Xưởng mộc:</Text> {post.woodworkerName}
                      </Text>
                    )}
                  </VStack>
                </GridItem>
                <GridItem>
                  <ImageListSelector imgH={200} imgUrls={post?.imgUrls} />
                </GridItem>
              </Grid>

              <Divider />

              <Text>
                <Text as="b">Mô tả:</Text>
                <Text whiteSpace="pre-wrap">{post?.description}</Text>
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
