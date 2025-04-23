import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiCalendar, FiCheck, FiX } from "react-icons/fi";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import { useAcceptGuaranteeOrderMutation } from "../../../../../../services/guaranteeOrderApi.js";
import CheckboxList from "../../../../../../components/Utility/CheckboxList.jsx";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import { validateAppointment } from "../../../../../../validations/index.js";

export default function AppointmentUpdateModal({ order, refetch }) {
  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const notify = useNotify();

  // API mutation
  const [acceptServiceOrder, { isLoading }] = useAcceptGuaranteeOrderMutation();

  // Button disable state for checkboxes
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData from form and convert to object
      const formData = new FormData(e.target);
      const formDataObj = Object.fromEntries(formData);

      // Prepare data for validation and API
      const apiData = {
        serviceOrderId: order.guaranteeOrderId,
        ...formDataObj,
      };

      // Validate form data
      const errors = validateAppointment(formDataObj);
      if (errors.length > 0) {
        notify("Lỗi xác thực", errors[0], "error");
        return;
      }

      // If validation passes, proceed with API call
      await acceptServiceOrder(apiData).unwrap();

      notify(
        "Lịch hẹn đã được cập nhật",
        "Thông tin lịch hẹn đã được lưu thành công",
        "success"
      );
      refetch();
      onClose();
    } catch (error) {
      notify(
        "Đã xảy ra lỗi",
        error.message || "Không thể cập nhật lịch hẹn, vui lòng thử lại sau",
        "error"
      );
    }
  };

  const confirmationItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  // Get appointment data from order if available
  const appointment = order?.consultantAppointment || {};

  return (
    <>
      <Button
        py={1}
        px={2}
        color={appColorTheme.blue_0}
        bg="none"
        border={`1px solid ${appColorTheme.blue_0}`}
        _hover={{ bg: appColorTheme.blue_0, color: "white" }}
        leftIcon={<FiCalendar />}
        onClick={onOpen}
      >
        {order?.isGuarantee
          ? "Cập nhật lịch hẹn tư vấn để xem xét lại chuyển sang sửa chữa"
          : "Cập nhật lịch hẹn tư vấn về báo giá sửa chữa"}
      </Button>

      <Modal
        size="5xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cập nhật lịch hẹn</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1" pb={6}>
            <form onSubmit={handleSubmit}>
              <Box>
                <Heading
                  fontWeight="bold"
                  fontSize="20px"
                  mb={6}
                  textAlign="center"
                >
                  Thông tin lịch hẹn
                </Heading>

                <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
                  <Grid templateColumns="100px 1fr" gap={5}>
                    <GridItem>
                      <Text fontWeight="bold" mb={2}>
                        Hình thức:
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Select
                        name="form"
                        placeholder="Chọn hình thức"
                        defaultValue={appointment.form || ""}
                        required
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                      </Select>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold" mb={2}>
                        Địa điểm:
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Input
                        name="meetAddress"
                        placeholder="Địa điểm"
                        defaultValue={appointment.meetAddress || ""}
                        required
                      />
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold" mb={2}>
                        Ngày hẹn:
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Input
                        type="datetime-local"
                        name="timeMeeting"
                        placeholder="Ngày hẹn"
                        defaultValue={appointment.dateTime}
                        required
                      />
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold" mb={2}>
                        Mô tả:
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Textarea
                        name="desc"
                        placeholder="Mô tả"
                        defaultValue={appointment.content || ""}
                        required
                      />
                    </GridItem>
                  </Grid>
                </Box>
              </Box>

              <Box mt={6}>
                <CheckboxList
                  items={confirmationItems}
                  setButtonDisabled={setIsButtonDisabled}
                />
              </Box>

              <HStack mt={10}>
                <Spacer />
                <Button
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Đang lưu"
                  leftIcon={<FiCheck />}
                  isDisabled={isButtonDisabled}
                >
                  Cập nhật
                </Button>
                <Button onClick={onClose} leftIcon={<FiX />}>
                  Đóng
                </Button>
              </HStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
