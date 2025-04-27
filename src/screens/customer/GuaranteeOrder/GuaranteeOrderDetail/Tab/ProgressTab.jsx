import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
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
  const { id } = useParams();
  const [trackingData, setTrackingData] = useState({});

  const {
    data: progressResponse,
    isLoading: isLoadingProgress,
    error: progressError,
    refetch: refetchProgress,
  } = useGetAllOrderProgressByGuaranteeOrderIdQuery(id);

  const {
    data: shipmentResponse,
    isLoading: isLoadingShipment,
    error: shipmentError,
    refetch: refetchShipment,
  } = useGetShipmentsByGuaranteeOrderIdQuery(id);

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

  const handleTrackShipment = (orderCode) => {
    Linking.openURL(`https://donhang.ghn.vn/?order_code=${orderCode}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gridContainer}>
        {/* Progress Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tiến độ đơn hàng</Text>

          {progressItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có thông tin tiến độ</Text>
            </View>
          ) : isOrderCancelled ? (
            <View style={styles.progressContainer}>
              {progressItems.map((progress, index) => (
                <View key={progress.progressId} style={styles.progressItem}>
                  <View style={styles.progressIndicator}>
                    <View style={styles.progressCircle}>
                      <Text style={styles.progressNumber}>{index + 1}</Text>
                    </View>
                    {index < progressItems.length - 1 && (
                      <View style={styles.progressLine} />
                    )}
                  </View>

                  <View style={styles.progressContent}>
                    <Text style={styles.progressStatus}>{progress.status}</Text>
                    <Text style={styles.progressTime}>
                      {formatDateTimeString(new Date(progress.createdTime))}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.progressContainer}>
              {progressSteps.map((status, index) => {
                const progress = progressItems.find((p) => p.status === status);
                const isCompleted = !!progress;

                return (
                  <View
                    key={index}
                    style={[
                      styles.progressItem,
                      !isCompleted && styles.incompleteItem,
                    ]}
                  >
                    <View style={styles.progressIndicator}>
                      <View
                        style={[
                          styles.progressCircle,
                          !isCompleted && styles.incompleteCircle,
                        ]}
                      >
                        <Text
                          style={[
                            styles.progressNumber,
                            !isCompleted && styles.incompleteNumber,
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      {index < progressSteps.length - 1 && (
                        <View
                          style={[
                            styles.progressLine,
                            !isCompleted && styles.incompleteLine,
                          ]}
                        />
                      )}
                    </View>

                    <View style={styles.progressContent}>
                      <Text
                        style={[
                          styles.progressStatus,
                          !isCompleted && styles.incompleteStatus,
                        ]}
                      >
                        {status}
                      </Text>
                      {progress && (
                        <Text style={styles.progressTime}>
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
              {shipmentItems.map((shipment, index) => (
                <View key={shipment.shipmentId} style={styles.shipmentItem}>
                  <View style={styles.shipmentHeader}>
                    <Image source={ghnLogo} style={styles.shipmentLogo} />
                    <Text style={styles.shipmentCode}>
                      Mã vận đơn: {shipment.orderCode}
                    </Text>
                  </View>

                  <View style={styles.shipmentInfo}>
                    <Text style={styles.shipmentLabel}>Trạng thái:</Text>
                    <Text style={styles.shipmentValue}>
                      {translateShippingStatus(
                        trackingData[shipment.orderCode]?.status
                      )}
                    </Text>
                  </View>

                  <View style={styles.shipmentInfo}>
                    <Text style={styles.shipmentLabel}>Ngày tạo:</Text>
                    <Text style={styles.shipmentValue}>
                      {formatDateString(new Date(shipment.createdAt))}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => handleTrackShipment(shipment.orderCode)}
                  >
                    <Text style={styles.trackButtonText}>Theo dõi đơn hàng</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gridContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: appColorTheme.brown_2,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    gap: 24,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  incompleteItem: {
    opacity: 0.5,
  },
  progressIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: appColorTheme.brown_2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incompleteCircle: {
    backgroundColor: '#ccc',
  },
  progressNumber: {
    color: 'white',
    fontWeight: 'bold',
  },
  incompleteNumber: {
    color: '#666',
  },
  progressLine: {
    width: 2,
    height: 70,
    backgroundColor: '#ccc',
    marginTop: 8,
  },
  incompleteLine: {
    backgroundColor: '#eee',
  },
  progressContent: {
    flex: 1,
  },
  progressStatus: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  incompleteStatus: {
    fontWeight: 'normal',
  },
  progressTime: {
    color: '#666',
  },
  shipmentContainer: {
    gap: 16,
  },
  shipmentItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  shipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shipmentLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  shipmentCode: {
    fontWeight: 'bold',
  },
  shipmentInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  shipmentLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  shipmentValue: {
    flex: 1,
  },
  trackButton: {
    backgroundColor: appColorTheme.brown_2,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  trackButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
