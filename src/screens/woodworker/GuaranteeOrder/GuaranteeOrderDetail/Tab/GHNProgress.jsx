import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { appColorTheme } from "../../../../../config/appconfig";
import {
  formatDateString,
  formatDateTimeString,
  translateShippingStatus,
} from "../../../../../utils/utils";

export default function GHNProgress({ shipment, trackingData }) {
  const openTrackingLink = () => {
    Linking.openURL(`https://donhang.ghn.vn/?order_code=${shipment.orderCode}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.labelText}>Mã vận đơn:</Text>
        <Text>{shipment.orderCode}</Text>
      </View>

      <TouchableOpacity onPress={openTrackingLink} style={styles.linkButton}>
        <Text style={styles.linkText}>Tra cứu</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.labelText}>Ngày giao dự kiến:</Text>
        <Text>
          {trackingData[shipment.orderCode]?.leadtime
            ? formatDateString(trackingData[shipment.orderCode].leadtime)
            : "Không có thông tin"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.labelText}>Trạng thái vận chuyển:</Text>
        <Text>
          {trackingData[shipment.orderCode]?.status
            ? translateShippingStatus(trackingData[shipment.orderCode].status)
            : "Không có thông tin"}
        </Text>
      </View>

      {trackingData[shipment.orderCode]?.finish_date && (
        <View style={styles.row}>
          <Text style={styles.labelText}>Ngày giao hàng cho khách:</Text>
          <Text>
            {formatDateTimeString(
              trackingData[shipment.orderCode]?.finish_date
            )}
          </Text>
        </View>
      )}

      {/* Shipping Progress Timeline */}
      {trackingData[shipment.orderCode]?.log &&
        trackingData[shipment.orderCode].log.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Tiến trình vận chuyển:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timelineContainer}
            >
              {trackingData[shipment.orderCode].log.map(
                (item, index, array) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineCircle} />
                    <Text style={styles.timelineDate}>
                      {formatDateTimeString(item.updated_date)}
                    </Text>
                    <Text style={styles.timelineStatus}>
                      {translateShippingStatus(item.status)}
                    </Text>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  labelText: {
    fontWeight: "bold",
    minWidth: 120,
  },
  linkButton: {
    marginBottom: 8,
  },
  linkText: {
    color: appColorTheme.brown_2,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  timelineContainer: {
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineItem: {
    alignItems: "center",
    minWidth: 150,
    marginRight: 20,
    position: "relative",
  },
  timelineCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: appColorTheme.brown_2,
    marginBottom: 8,
    zIndex: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  timelineStatus: {
    marginTop: 8,
    fontWeight: "500",
    textAlign: "center",
  },
});
