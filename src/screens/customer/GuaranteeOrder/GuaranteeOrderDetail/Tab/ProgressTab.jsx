import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import {
  appColorTheme,
  guaranteeOrderStatusConstants,
} from "../../../../../config/appconfig.js";
import { useGetAllOrderProgressByGuaranteeOrderIdQuery } from "../../../../../services/orderProgressApi.js";
import { useGetShipmentsByGuaranteeOrderIdQuery } from "../../../../../services/shipmentApi.js";
import { useTrackOrderByCodeMutation } from "../../../../../services/ghnApi.js";
import {
  formatDateTimeString,
  translateShippingStatus,
  formatDateString,
} from "../../../../../utils/utils.js";
import ghnLogo from "../../../../../assets/images/ghnLogo.webp";

export default function ProgressTab({ order, activeTabIndex, isActive }) {
  const route = useRoute();
  const { id: orderId } = route.params || order?.guaranteeOrderId;
  const [trackingData, setTrackingData] = useState({});

  const {
    data: progressResponse,
    isLoading: isLoadingProgress,
    error: progressError,
    refetch: refetchProgress,
  } = useGetAllOrderProgressByGuaranteeOrderIdQuery(orderId);

  const {
    data: shipmentResponse,
    isLoading: isLoadingShipment,
    error: shipmentError,
    refetch: refetchShipment,
  } = useGetShipmentsByGuaranteeOrderIdQuery(orderId);

  const [trackOrderByCode] = useTrackOrderByCodeMutation();

  useEffect(() => {
    if (isActive) {
      refetchProgress();
      refetchShipment();
    }
  }, [isActive, refetchProgress, refetchShipment]);

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

  const isOrderCancelled =
    order?.status == guaranteeOrderStatusConstants.DA_HUY;

  let progressSteps = [];
  if (order?.isGuarantee) {
    progressSteps = [
      guaranteeOrderStatusConstants.DANG_CHO_THO_MOC_XAC_NHAN,
      guaranteeOrderStatusConstants.DANG_CHO_NHAN_HANG,
      guaranteeOrderStatusConstants.DANG_SUA_CHUA,
      guaranteeOrderStatusConstants.DANG_GIAO_HANG_LAP_DAT,
      guaranteeOrderStatusConstants.DA_HOAN_TAT,
    ];
  } else {
    progressSteps = [
      guaranteeOrderStatusConstants.DANG_CHO_THO_MOC_XAC_NHAN,
      guaranteeOrderStatusConstants.DANG_CHO_KHACH_DUYET_LICH_HEN,
      guaranteeOrderStatusConstants.DA_DUYET_LICH_HEN,
      guaranteeOrderStatusConstants.DANG_CHO_KHACH_DUYET_BAO_GIA,
      guaranteeOrderStatusConstants.DA_DUYET_BAO_GIA,
      guaranteeOrderStatusConstants.DANG_CHO_NHAN_HANG,
      guaranteeOrderStatusConstants.DANG_SUA_CHUA,
      guaranteeOrderStatusConstants.DANG_GIAO_HANG_LAP_DAT,
      guaranteeOrderStatusConstants.DA_HOAN_TAT,
    ];
  }

  if (isLoadingProgress || isLoadingShipment) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (progressError || shipmentError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Đã có lỗi xảy ra khi tải thông tin</Text>
      </View>
    );
  }

  const existingStatusMap = {};
  progressItems.forEach((item) => {
    existingStatusMap[item.status] = true;
  });

  return (
    <ScrollView style={styles.container}>
      {/* Progress Timeline */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tiến độ đơn hàng</Text>

        {progressItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có thông tin tiến độ</Text>
          </View>
        ) : isOrderCancelled ? (
          // If order is cancelled, only display actual progress from API
          <View style={styles.timelineContainer}>
            {progressItems.map((progress, index) => (
              <View key={progress.progressId} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={styles.timelineIcon}>
                    <Text style={styles.timelineIconText}>{index + 1}</Text>
                  </View>
                  {index < progressItems.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{progress.status}</Text>
                  <Text style={styles.timelineDate}>
                    {formatDateTimeString(new Date(progress.createdTime))}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          // If order is not cancelled, display the full predefined flow with opacity
          <View style={styles.timelineContainer}>
            {progressSteps.map((status, index) => {
              const progress = progressItems.find((p) => p.status === status);
              const isCompleted = !!progress;

              return (
                <View
                  key={index}
                  style={[
                    styles.timelineItem,
                    { opacity: isCompleted ? 1 : 0.5 },
                  ]}
                >
                  <View style={styles.timelineIconContainer}>
                    <View style={styles.timelineIcon}>
                      <Text style={styles.timelineIconText}>{index + 1}</Text>
                    </View>
                    {index < progressSteps.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          {
                            backgroundColor: isCompleted
                              ? "#CBD5E0"
                              : "#EDF2F7",
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineTitle,
                        { fontWeight: isCompleted ? "bold" : "normal" },
                      ]}
                    >
                      {status}
                    </Text>
                    {progress && (
                      <Text style={styles.timelineDate}>
                        {formatDateTimeString(new Date(progress.createdTime))}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Shipment Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin vận chuyển</Text>

        {shipmentItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có thông tin vận chuyển</Text>
          </View>
        ) : (
          <View style={styles.shipmentContainer}>
            {shipmentItems.map((shipment) => (
              <View key={shipment.shipmentId} style={styles.shipmentItem}>
                {shipment.shipType && (
                  <View style={styles.shipmentHeader}>
                    {shipment.shipType.toLowerCase().includes("ghn") && (
                      <Image
                        source={ghnLogo}
                        style={styles.shipmentLogo}
                        resizeMode="contain"
                      />
                    )}
                    <Text style={styles.shipmentType}>{shipment.shipType}</Text>
                  </View>
                )}

                <View style={styles.shipmentInfoRow}>
                  <Text style={styles.shipmentInfoLabel}>Địa chỉ giao:</Text>
                  <Text style={styles.shipmentInfoValue}>
                    {shipment.toAddress || "Chưa cập nhật"}
                  </Text>
                </View>

                {shipment.fromAddress && (
                  <View style={styles.shipmentInfoRow}>
                    <Text style={styles.shipmentInfoLabel}>
                      Địa chỉ lấy hàng:
                    </Text>
                    <Text style={styles.shipmentInfoValue}>
                      {shipment.fromAddress}
                    </Text>
                  </View>
                )}

                {shipment.shippingUnit && (
                  <View style={styles.shipmentInfoRow}>
                    <Text style={styles.shipmentInfoLabel}>
                      Đơn vị vận chuyển:
                    </Text>
                    <Text style={styles.shipmentInfoValue}>
                      {shipment.shippingUnit}
                    </Text>
                  </View>
                )}

                {shipment.orderCode && shipment.orderCode !== "string" && (
                  <View style={styles.shipmentTrackingContainer}>
                    <View style={styles.shipmentInfoRow}>
                      <Text style={styles.shipmentInfoLabel}>Mã vận đơn:</Text>
                      <Text style={styles.shipmentInfoValue}>
                        {shipment.orderCode}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.trackingLink}
                      onPress={() =>
                        Linking.openURL(
                          `https://donhang.ghn.vn/?order_code=${shipment.orderCode}`
                        )
                      }
                    >
                      <Text style={styles.trackingLinkText}>Tra cứu</Text>
                    </TouchableOpacity>

                    <View style={styles.shipmentInfoRow}>
                      <Text style={styles.shipmentInfoLabel}>
                        Ngày giao dự kiến:
                      </Text>
                      <Text style={styles.shipmentInfoValue}>
                        {trackingData[shipment.orderCode]?.leadtime
                          ? formatDateString(
                              new Date(
                                trackingData[shipment.orderCode].leadtime
                              )
                            )
                          : "Không có thông tin"}
                      </Text>
                    </View>

                    <View style={styles.shipmentInfoRow}>
                      <Text style={styles.shipmentInfoLabel}>
                        Trạng thái vận chuyển:
                      </Text>
                      <Text style={styles.shipmentInfoValue}>
                        {trackingData[shipment.orderCode]?.status
                          ? translateShippingStatus(
                              trackingData[shipment.orderCode].status
                            )
                          : "Không có thông tin"}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: appColorTheme.brown_2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timelineIconContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: appColorTheme.brown_2,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineIconText: {
    color: "white",
    fontWeight: "bold",
  },
  timelineLine: {
    position: "absolute",
    top: 32,
    width: 2,
    height: 70,
    backgroundColor: "#CBD5E0",
    alignSelf: "center",
  },
  timelineContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  timelineTitle: {
    flex: 1,
    fontWeight: "bold",
  },
  timelineDate: {
    color: "#4A5568",
  },
  shipmentContainer: {
    marginTop: 8,
  },
  shipmentItem: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 16,
  },
  shipmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  shipmentLogo: {
    height: 25,
    width: 50,
    marginRight: 8,
  },
  shipmentType: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
    fontSize: 18,
  },
  shipmentInfoRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  shipmentInfoLabel: {
    fontWeight: "bold",
    width: 120,
  },
  shipmentInfoValue: {
    flex: 1,
  },
  shipmentTrackingContainer: {
    marginTop: 16,
  },
  trackingLink: {
    marginVertical: 8,
  },
  trackingLinkText: {
    color: appColorTheme.brown_2,
    textDecorationLine: "underline",
  },
});
