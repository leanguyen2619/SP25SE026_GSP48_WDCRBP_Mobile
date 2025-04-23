import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useSubmitFeedbackMutation } from "../../../../../../services/guaranteeOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { FiEdit, FiSend, FiXCircle } from "react-icons/fi";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { validateFeedback } from "../../../../../../validations";

export default function FeedbackModal({ serviceOrderId, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notify = useNotify();
  const [sendFeedback, { isLoading }] = useSubmitFeedbackMutation();
  const initialRef = useRef(null);
  const [feedback, setFeedback] = useState("");
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for validation
      const data = {
        feedback: feedback,
      };

      // Validate data
      const errors = validateFeedback(data);
      if (errors.length > 0) {
        notify("Lỗi xác thực", errors[0], "error");
        return;
      }

      // If validation passes, proceed with API call
      await sendFeedback({
        serviceOrderId: serviceOrderId,
        feedback: feedback,
      }).unwrap();

      notify(
        "Gửi phản hồi thành công",
        "Xưởng mộc sẽ sớm xem xét phản hồi của bạn",
        "success"
      );

      onClose();
      setFeedback(""); // Reset form
      refetch(); // Refresh data
    } catch (err) {
      notify(
        "Gửi phản hồi thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <Button
        variant="outline"
        leftIcon={<FiEdit />}
        colorScheme="blue"
        onClick={onOpen}
      >
        Gửi phản hồi
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={isLoading ? null : onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gửi phản hồi</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Nội dung phản hồi</FormLabel>
                <Textarea
                  ref={initialRef}
                  value={feedback}
                  onChange={handleFeedbackChange}
                  placeholder="Nhập phản hồi của bạn"
                  rows={4}
                />
              </FormControl>

              {feedback && feedback.trim() !== "" && (
                <>
                  <Divider my={2} />
                  <CheckboxList
                    items={checkboxItems}
                    setButtonDisabled={setIsCheckboxDisabled}
                  />
                </>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              variant="ghost"
              mr={3}
              onClick={onClose}
              leftIcon={<FiXCircle />}
            >
              Đóng
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={
                !feedback || feedback.trim() === "" || isCheckboxDisabled
              }
              leftIcon={<FiSend />}
            >
              Gửi phản hồi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
