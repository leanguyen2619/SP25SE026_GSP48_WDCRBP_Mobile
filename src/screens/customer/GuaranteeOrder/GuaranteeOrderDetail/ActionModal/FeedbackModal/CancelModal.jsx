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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useSendServiceOrderFeedbackMutation } from "../../../../../../services/serviceOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { FiAlertCircle, FiXCircle, FiXOctagon } from "react-icons/fi";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { validateFeedback } from "../../../../../../validations";

export default function CancelModal({ serviceOrderId, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notify = useNotify();
  const [sendFeedback, { isLoading }] = useSendServiceOrderFeedbackMutation();
  const initialRef = useRef(null);
  const [reason, setReason] = useState("");
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for validation
      const data = {
        feedback: reason, // Using the same validation as feedback
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
        feedback: `[HỦY ĐƠN] ${reason}`,
      }).unwrap();

      notify(
        "Đã gửi yêu cầu hủy",
        "Yêu cầu hủy đơn hàng đã được gửi tới xưởng mộc",
        "success"
      );

      onClose();
      setReason(""); // Reset form
      refetch(); // Refresh data
    } catch (err) {
      notify(
        "Gửi yêu cầu thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <Button
        leftIcon={<FiXOctagon />}
        colorScheme="red"
        variant="outline"
        onClick={onOpen}
      >
        Yêu cầu hủy đơn
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
          <ModalHeader>Yêu cầu hủy đơn</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Text color="red.500">
                Bạn đang yêu cầu hủy đơn hàng này. Vui lòng cung cấp lý do rõ
                ràng.
              </Text>
              <FormControl>
                <FormLabel>Lý do hủy đơn</FormLabel>
                <Textarea
                  ref={initialRef}
                  value={reason}
                  onChange={handleReasonChange}
                  placeholder="Nhập lý do hủy đơn của bạn"
                  rows={4}
                />
              </FormControl>

              {reason && reason.trim() !== "" && (
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
              colorScheme="red"
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={!reason || reason.trim() === "" || isCheckboxDisabled}
              leftIcon={<FiAlertCircle />}
            >
              Gửi yêu cầu hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
