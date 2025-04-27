import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useDisclosure,
  Select,
  FormHelperText,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import {
  appColorTheme,
  getServiceTypeLabel,
} from "../../../../config/appconfig";
import ImageUpload from "../../../../components/Utility/ImageUpload";
import { useCreateComplaintMutation } from "../../../../services/complaintApi";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import { formatDateTimeString } from "../../../../utils/utils";

export default function ComplaintCreateModal({ refetch, serviceOrders = [] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [proofImgUrls, setProofImgUrls] = useState("");
  const notify = useNotify();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [serviceOrderId, setServiceOrderId] = useState("");
  const [complaintType, setComplaintType] = useState("");

  const [createComplaint, { isLoading }] = useCreateComplaintMutation();

  const validateComplaintData = (data) => {
    const errors = [];
    if (!data.description || data.description.trim() === "") {
      errors.push("Vui lòng nhập nội dung khiếu nại");
    }
    if (!data.serviceOrderId) {
      errors.push("Vui lòng chọn đơn hàng");
    }
    if (!data.complaintType || data.complaintType.trim() === "") {
      errors.push("Vui lòng chọn loại khiếu nại");
    }
    if (!data.proofImgUrls || data.proofImgUrls.trim() === "") {
      errors.push("Vui lòng tải lên ít nhất một ảnh minh chứng");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      description: formData.get("description"),
      serviceOrderId: parseInt(serviceOrderId),
      complaintType: complaintType,
      proofImgUrls: proofImgUrls,
    };

    // Validate complaint data
    const errors = validateComplaintData(data);
    if (errors.length > 0) {
      notify("Lỗi khi tạo khiếu nại", errors.join("\n"), "error", 3000);
      return;
    }

    try {
      await createComplaint(data).unwrap();

      notify("Khiếu nại đã được gửi thành công", "", "success", 3000);

      setProofImgUrls("");
      setServiceOrderId("");
      setComplaintType("");
      onClose();
      refetch?.();
    } catch (error) {
      notify(
        "Lỗi khi tạo khiếu nại",
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
        Tạo khiếu nại mới
      </Button>

      <Modal
        size="3xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo khiếu nại mới</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1" pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Đơn hàng</FormLabel>
                  {serviceOrders.length === 0 ? (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      Không tìm thấy đơn hàng nào. Bạn cần có đơn hàng để tạo
                      khiếu nại.
                    </Alert>
                  ) : (
                    <>
                      <Select
                        placeholder="Chọn đơn hàng"
                        value={serviceOrderId}
                        onChange={(e) => setServiceOrderId(e.target.value)}
                        bg="white"
                      >
                        {serviceOrders.map((order) => (
                          <option key={order.orderId} value={order.orderId}>
                            #{order.orderId} -{" "}
                            {getServiceTypeLabel(
                              order.service?.service?.serviceName
                            )}{" "}
                            - {formatDateTimeString(order.createdAt)}
                          </option>
                        ))}
                      </Select>
                      <FormHelperText>
                        Chọn đơn hàng bạn muốn khiếu nại
                      </FormHelperText>
                    </>
                  )}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Loại khiếu nại</FormLabel>
                  <Select
                    placeholder="Chọn loại khiếu nại"
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value)}
                    bg="white"
                  >
                    <option value="Chất lượng sản phẩm">
                      Chất lượng sản phẩm
                    </option>
                    <option value="Tiến độ gia công">Tiến độ gia công</option>
                    <option value="Khác">Khác</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Nội dung khiếu nại</FormLabel>
                  <Textarea
                    name="description"
                    placeholder="Nhập nội dung khiếu nại chi tiết"
                    bg="white"
                    rows={8}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Hình ảnh minh chứng</FormLabel>
                  <ImageUpload
                    maxFiles={4}
                    onUploadComplete={(result) => {
                      setProofImgUrls(result);
                    }}
                  />
                  <FormHelperText>
                    Tải lên tối đa 4 hình ảnh minh chứng (hình ảnh sản phẩm, hóa
                    đơn,...)
                  </FormHelperText>
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
                    Gửi khiếu nại
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
