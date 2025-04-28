import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

export default function OrderSelection({
  completedOrders,
  selectedOrderId,
  handleOrderSelect,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chọn đơn hàng đã hoàn thành</Text>

      {completedOrders.length === 0 ? (
        <View style={styles.alert}>
          <Ionicons name="information-circle" size={24} color="#3182CE" />
          <Text style={styles.alertText}>
            Không tìm thấy đơn hàng đã hoàn thành nào.
          </Text>
        </View>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedOrderId}
            onValueChange={(itemValue) => handleOrderSelect(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Chọn đơn hàng" value="" />
            {completedOrders.map((order) => (
              <Picker.Item
                key={order.orderId}
                label={`Đơn #${order.orderId} - ${format(
                  new Date(order.createdAt),
                  "dd/MM/yyyy"
                )} - ${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.totalAmount)}`}
                value={order.orderId.toString()}
              />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  heading: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 15,
  },
  alert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    padding: 12,
    borderRadius: 6,
  },
  alertText: {
    marginLeft: 8,
    color: "#2C5282",
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
