import {
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  Link as ChakraLink,
  Spacer,
} from "@chakra-ui/react";
import {
  appColorTheme,
  getServiceTypeLabel,
  service,
} from "../../../../../config/appconfig.js";
import {
  formatDateTimeString,
  formatDateTimeToVietnamese,
} from "../../../../../utils/utils.js";
import CustomizationProductList from "./CustomizationProductList.jsx";
import StarRating from "../../../../../components/Utility/StarRating.jsx";
import PersonalizationProductList from "./PersonalizationProductList.jsx";
import SaleProductList from "./SaleProductList.jsx";

export default function GeneralInformationTab({ order }) {
  const serviceName = order?.service?.service?.serviceName;

  return (
    <Box>
      {serviceName == "Personalization" && (
        <PersonalizationProductList
          orderId={order?.orderId}
          products={order?.requestedProduct}
          totalAmount={order?.totalAmount}
        />
      )}
      {serviceName == "Customization" && (
        <CustomizationProductList
          shipFee={order?.shipFee}
          products={order?.requestedProduct}
          totalAmount={order?.totalAmount}
        />
      )}
      {serviceName == "Sale" && (
        <SaleProductList
          shipFee={order?.shipFee}
          products={order?.requestedProduct}
          totalAmount={order?.totalAmount}
        />
      )}

      <SimpleGrid
        mt={6}
        columns={{
          base: 1,
          xl: 2,
        }}
        spacing={6}
      >
        <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
          <Box>
            <Heading fontWeight="bold" as="h3" fontSize="20px" mb={6}>
              Thông tin đơn hàng
            </Heading>

            <Stack spacing={4}>
              <HStack>
                <Text fontWeight="bold">Mã đơn hàng:</Text>
                <Text>{order?.orderId || "Chưa cập nhật"}</Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Loại dịch vụ:</Text>
                <Text>
                  {getServiceTypeLabel(order?.service?.service?.serviceName)}
                </Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Ngày đặt:</Text>
                <Text>
                  {order?.createdAt
                    ? formatDateTimeString(new Date(order.createdAt))
                    : "Chưa cập nhật"}
                </Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Số lượng sản phẩm:</Text>
                <Text>{order?.quantity || "Chưa cập nhật"}</Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold">Yêu cầu lắp đặt bởi xưởng:</Text>
                <Text>
                  {order?.install ? "Có lắp đặt" : "Không cần lắp đặt"}
                </Text>
              </HStack>

              <Box>
                <Text fontWeight="bold">Ghi chú:</Text>
                <Text>{order?.description || "Không có ghi chú"}</Text>
              </Box>
            </Stack>
          </Box>
        </Box>

        {serviceName != "Sale" && (
          <Box bgColor="white" boxShadow="md" p={5} borderRadius="10px">
            <Heading fontWeight="bold" as="h3" fontSize="20px" mb={4}>
              Thông tin lịch hẹn tư vấn bàn hợp đồng
            </Heading>

            <Stack spacing={4}>
              {order?.consultantAppointment ? (
                <>
                  <HStack>
                    <Text fontWeight="bold">Hình thức:</Text>
                    <Text>{order.consultantAppointment.form}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="bold">Địa điểm:</Text>
                    <Text>{order.consultantAppointment.meetAddress}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="bold">Ngày giờ hẹn:</Text>
                    <Text>
                      {formatDateTimeToVietnamese(
                        new Date(order.consultantAppointment.dateTime)
                      )}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="bold">Mô tả:</Text>
                    <Text>
                      {order.consultantAppointment.content || "Không có mô tả"}
                    </Text>
                  </HStack>
                </>
              ) : (
                <Text color="gray.500">Không có lịch hẹn tư vấn</Text>
              )}
            </Stack>
          </Box>
        )}
      </SimpleGrid>

      <Box bgColor="white" boxShadow="md" p={5} borderRadius="10px" mt={6}>
        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={20}>
          <Box>
            <Stack spacing={3}>
              <Heading fontWeight="bold" as="h3" fontSize="20px" mb={4}>
                Thông tin xưởng mộc
              </Heading>

              <Text>
                <b>Tên xưởng mộc:</b>{" "}
                {order?.service?.wwDto?.brandName || "Chưa cập nhật"}
              </Text>

              <Text>
                <b>Địa chỉ:</b>{" "}
                {order?.service?.wwDto?.address || "Chưa cập nhật"}
              </Text>

              <HStack>
                <Spacer />
                <ChakraLink
                  target="_blank"
                  href={`/woodworker/${order?.service?.wwDto?.woodworkerId}`}
                >
                  <Text
                    color={appColorTheme.brown_2}
                    _hover={{ textDecoration: "underline" }}
                  >
                    Xem xưởng
                  </Text>
                </ChakraLink>
              </HStack>
            </Stack>
          </Box>

          <Box>
            {order?.review ? (
              <>
                {order?.review?.status ? (
                  <>
                    <Stack spacing={3}>
                      <Heading fontWeight="bold" as="h3" fontSize="20px" mb={4}>
                        Đánh giá
                      </Heading>

                      <HStack>
                        <Text fontWeight="bold">Số sao:</Text>
                        <StarRating rating={order.review.rating} />
                      </HStack>

                      <HStack>
                        <Text fontWeight="bold">Bình luận:</Text>
                        <Text>{order.review.comment}</Text>
                      </HStack>

                      <HStack>
                        <Text fontWeight="bold">Ngày đăng:</Text>
                        <Text>
                          {formatDateTimeString(
                            new Date(order.review.createdAt)
                          )}
                        </Text>
                      </HStack>
                    </Stack>
                  </>
                ) : (
                  <Text color="gray.500">(Đánh giá chưa được duyệt)</Text>
                )}
              </>
            ) : (
              <Text color="gray.500">(Chưa có đánh giá)</Text>
            )}
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
