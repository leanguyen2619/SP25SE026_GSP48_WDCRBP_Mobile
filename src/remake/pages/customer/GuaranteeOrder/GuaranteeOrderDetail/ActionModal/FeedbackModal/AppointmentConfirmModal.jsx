import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Divider,
  useDisclosure,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAcceptGuaranteeOrderMutation } from "../../../../../../services/guaranteeOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { FiCheck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { formatDateTimeToVietnamese } from "../../../../../../utils/utils";

export default function AppointmentConfirmModal({
  serviceOrderId,
  appointment,
  buttonText = "Xác nhận",
  refetch,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notify = useNotify();
  const [acceptOrder, { isLoading }] = useAcceptGuaranteeOrderMutation();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleSubmit = async () => {
    try {
      await acceptOrder({
        serviceOrderId: serviceOrderId,
      }).unwrap();

      notify(
        "Xác nhận thành công",
        "Đơn hàng của bạn đã được cập nhật",
        "success"
      );

      onClose();
      refetch(); // Refresh data
    } catch (err) {
      notify(
        "Xác nhận thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <Button leftIcon={<FiCheckCircle />} colorScheme="green" onClick={onOpen}>
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={isLoading ? null : onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{buttonText}</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Text fontSize="lg" fontWeight="bold">
                Chi tiết lịch hẹn
              </Text>

              {appointment && (
                <Box p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                  <Grid templateColumns="120px 1fr" gap={3}>
                    <GridItem>
                      <Text fontWeight="semibold">Ngày hẹn:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>
                        {formatDateTimeToVietnamese(appointment.dateTime)}
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold">Hình thức:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{appointment.form || "Không có"}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold">Địa điểm:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{appointment.meetAddress || "Không có"}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold">Mô tả:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{appointment.content || "Không có"}</Text>
                    </GridItem>
                  </Grid>
                </Box>
              )}

              <Divider my={2} />
              <CheckboxList
                items={checkboxItems}
                setButtonDisabled={setIsCheckboxDisabled}
              />
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
              colorScheme="green"
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={isCheckboxDisabled}
              leftIcon={<FiCheck />}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
