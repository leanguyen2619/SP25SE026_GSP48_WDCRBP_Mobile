import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  HStack,
  Icon,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FiStar, FiCheck, FiXCircle } from "react-icons/fi";
import { useCreateGuaranteeOrderReviewMutation } from "../../../../../../services/reviewApi";
import { useNotify } from "../../../../../../components/Utility/Notify";

export default function ReviewModal({ guaranteeOrderId, userId, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading }] = useCreateGuaranteeOrderReviewMutation();
  const notify = useNotify();

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredRating) => {
    setHoveredRating(hoveredRating);
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      notify("Thiếu thông tin", "Vui lòng nhập nội dung đánh giá", "error");
      return;
    }

    try {
      const reviewData = {
        userId: userId,
        guaranteeOrderId: guaranteeOrderId,
        rating: rating,
        comment: comment.trim(),
      };

      await createReview(reviewData).unwrap();
      notify("Thành công", "Đánh giá của bạn đã được gửi", "success");
      onClose();
      if (refetch) refetch();
    } catch (error) {
      notify(
        "Đánh giá thất bại",
        error.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại sau.",
        "error"
      );
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="green" leftIcon={<FiStar />}>
        Đánh giá
      </Button>

      <Modal
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Đánh giá đơn hàng</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody pb={6}>
            <FormControl mb={6}>
              <FormLabel fontWeight="bold">Đánh giá:</FormLabel>
              <HStack spacing={2} my={2}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    as={FiStar}
                    boxSize={8}
                    cursor="pointer"
                    color={
                      star <= (hoveredRating || rating)
                        ? "yellow.400"
                        : "gray.300"
                    }
                    fill={
                      star <= (hoveredRating || rating) ? "yellow.400" : "none"
                    }
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </HStack>
              <Text fontSize="sm" color="gray.500" mt={1}>
                {rating === 1 && "Rất không hài lòng"}
                {rating === 2 && "Không hài lòng"}
                {rating === 3 && "Bình thường"}
                {rating === 4 && "Hài lòng"}
                {rating === 5 && "Rất hài lòng"}
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Nội dung đánh giá:</FormLabel>
              <Textarea
                placeholder="Chia sẻ trải nghiệm của bạn với đơn hàng này..."
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </FormControl>

            <Alert status="info" mt={4}>
              <AlertIcon />
              Đánh giá của bạn sẽ giúp cải thiện chất lượng dịch vụ.
            </Alert>
          </ModalBody>

          <ModalFooter>
            <Button
              leftIcon={<FiXCircle />}
              onClick={onClose}
              mr={3}
              isLoading={isLoading}
              variant="ghost"
            >
              Đóng
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmitReview}
              isLoading={isLoading}
              leftIcon={<FiCheck />}
            >
              Gửi đánh giá
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
