import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiEye } from "react-icons/fi";
import {
  appColorTheme,
  getComplaintStatusColor,
  getServiceTypeLabel,
} from "../../../../config/appconfig";
import {
  formatDateString,
  formatDateTimeString,
  formatPrice,
} from "../../../../utils/utils";
import ImageListSelector from "../../../../components/Utility/ImageListSelector";
import PersonalizationProductList from "../../ServiceOrder/ServiceOrderDetail/Tab/PersonalizationProductList";
import CustomizationProductList from "../../ServiceOrder/ServiceOrderDetail/Tab/CustomizationProductList";
import SaleProductList from "../../ServiceOrder/ServiceOrderDetail/Tab/SaleProductList";

export default function ComplaintDetailModal({ complaint }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  // Extract service name and order details
  const serviceName =
    complaint?.serviceOrderDetail?.service?.service?.serviceName;
  const orderDetail = complaint?.serviceOrderDetail;

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

                    <GridItem>
                      <Text fontWeight="bold">Xưởng mộc:</Text>
                    </GridItem>
                    <GridItem>
                      <Link
                        color={appColorTheme.brown_2}
                        isExternal
                        href={`/woodworker/${orderDetail?.service?.wwDto?.woodworkerId}`}
                      >
                        <Text>{orderDetail?.service?.wwDto?.brandName}</Text>
                      </Link>
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

                {!["Personalization", "Customization", "Sale"].includes(
                  serviceName
                ) && <Text>Không có thông tin chi tiết về sản phẩm</Text>}
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

            {/* Woodworker Response */}
            {complaint?.woodworkerResponse && (
              <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={4}>
                <Heading size="md" mb={4}>
                  Phản hồi từ xưởng mộc
                </Heading>
                <Text whiteSpace="pre-wrap">
                  {complaint?.woodworkerResponse}
                </Text>
              </Box>
            )}

            {/* Staff Response */}
            {complaint?.staffResponse && (
              <Box bg="white" p={5} borderRadius="lg" boxShadow="md" mb={4}>
                <Heading size="md" mb={4}>
                  Phản hồi từ nhân viên nền tảng
                </Heading>
                <Text whiteSpace="pre-wrap">{complaint?.staffResponse}</Text>
              </Box>
            )}

            {/* Refund Information */}
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
