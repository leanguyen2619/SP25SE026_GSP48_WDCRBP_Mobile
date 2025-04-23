import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEye, FiSend } from "react-icons/fi";
import {
  appColorTheme,
  complaintStatusConstants,
  getComplaintStatusColor,
  getServiceTypeLabel,
} from "../../../../config/appconfig";
import {
  formatDateString,
  formatDateTimeString,
  formatPrice,
} from "../../../../utils/utils";
import { useNotify } from "../../../../components/Utility/Notify";
import { useUpdateComplaintWoodworkerMutation } from "../../../../services/complaintApi";
import ImageListSelector from "../../../../components/Utility/ImageListSelector";
import PersonalizationProductList from "../../../customer/ServiceOrder/ServiceOrderDetail/Tab/PersonalizationProductList";
import CustomizationProductList from "../../../customer/ServiceOrder/ServiceOrderDetail/Tab/CustomizationProductList";
import SaleProductList from "../../../customer/ServiceOrder/ServiceOrderDetail/Tab/SaleProductList";

export default function ComplaintDetailModal({ complaint, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const notify = useNotify();
  const [response, setResponse] = useState(complaint?.woodworkerResponse || "");
  const [updateComplaintWoodworker, { isLoading }] =
    useUpdateComplaintWoodworkerMutation();

  // Extract service name and order details
  const serviceName =
    complaint?.serviceOrderDetail?.service?.service?.serviceName;
  const orderDetail = complaint?.serviceOrderDetail;

  const handleSubmit = async () => {
    if (!response.trim()) {
      notify("Lỗi", "Vui lòng nhập nội dung phản hồi", "error");
      return;
    }

    try {
      const requestBody = {
        complaintId: complaint.complaintId,
        woodworkerResponse: response,
      };

      await updateComplaintWoodworker(requestBody).unwrap();

      notify("Thành công", "Đã gửi phản hồi khiếu nại thành công", "success");

      onClose();
      refetch && refetch();
    } catch (error) {
      notify(
        "Lỗi",
        error.data?.message || "Không thể gửi phản hồi khiếu nại",
        "error"
      );
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
        size="6xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Chi tiết khiếu nại #{complaint?.complaintId}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bgColor="app_grey.1" pb={6}>
            {/* Complaint Information */}
            <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* Left side: Complaint details */}
                <Box>
                  <Heading size="md" mb={4}>
                    Thông tin khiếu nại
                  </Heading>
                  <Grid templateColumns="150px 1fr" gap={3}>
                    <GridItem>
                      <Text fontWeight="bold">Mã khiếu nại:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>#{complaint?.complaintId}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold">Loại khiếu nại:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{complaint?.complaintType}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold">Khách hàng:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{orderDetail?.user?.username || "N/A"}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold">Ngày tạo:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>
                        {formatDateTimeString(new Date(complaint?.createdAt))}
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold">Trạng thái:</Text>
                    </GridItem>
                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        color={getComplaintStatusColor(complaint?.status)}
                      >
                        {complaint?.status}
                      </Text>
                    </GridItem>

                    {complaint?.staffUser && (
                      <>
                        <GridItem>
                          <Text fontWeight="bold">Nhân viên xử lý:</Text>
                        </GridItem>
                        <GridItem>
                          <Text>{complaint?.staffUser?.username}</Text>
                        </GridItem>
                      </>
                    )}
                  </Grid>
                </Box>

                {/* Right side: Service Information */}
                <Box>
                  <Heading size="md" mb={4}>
                    Thông tin dịch vụ
                  </Heading>
                  <Grid templateColumns="150px 1fr" gap={3}>
                    <GridItem>
                      <Text fontWeight="bold">Mã đơn hàng:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>#{orderDetail?.orderId}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold">Loại dịch vụ:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{getServiceTypeLabel(serviceName)}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold">Ngày cam kết hoàn thành:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>
                        {orderDetail?.completeDate
                          ? formatDateString(orderDetail?.completeDate)
                          : "Chưa cập nhật"}
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="bold">Tổng tiền đã thanh toán:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={appColorTheme.brown_2}>
                        {formatPrice(orderDetail?.amountPaid)}
                      </Text>
                    </GridItem>
                  </Grid>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Product Information - Using the components from GeneralInformationTab */}
            {serviceName && (
              <Box mb={4}>
                {serviceName === "Personalization" && (
                  <PersonalizationProductList
                    orderId={orderDetail?.orderId}
                    products={orderDetail?.requestedProduct}
                    totalAmount={orderDetail?.totalAmount}
                  />
                )}

                {serviceName === "Customization" && (
                  <CustomizationProductList
                    shipFee={orderDetail?.shipFee}
                    products={orderDetail?.requestedProduct}
                    totalAmount={orderDetail?.totalAmount}
                  />
                )}

                {serviceName === "Sale" && (
                  <SaleProductList
                    shipFee={orderDetail?.shipFee}
                    products={orderDetail?.requestedProduct}
                    totalAmount={orderDetail?.totalAmount}
                  />
                )}
              </Box>
            )}

            {/* Complaint Description and Images */}
            <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={4}>
              <Heading size="md" mb={4}>
                Nội dung khiếu nại
              </Heading>
              <Text whiteSpace="pre-wrap">{complaint?.description}</Text>

              {complaint?.proofImgUrls && (
                <Box mt={4}>
                  <Text fontWeight="bold" mb={2}>
                    Hình ảnh minh chứng:
                  </Text>
                  <ImageListSelector
                    imgH={150}
                    imgUrls={complaint.proofImgUrls}
                  />
                </Box>
              )}
            </Box>

            {/* Response Section */}
            <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={4}>
              <Heading size="md" mb={4}>
                Phản hồi của bạn
              </Heading>
              <VStack spacing={4} align="stretch">
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Nhập nội dung phản hồi của bạn đối với khiếu nại này..."
                  rows={6}
                  isDisabled={
                    complaint?.status != complaintStatusConstants.PENDING ||
                    isLoading
                  }
                />
                <HStack justify="space-between">
                  {complaint?.status == complaintStatusConstants.PENDING && (
                    <Button
                      leftIcon={<FiSend />}
                      colorScheme="blue"
                      onClick={handleSubmit}
                      isLoading={isLoading}
                      isDisabled={!response.trim() || response.length > 1000}
                    >
                      Gửi phản hồi
                    </Button>
                  )}
                </HStack>
              </VStack>
            </Box>

            {/* Staff Response (if exists) */}
            {complaint?.staffResponse && (
              <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={4}>
                <Heading size="md" mb={4}>
                  Phản hồi từ nhân viên nền tảng
                </Heading>
                <Text whiteSpace="pre-wrap">{complaint?.staffResponse}</Text>
              </Box>
            )}

            {/* Refund Information (if exists) */}
            {complaint?.refundAmount > 0 && (
              <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={4}>
                <Heading size="md" mb={4}>
                  Thông tin hoàn tiền
                </Heading>
                <Grid templateColumns="150px 1fr" gap={3}>
                  <GridItem>
                    <Text fontWeight="bold">Số tiền hoàn:</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="semibold" color="green.500">
                      {formatPrice(complaint?.refundAmount)}
                    </Text>
                  </GridItem>

                  <GridItem>
                    <Text fontWeight="bold">Ngày hoàn tiền:</Text>
                  </GridItem>
                  <GridItem>
                    <Text>
                      {complaint?.refundCreditTransaction?.createdAt
                        ? formatDateTimeString(
                            new Date(
                              complaint?.refundCreditTransaction?.createdAt
                            )
                          )
                        : "Chưa cập nhật"}
                    </Text>
                  </GridItem>
                </Grid>
              </Box>
            )}

            <HStack justify="flex-end" mt={6}>
              <Button onClick={onClose}>Đóng</Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
