import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  HStack,
  Spacer,
  Tabs,
  TabList,
  Tab,
  Flex,
  Icon,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useGetGuaranteeOrderByIdQuery } from "../../../../../services/guaranteeOrderApi";
import { appColorTheme } from "../../../../../config/appconfig";
import useAuth from "../../../../../hooks/useAuth";
import ActionBar from "../ActionModal/ActionBar/ActionBar.jsx";
import { FiActivity, FiFile, FiFileText } from "react-icons/fi";
import GeneralInformationTab from "../Tab/GeneralInformationTab.jsx";
import ProcessTab from "../Tab/ProgressTab.jsx";
import { useGetAllOrderDepositByGuaranteeOrderIdQuery } from "../../../../../services/orderDepositApi";
import { useState } from "react";
import QuotationAndTransactionTab from "../Tab/QuotationAndTransactionTab.jsx";

export default function WWGuaranteeOrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useGetGuaranteeOrderByIdQuery(id);

  const {
    data: depositsResponse,
    isLoading: isDepositsLoading,
    error: depositsError,
  } = useGetAllOrderDepositByGuaranteeOrderIdQuery(id);

  const order = data?.data;
  const deposits = depositsResponse?.data || [];
  const { auth } = useAuth();

  // Track active tab index
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Handle tab change
  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  if (isLoading || isDepositsLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  if (error || depositsError) {
    return (
      <Center h="200px">
        <Text>Đã có lỗi xảy ra khi tải thông tin đơn bảo hành</Text>
      </Center>
    );
  }

  if (
    auth?.userId != order?.user?.userId &&
    auth?.wwId != order?.woodworker?.woodworkerId
  ) {
    return (
      <Center h="200px">
        <Text>Không có quyền truy cập vào thông tin đơn bảo hành này</Text>
      </Center>
    );
  }

  return (
    <Box>
      <HStack mb={6}>
        <Box>
          <HStack spacing={2}>
            <Heading
              color={appColorTheme.brown_2}
              fontSize="2xl"
              fontFamily="Montserrat"
            >
              Chi tiết đơn #{order.guaranteeOrderId}
            </Heading>

            <Box
              top={5}
              right={5}
              bgColor={appColorTheme.brown_2}
              p={2}
              color="white"
              borderRadius="15px"
            >
              {order?.status || "Đang xử lý"}
            </Box>
          </HStack>

          {order?.feedback && (
            <Text mt={2} fontSize="md">
              <b>Phản hồi của khách hàng:</b> {order?.feedback}
            </Text>
          )}
        </Box>

        <Spacer />

        <Box>
          <HStack spacing={4}>
            <ActionBar
              order={order}
              deposits={deposits}
              refetch={refetch}
              status={order?.status}
              feedback={order?.feedback}
            />
          </HStack>
        </Box>
      </HStack>

      <Box color="black">
        <Tabs
          variant="unstyled"
          onChange={handleTabChange}
          index={activeTabIndex}
        >
          <TabList
            overflowX="auto"
            display="flex"
            flexWrap={{ base: "nowrap", md: "wrap" }}
            whiteSpace="nowrap"
          >
            {[
              { label: "Chung", icon: FiFileText },
              { label: "Tiến độ", icon: FiActivity },
              { label: "Báo giá & Giao dịch", icon: FiFile },
            ].map((tab, index) => (
              <Tab
                key={index}
                _selected={{
                  bgColor: "app_brown.0",
                }}
                borderBottom="2px solid"
                borderBottomColor="app_brown.1"
                borderTopLeftRadius="10px"
                borderTopRightRadius="10px"
                mr={1}
              >
                <Flex align="center" gap={1}>
                  <Icon as={tab.icon} />
                  <Text>{tab.label}</Text>
                </Flex>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <GeneralInformationTab
                order={order}
                activeTabIndex={activeTabIndex}
                isActive={activeTabIndex === 0}
              />
            </TabPanel>
            <TabPanel p={0}>
              <ProcessTab
                order={order}
                activeTabIndex={activeTabIndex}
                isActive={activeTabIndex === 1}
              />
            </TabPanel>
            <TabPanel p={0}>
              <QuotationAndTransactionTab
                order={order}
                activeTabIndex={activeTabIndex}
                isActive={activeTabIndex === 2}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}
