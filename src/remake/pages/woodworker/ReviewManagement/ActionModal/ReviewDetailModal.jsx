import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  VStack,
  Link,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEye, FiStar, FiCheck } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import { formatDateTimeString } from "../../../../utils/utils";
import { useUpdateReviewResponseMutation } from "../../../../services/reviewApi";
import { useNotify } from "../../../../components/Utility/Notify";

export default function ReviewDetailModal({ review, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const notify = useNotify();
  const [response, setResponse] = useState(review?.woodworkerResponse || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateReviewResponse] = useUpdateReviewResponseMutation();

  const handleSubmit = async () => {
    if (!response.trim()) {
      notify("Nội dung phản hồi không được để trống", "", "error", 3000);
      return;
    }

    if (response.length > 500) {
      notify(
        "Nội dung phản hồi không được vượt quá 500 ký tự",
        "",
        "error",
        3000
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await updateReviewResponse({
        reviewId: review.reviewId,
        woodworkerResponse: response.trim(),
      }).unwrap();

      notify(
        "Phản hồi thành công",
        "Đã gửi phản hồi đánh giá",
        "success",
        3000
      );

      refetch();
      onClose();
    } catch (error) {
      notify(
        "Lỗi khi gửi phản hồi",
        error.data?.message || "Đã có lỗi xảy ra",
        "error",
        5000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Tooltip label="Chi tiết" hasArrow>
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
        size="4xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết đánh giá</ModalHeader>
          {!isSubmitting && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1" pb={6}>
            <Stack gap={5}>
              {/* Thông tin cơ bản */}
              <Box>
                <Heading size="md" mb={4}>
                  Thông tin đánh giá
                </Heading>
                <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
                  <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                    <Box>
                      <Text fontWeight="bold">Mã đánh giá:</Text>
                      <Text>{review?.reviewId}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Loại đơn:</Text>
                      <Text>
                        {review?.serviceOrderId
                          ? "Đơn dịch vụ"
                          : review?.guaranteeOrderId
                          ? "Đơn BH / sửa"
                          : "Không xác định"}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Ngày tạo:</Text>
                      <Text>{formatDateTimeString(review?.createdAt)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Khách hàng:</Text>
                      <Text>{review?.username || "Không có thông tin"}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Mã đơn hàng:</Text>
                      <Text>
                        {review?.serviceOrderId ||
                          review?.guaranteeOrderId ||
                          "N/A"}
                      </Text>
                      {review?.serviceOrderId && (
                        <Link
                          target="_blank"
                          href={`/ww/service-order/${review?.serviceOrderId}`}
                          color={appColorTheme.brown_2}
                        >
                          Xem chi tiết
                        </Link>
                      )}
                      {review?.guaranteeOrderId && (
                        <Link
                          target="_blank"
                          href={`/ww/guarantee-order/${review?.guaranteeOrderId}`}
                          color={appColorTheme.brown_2}
                        >
                          Xem chi tiết
                        </Link>
                      )}
                    </Box>
                  </Grid>
                </Box>
              </Box>

              {/* Đánh giá và nội dung */}
              <Box>
                <Heading size="md" mb={4}>
                  Đánh giá và nội dung
                </Heading>
                <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={1}>
                      {[...Array(5)].map((_, index) => (
                        <FiStar
                          key={index}
                          color={
                            index < review?.rating
                              ? appColorTheme.brown_2
                              : "#CBD5E0"
                          }
                          size={24}
                        />
                      ))}
                      <Text ml={2} fontWeight="bold">
                        {review?.rating}/5
                      </Text>
                    </HStack>
                    <Text>{review?.comment}</Text>
                  </VStack>
                </Box>
              </Box>

              {/* Phản hồi */}
              <Box>
                <Heading size="md" mb={4}>
                  Phản hồi
                </Heading>
                <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
                  <VStack spacing={4} align="stretch">
                    <Textarea
                      ref={initialRef}
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Nhập nội dung phản hồi..."
                      rows={4}
                      isDisabled={
                        review?.woodworkerResponseStatus || isSubmitting
                      }
                    />
                  </VStack>
                </Box>
              </Box>
            </Stack>

            <HStack justify="flex-end" mt={6}>
              <Button onClick={onClose} mr={3}>
                Đóng
              </Button>
              {!review?.woodworkerResponseStatus && (
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  isDisabled={!response.trim() || response.length > 500}
                  isLoading={isSubmitting}
                  loadingText="Đang gửi"
                  leftIcon={<FiCheck />}
                >
                  Gửi phản hồi
                </Button>
              )}
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
