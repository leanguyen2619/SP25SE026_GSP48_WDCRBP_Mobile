import {
  Box,
  Heading,
  FormControl,
  Select,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { format } from "date-fns";

export default function OrderSelection({
  completedOrders,
  selectedOrderId,
  handleOrderSelect,
}) {
  return (
    <Box bg="white" p={5} borderRadius="10px" boxShadow="sm">
      <Heading size="md" mb={4}>
        Chọn đơn hàng đã hoàn thành
      </Heading>

      {completedOrders.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Không tìm thấy đơn hàng đã hoàn thành nào.
        </Alert>
      ) : (
        <FormControl isRequired>
          <Select
            placeholder="Chọn đơn hàng"
            value={selectedOrderId}
            onChange={handleOrderSelect}
            size="lg"
          >
            {completedOrders.map((order) => (
              <option key={order.orderId} value={order.orderId}>
                Đơn #{order.orderId} -{" "}
                {format(new Date(order.createdAt), "dd/MM/yyyy")} -
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.totalAmount)}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
