import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  appColorTheme,
  getServiceTypeLabel,
} from "../../../../config/appconfig";
import { formatDateString, formatPrice } from "../../../../utils/utils";

export default function ServiceInfoSection({ orderDetail, serviceName }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thông tin dịch vụ</Text>
      <View style={styles.grid}>
        <View style={styles.row}>
          <Text style={styles.label}>Mã đơn hàng:</Text>
          <Text style={styles.value}>#{orderDetail?.orderId}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Loại dịch vụ:</Text>
          <Text style={styles.value}>{getServiceTypeLabel(serviceName)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ngày cam kết hoàn thành:</Text>
          <Text style={styles.value}>
            {orderDetail?.completeDate
              ? formatDateString(orderDetail?.completeDate)
              : "Chưa cập nhật"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tổng tiền đã thanh toán:</Text>
          <Text style={[styles.value, { color: appColorTheme.brown_2 }]}>
            {formatPrice(orderDetail?.amountPaid)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Khách hàng:</Text>
          <Text style={styles.value}>
            {orderDetail?.user?.username || "N/A"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>SĐT Khách hàng:</Text>
          <Text style={styles.value}>{orderDetail?.user?.phone || "N/A"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Xưởng mộc:</Text>
          <TouchableOpacity>
            <Text style={styles.link}>
              {orderDetail?.service?.wwDto?.brandName}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>SĐT xưởng mộc:</Text>
          <Text style={styles.value}>
            {orderDetail?.service?.wwDto?.phone || "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  grid: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    width: 150,
  },
  value: {
    flex: 1,
  },
  link: {
    color: appColorTheme.brown_2,
  },
});
