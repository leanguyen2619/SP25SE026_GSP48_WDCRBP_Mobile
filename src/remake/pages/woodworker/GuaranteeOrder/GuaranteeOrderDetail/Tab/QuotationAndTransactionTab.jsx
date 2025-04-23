import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Stack,
  HStack,
  Text,
  SimpleGrid,
  Badge,
  Spacer,
  Center,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { useGetByGuaranteeOrderMutation } from "../../../../../services/quotationApi.js";
import { useGetAllOrderDepositByGuaranteeOrderIdQuery } from "../../../../../services/orderDepositApi.js";
import {
  formatPrice,
  formatDateTimeString,
} from "../../../../../utils/utils.js";

export default function QuotationAndTransactionTab({
  activeTabIndex,
  isActive,
  order,
}) {
  const [quotationData, setQuotationData] = useState(null);
  const [isQuotationLoading, setIsQuotationLoading] = useState(false);
  const [quotationError, setQuotationError] = useState(null);

  // Use the API hook
  const [getByGuaranteeOrder] = useGetByGuaranteeOrderMutation();

  // Fetch deposit data using guaranteeOrderId from the order
  const {
    data: depositsResponse,
    isLoading: isDepositsLoading,
    error: depositsError,
    refetch: refetchDeposits,
  } = useGetAllOrderDepositByGuaranteeOrderIdQuery(order?.guaranteeOrderId);

  // Function to fetch quotation data
  const fetchQuotationData = async () => {
    if (!order?.guaranteeOrderId) return;

    try {
      setIsQuotationLoading(true);
      const response = await getByGuaranteeOrder({
        guaranteeOrderId: parseInt(order.guaranteeOrderId),
      }).unwrap();
      setQuotationData(response.data || null);
      setQuotationError(null);
    } catch (error) {
      console.error("Error fetching quotation:", error);
      setQuotationError(error);
      setQuotationData(null);
    } finally {
      setIsQuotationLoading(false);
    }
  };

  // Refetch data when tab becomes active
  useEffect(() => {
    if (isActive && order?.guaranteeOrderId) {
      fetchQuotationData();
      refetchDeposits();
    }
  }, [isActive, order?.guaranteeOrderId, refetchDeposits]);

  const deposits = depositsResponse?.data || [];

  // Calculate total quotation amount
  const calculateTotalPrice = (quotationDetails = []) => {
    return (
      quotationDetails?.reduce(
        (total, detail) => total + (detail.costAmount || 0),
        0
      ) || 0
    );
  };

  const quotationDetails = quotationData?.quotationDetails || [];
  const totalQuotationAmount = calculateTotalPrice(quotationDetails);

  // Loading state
  if (isQuotationLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        {/* Quotation Information */}
        <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
          <Heading fontWeight="bold" as="h3" fontSize="20px" mb={6}>
            Báo giá chi tiết
          </Heading>

          {isQuotationLoading ? (
            <Center py={8}>
              <Spinner size="md" color={appColorTheme.brown_2} />
            </Center>
          ) : quotationError ? (
            <Center py={8}>
              <Text color="red.500">
                Đã có lỗi xảy ra khi tải thông tin báo giá
              </Text>
            </Center>
          ) : quotationDetails.length === 0 ? (
            <Center py={8}>
              <Text color="gray.500">Chưa có thông tin báo giá</Text>
            </Center>
          ) : (
            <Stack spacing={4}>
              <Box overflowX="auto">
                <Table variant="simple" size="lg">
                  <Thead>
                    <Tr>
                      <Th>STT</Th>
                      <Th>Loại chi phí</Th>
                      <Th>Số lượng cần dùng</Th>
                      <Th>Chi phí</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {quotationDetails.map((detail, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{detail.costType}</Td>
                        <Td>{detail.quantityRequired}</Td>
                        <Td>{formatPrice(detail.costAmount)}</Td>
                      </Tr>
                    ))}
                    <Tr>
                      <Td colSpan={3} textAlign="right" fontWeight="bold">
                        Phí vận chuyển:
                      </Td>
                      <Td>{formatPrice(order?.shipFee)}</Td>
                    </Tr>
                    <Tr>
                      <Td colSpan={3} textAlign="right" fontWeight="bold">
                        Tổng chi phí:
                      </Td>
                      <Td
                        fontSize="20px"
                        color={appColorTheme.brown_2}
                        fontWeight="bold"
                      >
                        {formatPrice(totalQuotationAmount + order?.shipFee)}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Stack>
          )}
        </Box>

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
                    {formatPrice(order?.totalAmount)}
                  </Text>
                </HStack>

                <HStack>
                  <Text fontWeight="bold">Số tiền đã thanh toán:</Text>
                  <Text fontWeight="bold" color={appColorTheme.brown_2}>
                    {formatPrice(order?.amountPaid || 0)}
                  </Text>
                </HStack>

                <HStack>
                  <Text fontWeight="bold">Số tiền còn lại:</Text>
                  <Text fontWeight="bold" color={appColorTheme.brown_2}>
                    {formatPrice(order?.amountRemaining || 0)}
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
                      Đặt cọc lần {deposit.depositNumber}:
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

                  {deposit.description && (
                    <HStack>
                      <Text fontWeight="bold">Ghi chú:</Text>
                      <Text>{deposit.description}</Text>
                    </HStack>
                  )}
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
