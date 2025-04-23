import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  HStack,
  Circle,
  Stack,
  Spinner,
  Center,
  SimpleGrid,
  Heading,
  Divider,
  Link,
  Image,
} from "@chakra-ui/react";
import {
  appColorTheme,
  serviceOrderStatusConstants,
} from "../../../../../config/appconfig.js";
import { useGetAllOrderProgressByOrderIdQuery } from "../../../../../services/orderProgressApi.js";
import { useGetShipmentsByServiceOrderIdQuery } from "../../../../../services/shipmentApi.js";
import { useTrackOrderByCodeMutation } from "../../../../../services/ghnApi.js";
import {
  formatDateTimeString,
  translateShippingStatus,
  formatDateString,
} from "../../../../../utils/utils.js";
import ghnLogo from "../../../../../assets/images/ghnLogo.webp";

export default function ProgressTab({ order, activeTabIndex, isActive }) {
  const { id } = useParams();
  const [trackingData, setTrackingData] = useState({});

  const {
    data: progressResponse,
    isLoading: isLoadingProgress,
    error: progressError,
    refetch: refetchProgress,
  } = useGetAllOrderProgressByOrderIdQuery(id);

  const {
    data: shipmentResponse,
    isLoading: isLoadingShipment,
    error: shipmentError,
    refetch: refetchShipment,
  } = useGetShipmentsByServiceOrderIdQuery(id);

  const [trackOrderByCode] = useTrackOrderByCodeMutation();

  // Refetch data when tab becomes active
  useEffect(() => {
    if (isActive) {
      refetchProgress();
      refetchShipment();
    }
  }, [isActive, refetchProgress, refetchShipment]);

  // Fetch tracking information when shipment data is available
  useEffect(() => {
    const fetchTrackingData = async () => {
      if (shipmentResponse?.data) {
        for (const shipment of shipmentResponse.data) {
          if (shipment.orderCode && shipment.orderCode !== "string") {
            try {
              const response = await trackOrderByCode({
                order_code: shipment.orderCode,
              }).unwrap();

              setTrackingData((prev) => ({
                ...prev,
                [shipment.orderCode]: response.data.data,
              }));
            } catch (error) {
              console.error("Error fetching tracking data:", error);
            }
          }
        }
      }
    };

    if (isActive && shipmentResponse?.data) {
      fetchTrackingData();
    }
  }, [shipmentResponse, isActive, trackOrderByCode]);

  const progressItems = progressResponse?.data || [];
  const shipmentItems = shipmentResponse?.data || [];

  // Check if order is cancelled
  const isOrderCancelled = order?.status == serviceOrderStatusConstants.DA_HUY;

  // Get service type to determine progress flow
  const serviceType = order?.service?.service?.serviceName;

  // Define progress steps based on service type
  let progressSteps = [];

  switch (serviceType) {
    case "Personalization":
      progressSteps = [
        serviceOrderStatusConstants.DANG_CHO_THO_DUYET,
        serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_LICH_HEN,
        serviceOrderStatusConstants.DA_DUYET_LICH_HEN,
        serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_HOP_DONG,
        serviceOrderStatusConstants.DA_DUYET_HOP_DONG,
        serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_THIET_KE,
        serviceOrderStatusConstants.DA_DUYET_THIET_KE,
        serviceOrderStatusConstants.DANG_GIA_CONG,
        serviceOrderStatusConstants.DANG_GIAO_HANG_LAP_DAT,
        serviceOrderStatusConstants.DA_HOAN_TAT,
      ];
      break;
    case "Customization":
      progressSteps = [
        serviceOrderStatusConstants.DANG_CHO_THO_DUYET,
        serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_LICH_HEN,
        serviceOrderStatusConstants.DA_DUYET_LICH_HEN,
        serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_HOP_DONG,
        serviceOrderStatusConstants.DA_DUYET_HOP_DONG,
        serviceOrderStatusConstants.DANG_GIA_CONG,
        serviceOrderStatusConstants.DANG_GIAO_HANG_LAP_DAT,
        serviceOrderStatusConstants.DA_HOAN_TAT,
      ];
      break;
    case "Sale":
      progressSteps = [
        serviceOrderStatusConstants.DANG_CHO_THO_DUYET,
        serviceOrderStatusConstants.DANG_GIAO_HANG_LAP_DAT,
        serviceOrderStatusConstants.DA_HOAN_TAT,
      ];
      break;
  }

  // Display loading state
  if (isLoadingProgress || isLoadingShipment) {
    return (
      <Center h="200px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  // Display error state
  if (progressError || shipmentError) {
    return (
      <Center h="200px">
        <Text>Đã có lỗi xảy ra khi tải thông tin</Text>
      </Center>
    );
  }

  // Map of status values that exist in API response
  const existingStatusMap = {};
  progressItems.forEach((item) => {
    existingStatusMap[item.status] = true;
  });

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      {/* Left Column - Progress Timeline */}
      <Box bg="white" borderRadius="10px" p={5} boxShadow="md">
        <Heading as="h3" size="md" mb={4}>
          Tiến độ đơn hàng
        </Heading>

        {progressItems.length === 0 ? (
          <Center p={8}>
            <Text fontSize="lg" color="gray.500">
              Chưa có thông tin tiến độ
            </Text>
          </Center>
        ) : isOrderCancelled ? (
          // If order is cancelled, only display actual progress from API
          <Stack spacing={6} position="relative">
            {progressItems.map((progress, index) => (
              <HStack align="start" key={progress.progressId} spacing={4}>
                <Box position="relative">
                  <Circle
                    size="32px"
                    bg={appColorTheme.brown_2}
                    color="white"
                    fontWeight="bold"
                  >
                    {index + 1}
                  </Circle>
                  {index < progressItems.length - 1 && (
                    <Box
                      position="absolute"
                      top="32px"
                      left="50%"
                      transform="translateX(-50%)"
                      width="2px"
                      height="70px"
                      bg="gray.300"
                    />
                  )}
                </Box>

                <Box flex="1">
                  <Text fontWeight="bold">{progress.status}</Text>
                </Box>

                <Text whiteSpace="nowrap">
                  {formatDateTimeString(new Date(progress.createdTime))}
                </Text>
              </HStack>
            ))}
          </Stack>
        ) : (
          // If order is not cancelled, display the full predefined flow with opacity
          <Stack spacing={6} position="relative">
            {progressSteps.map((status, index) => {
              const progress = progressItems.find((p) => p.status === status);
              const isCompleted = !!progress;

              return (
                <HStack
                  align="start"
                  key={index}
                  spacing={4}
                  opacity={isCompleted ? 1 : 0.5}
                >
                  <Box position="relative">
                    <Circle
                      size="32px"
                      bg={appColorTheme.brown_2}
                      color="white"
                      fontWeight="bold"
                    >
                      {index + 1}
                    </Circle>
                    {index < progressSteps.length - 1 && (
                      <Box
                        position="absolute"
                        top="32px"
                        left="50%"
                        transform="translateX(-50%)"
                        width="2px"
                        height="70px"
                        bg={isCompleted ? "gray.300" : "gray.100"}
                      />
                    )}
                  </Box>

                  <Box flex="1">
                    <Text fontWeight={isCompleted ? "bold" : "normal"}>
                      {status}
                    </Text>
                  </Box>

                  <Text whiteSpace="nowrap">
                    {progress
                      ? formatDateTimeString(new Date(progress.createdTime))
                      : ""}
                  </Text>
                </HStack>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Right Column - Shipment Information */}
      <Box bg="white" borderRadius="10px" p={5} boxShadow="md">
        <Heading as="h3" size="md" mb={4}>
          Thông tin vận chuyển
        </Heading>

        {shipmentItems.length === 0 ? (
          <Center p={8}>
            <Text fontSize="lg" color="gray.500">
              Chưa có thông tin vận chuyển
            </Text>
          </Center>
        ) : (
          <Stack spacing={10}>
            {shipmentItems.map((shipment) => (
              <Box key={shipment.shipmentId}>
                <Stack spacing={3} divider={<Divider />}>
                  {shipment.shipType && (
                    <HStack>
                      {shipment.shipType.toLowerCase().includes("ghn") && (
                        <Image
                          src={ghnLogo}
                          alt="GHN Logo"
                          height="25px"
                          objectFit="contain"
                          ml={2}
                        />
                      )}
                      <Text
                        color={appColorTheme.brown_2}
                        fontWeight="bold"
                        fontSize="18px"
                      >
                        {shipment.shipType}
                      </Text>
                    </HStack>
                  )}

                  <HStack alignItems="flex-start">
                    <Text fontWeight="bold" minW="120px">
                      Địa chỉ giao:
                    </Text>
                    <Text>{shipment.toAddress || "Chưa cập nhật"}</Text>
                  </HStack>

                  {shipment.fromAddress && (
                    <HStack alignItems="flex-start">
                      <Text fontWeight="bold" minW="120px">
                        Địa chỉ lấy hàng:
                      </Text>
                      <Text>{shipment.fromAddress}</Text>
                    </HStack>
                  )}

                  {shipment.shippingUnit && (
                    <HStack>
                      <Text fontWeight="bold" minW="120px">
                        Đơn vị vận chuyển:
                      </Text>
                      <Text>{shipment.shippingUnit}</Text>
                    </HStack>
                  )}

                  {shipment.orderCode && shipment.orderCode !== "string" && (
                    <Stack mt={5}>
                      <HStack>
                        <Text fontWeight="bold" minW="120px">
                          Mã vận đơn:
                        </Text>
                        <Text>{shipment.orderCode}</Text>
                      </HStack>
                      <Link
                        target="_blank"
                        href={`https://donhang.ghn.vn/?order_code=${shipment.orderCode}`}
                        color={appColorTheme.brown_2}
                        mb={2}
                      >
                        Tra cứu
                      </Link>
                      <HStack>
                        <Text fontWeight="bold" minW="120px">
                          Ngày giao dự kiến:
                        </Text>
                        <Text>
                          {trackingData[shipment.orderCode]?.leadtime
                            ? formatDateString(
                                new Date(
                                  trackingData[shipment.orderCode].leadtime
                                )
                              )
                            : "Không có thông tin"}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="bold" minW="120px">
                          Trạng thái vận chuyển:
                        </Text>
                        <Text>
                          {trackingData[shipment.orderCode]?.status
                            ? translateShippingStatus(
                                trackingData[shipment.orderCode].status
                              )
                            : "Không có thông tin"}
                        </Text>
                      </HStack>
                    </Stack>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </SimpleGrid>
  );
}
