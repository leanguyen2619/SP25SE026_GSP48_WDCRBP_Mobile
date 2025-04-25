import React, { useEffect, useState } from "react";
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Stack,
  VStack,
  HStack,
  Divider,
  Link as ChakraLink,
  useColorModeValue,
  Flex,
  Button,
  Spacer,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import useAuth from "../../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios.js";
import {
  orderStatusColorMap,
  orderStatusMap,
  printOrderStatusColorMap,
  printOrderStatusMap,
} from "../../../config/appconfig.js";
import { Link as RouterLink } from "react-router-dom";

export default function AccountPage() {
  const { auth, setAuth } = useAuth();
  const [productOrders, setProductOrders] = useState(null);
  const [printOrders, setPrintOrders] = useState(null);

  function fetchProductOrders() {
    axios
      .get(`/Order/GetOrderByCustomerId?employeeId=${auth.EmployeeId}`)
      .then((response) => {
        const data = response.data;
        data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setProductOrders(data);
      })
      .catch((error) => {
        setProductOrders([]);
      });
  }

  function fetchPrintOrders() {
    axios
      .get(`/PrintOrder/GetAllPrintOrders`)
      .then((response) => {
        const data = response.data;
        const tmpPrintOrder = data.filter(
          (item) => item.customerId == auth.EmployeeId
        );
        tmpPrintOrder.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPrintOrders(tmpPrintOrder);
      })
      .catch((error) => {
        setPrintOrders([]);
      });
  }

  useEffect(() => {
    fetchProductOrders();
    fetchPrintOrders();
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth and redirect to login page
    setAuth(null);
    navigate("/auth");
  };

  function calculatePrice(orderDetail) {
    let sum = 0;

    orderDetail.forEach((item) => (sum += item.products.price));

    return sum.toLocaleString();
  }

  if (!printOrders) return <Spinner />;
  if (!productOrders) return <Spinner />;

  return (
    <Box minHeight="100vh" pb="40px">
      <Box mb={6}>
        <Heading
          fontWeight="normal"
          as="h2"
          fontSize="22px"
          fontFamily="Montserrat"
          textAlign="center"
        >
          Thông tin cá nhân
        </Heading>
      </Box>

      <Box
        bgColor="black"
        color="white"
        borderRadius="md"
        p={5}
        maxWidth="1000px"
        mx="auto"
      >
        <Tabs variant="enclosed">
          <Flex justify="space-between" align="center" mb={4}>
            <TabList>
              <Tab>Tài khoản</Tab>
              <Tab>Lịch sử mua hàng</Tab>
              <Tab>Đơn in</Tab>
            </TabList>
            <Button onClick={handleLogout} colorScheme="red" variant="outline">
              Đăng xuất
            </Button>
          </Flex>
          <TabPanels>
            <TabPanel>
              <VStack spacing={12} align="flex-start">
                <Text fontSize="lg">Tên khách hàng: {auth?.EmployeeName}</Text>
                <Text fontSize="lg">Email: {auth?.Email}</Text>
                <Text fontSize="lg">SĐT: {auth?.Phone}</Text>
                <Text fontSize="lg">Địa chỉ: {auth?.Address}</Text>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={12} align="stretch">
                {productOrders.map((order) => (
                  <Box
                    key={order.orderId}
                    borderWidth="1px"
                    borderRadius="md"
                    p={5}
                  >
                    <HStack justify="space-between">
                      <Text fontWeight="bold">Order #{order.orderId}</Text>
                      <Text color={orderStatusColorMap[order.orderStatus]}>
                        {orderStatusMap[order.orderStatus]}
                      </Text>
                    </HStack>
                    <Text>
                      Ngày đặt:{" "}
                      {new Date(order.orderDate).toLocaleString("vi-VN")}
                    </Text>
                    <Text>
                      Thành tiền: {order?.totalPrice?.toLocaleString() + " đ"}
                    </Text>
                    <Text
                      py="8px"
                      color={order?.payStatus ? "green" : "app_brown.0"}
                    >
                      {order?.payStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Text>
                    <Divider my={2} />
                    <Text fontWeight="bold">Sản phẩm:</Text>
                    <Stack spacing={0}>
                      {order.orderDetail.map((product, index) => (
                        <Text key={index}>
                          {product.products.name} - Số lượng: {product.quantity}
                        </Text>
                      ))}
                    </Stack>
                    <HStack>
                      <Spacer />
                      <RouterLink to={`/order/${order.orderId}`}>
                        <Text cursor="pointer" textDecor={"underline"}>
                          Xem chi tiết
                        </Text>
                      </RouterLink>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={12} align="stretch">
                {printOrders.map((order) => (
                  <Box
                    key={order.printOrderId}
                    borderWidth="1px"
                    borderRadius="md"
                    p={5}
                  >
                    <HStack justify="space-between">
                      <Text fontWeight="bold">Order #{order.printOrderId}</Text>
                      <Text color={printOrderStatusColorMap[order.status]}>
                        {printOrderStatusMap[order.status]}
                      </Text>
                    </HStack>
                    <Text>
                      Ngày đặt: {new Date(order?.date).toLocaleString("vi-VN")}
                    </Text>
                    <Text>
                      Thành tiền:{" "}
                      {order?.price
                        ? order.price.toLocaleString() + " đ"
                        : "Chưa cập nhật giá tiền"}
                    </Text>
                    <Text
                      py="8px"
                      color={order?.payStatus ? "green" : "app_brown.0"}
                    >
                      {order?.payStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Text>
                    <Divider my={2} />
                    <Text fontWeight="bold">
                      Đường dẫn đến thư mục:{" "}
                      <ChakraLink
                        href={order.fileLink}
                        isExternal
                        color="app_brown.0"
                      >
                        {order.fileLink}
                      </ChakraLink>
                    </Text>
                    <HStack>
                      <Spacer />
                      <RouterLink to={`/printorder/${order.printOrderId}`}>
                        <Text cursor="pointer" textDecor={"underline"}>
                          Xem chi tiết
                        </Text>
                      </RouterLink>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}
