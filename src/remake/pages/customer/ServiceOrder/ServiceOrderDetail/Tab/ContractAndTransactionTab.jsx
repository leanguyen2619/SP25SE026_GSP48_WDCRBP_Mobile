import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Stack,
  HStack,
  Text,
  SimpleGrid,
  Badge,
  Link as ChakraLink,
  Spacer,
  Image,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { useGetContractByServiceOrderIdQuery } from "../../../../../services/contractApi.js";
import { useGetAllOrderDepositByOrderIdQuery } from "../../../../../services/orderDepositApi.js";
import {
  formatPrice,
  formatDateTimeString,
  formatDateString,
} from "../../../../../utils/utils.js";

export default function ContractAndTransactionTab({
  activeTabIndex,
  isActive,
  order,
}) {
  const serviceName = order?.service?.service?.serviceName;
  const { id } = useParams();

  // Fetch contract data
  const {
    data: contractResponse,
    isLoading: isContractLoading,
    error: contractError,
    refetch: refetchContract,
  } = useGetContractByServiceOrderIdQuery(id);

  // Fetch deposit data
  const {
    data: depositsResponse,
    isLoading: isDepositsLoading,
    error: depositsError,
    refetch: refetchDeposits,
  } = useGetAllOrderDepositByOrderIdQuery(id);

  // Refetch data when tab becomes active
  useEffect(() => {
    if (isActive) {
      refetchContract();
      refetchDeposits();
    }
  }, [isActive, refetchContract, refetchDeposits]);

  const contract = contractResponse?.data;
  const deposits = depositsResponse?.data || [];

  // Loading state
  if (isContractLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  // Error state
  if (contractError) {
    return (
      <Center h="200px">
        <Text>Đã có lỗi xảy ra khi tải thông tin hợp đồng</Text>
      </Center>
    );
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        {/* Contract Information */}

        {serviceName != "Sale" && (
          <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
            <Heading fontWeight="bold" as="h3" fontSize="20px" mb={6}>
              Thông tin hợp đồng
            </Heading>

            {contract ? (
              <Stack spacing={4}>
                <HStack>
                  <Text fontWeight="bold">Họ tên người đại diện:</Text>
                  <Text>
                    {contract?.woodworker?.username || "Chưa cập nhật"}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">SĐT người đại diện:</Text>
                  <Text>{contract?.woodworker?.phone || "Chưa cập nhật"}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Email người đại diện:</Text>
                  <Text>{contract?.woodworker?.email || "Chưa cập nhật"}</Text>
                </HStack>

                <Box height="10px" />

                <HStack>
                  <Text fontWeight="bold">Họ tên khách hàng:</Text>
                  <Text>{contract?.customer?.username || "Chưa cập nhật"}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">SĐT khách hàng:</Text>
                  <Text>{contract?.customer?.phone || "Chưa cập nhật"}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Email khách hàng:</Text>
                  <Text>{contract?.customer?.email || "Chưa cập nhật"}</Text>
                </HStack>

                <Box height="10px" />

                <HStack>
                  <Text fontWeight="bold">Mã hợp đồng:</Text>
                  <Text>{contract.contractId || "Chưa cập nhật"}</Text>
                </HStack>

                <Box>
                  <Text fontWeight="bold">Điều khoản của xưởng mộc:</Text>
                  <Text whiteSpace={"pre-wrap"}>
                    {contract.woodworkerTerms || "Chưa cập nhật"}
                  </Text>
                </Box>

                <HStack>
                  <Text fontWeight="bold">Ngày ký:</Text>
                  <Text>
                    {contract.signDate
                      ? formatDateString(new Date(contract.signDate))
                      : "Chưa cập nhật"}
                  </Text>
                </HStack>

                <HStack>
                  <Text fontWeight="bold">
                    Ngày cam kết hoàn thành sản phẩm:
                  </Text>
                  <Text>
                    {contract.completeDate
                      ? formatDateString(new Date(contract.completeDate))
                      : "Chưa cập nhật"}
                  </Text>
                </HStack>

                <HStack>
                  <Text fontWeight="bold">Giá trị hợp đồng:</Text>
                  <Text fontWeight="bold" color={appColorTheme.brown_2}>
                    {contract.contractTotalAmount
                      ? formatPrice(contract.contractTotalAmount)
                      : "Chưa cập nhật"}
                  </Text>
                </HStack>

                <HStack>
                  <Text fontWeight="bold">Thời hạn bảo hành:</Text>
                  <Text>
                    {contract.warrantyPeriod
                      ? formatDateTimeString(new Date(contract.warrantyPeriod))
                      : "Chưa cập nhật"}
                  </Text>
                </HStack>

                <HStack>
                  <Box>
                    <Text fontWeight="bold">Chữ ký người đại diện</Text>
                    {contract.woodworkerSignature ? (
                      <Image
                        mt={4}
                        height="100px"
                        src={contract.woodworkerSignature}
                        fallbackSrc="https://via.placeholder.com/200x100?text=Chữ+ký+thợ+mộc"
                      />
                    ) : (
                      <Box
                        mt={4}
                        height="100px"
                        width="200px"
                        bg="gray.100"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="gray.500">Chưa có chữ ký</Text>
                      </Box>
                    )}
                  </Box>
                  <Spacer />

                  <Box>
                    <Text fontWeight="bold">Chữ ký khách hàng</Text>
                    {contract.customerSignature ? (
                      <Image
                        mt={4}
                        height="100px"
                        src={contract.customerSignature}
                        fallbackSrc="https://via.placeholder.com/200x100?text=Chữ+ký+khách+hàng"
                      />
                    ) : (
                      <Box
                        mt={4}
                        height="100px"
                        width="200px"
                        bg="gray.100"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="gray.500">Chưa có chữ ký</Text>
                      </Box>
                    )}
                  </Box>
                </HStack>

                <HStack>
                  <Spacer />

                  <ChakraLink
                    target="_blank"
                    textDecoration="underline"
                    color={appColorTheme.brown_2}
                    href={`/contract/${order.orderId}`}
                  >
                    Xem chi tiết
                  </ChakraLink>
                </HStack>
              </Stack>
            ) : (
              <Center py={8}>
                <Text color="gray.500">Chưa có thông tin hợp đồng</Text>
              </Center>
            )}
          </Box>
        )}

        {/* Deposit/Transaction Information */}
        <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
          <Heading fontWeight="bold" as="h3" fontSize="20px" mb={6}>
            Thông tin giao dịch
          </Heading>

          {isDepositsLoading ? (
            <Center py={8}>
              <Spinner size="md" color={appColorTheme.brown_2} />
            </Center>
          ) : depositsError ? (
            <Center py={8}>
              <Text color="red.500">
                Đã có lỗi xảy ra khi tải thông tin thanh toán
              </Text>
            </Center>
          ) : deposits.length === 0 ? (
            <Center py={8}>
              <Text color="gray.500">Chưa có thông tin thanh toán</Text>
            </Center>
          ) : (
            <Stack spacing={4}>
              <Stack spacing={4}>
                <HStack>
                  <Text fontWeight="bold">Thành tiền:</Text>
                  <Text fontWeight="bold" color={appColorTheme.brown_2}>
                    {order?.totalAmount
                      ? formatPrice(order?.totalAmount)
                      : "Chưa cập nhật"}
                  </Text>
                </HStack>

                <HStack>
                  <Text fontWeight="bold">Số tiền đã thanh toán:</Text>
                  <Text fontWeight="bold" color={appColorTheme.brown_2}>
                    {formatPrice(order?.amountPaid)}
                  </Text>
                </HStack>

                <HStack>
                  <Text fontWeight="bold">Số tiền còn lại:</Text>
                  <Text fontWeight="bold" color={appColorTheme.brown_2}>
                    {formatPrice(order?.amountRemaining)}
                  </Text>
                </HStack>
              </Stack>

              <Spacer height="20px" />

              {deposits.map((deposit) => (
                <Stack
                  key={deposit.serviceDepositId}
                  spacing={4}
                  p={3}
                  bg={deposit.status ? "green.50" : "gray.50"}
                  borderRadius="md"
                >
                  <HStack>
                    <Text fontWeight="bold">
                      Đặt cọc lần {deposit.depositNumber}
                    </Text>
                    <Badge colorScheme={deposit.status ? "green" : "gray"}>
                      {deposit.status ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Badge>
                  </HStack>

                  <HStack>
                    <Text fontWeight="bold">Ngày tạo:</Text>
                    <Text>
                      {deposit.createdAt
                        ? formatDateTimeString(new Date(deposit.createdAt))
                        : "Chưa cập nhật"}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="bold">Ngày thanh toán:</Text>
                    <Text>
                      {deposit.updatedAt
                        ? formatDateTimeString(new Date(deposit.updatedAt))
                        : "Chưa cập nhật"}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="bold">Số tiền thanh toán:</Text>
                    <Text fontWeight="bold" color={appColorTheme.brown_2}>
                      {deposit.amount
                        ? formatPrice(deposit.amount)
                        : "Chưa cập nhật"}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="bold">Phần trăm cọc:</Text>
                    <Text>
                      {deposit.percent
                        ? `${deposit.percent}%`
                        : "Chưa cập nhật"}
                    </Text>
                  </HStack>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
