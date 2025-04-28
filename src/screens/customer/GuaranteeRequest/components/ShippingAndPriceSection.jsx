import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Switch,
} from "react-native";
import { appColorTheme } from "../../../../config/appconfig.js";

export default function ShippingAndPriceSection({
  isInstall,
  setIsInstall,
  isCalculatingShipping,
  shippingFee,
  note,
  setNote,
  isGuarantee,
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.switchContainer}>
          <Switch
            value={isInstall}
            onValueChange={setIsInstall}
            trackColor={{ false: "#E2E8F0", true: appColorTheme.brown_2 }}
            thumbColor="#FFFFFF"
          />
          <Text style={styles.switchLabel}>
            Yêu cầu giao hàng + lắp đặt bởi xưởng
          </Text>
        </View>

        <Text style={styles.infoText}>
          {isInstall
            ? "Xưởng sẽ giao và lắp đặt sản phẩm sau khi sửa chữa / bảo hành xong."
            : "Sản phẩm sẽ được gửi về qua đơn vị vận chuyển sau khi sửa chữa / bảo hành."}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Updated price section to always show two-way shipping */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi phí vận chuyển:</Text>

        {isCalculatingShipping ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={appColorTheme.brown_2} />
            <Text style={styles.loadingText}>Đang tính phí vận chuyển...</Text>
          </View>
        ) : shippingFee > 0 ? (
          <View style={styles.priceList}>
            {/* Always show both directions */}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Chiều đi (Khách hàng → Xưởng):
              </Text>
              <Text style={styles.priceValue}>
                {formatCurrency(shippingFee)}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Chiều về (Xưởng → Khách hàng):
              </Text>
              <Text style={styles.priceValue}>
                {formatCurrency(shippingFee)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng phí vận chuyển:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(shippingFee * 2)}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>Không thể tính phí vận chuyển</Text>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi phí sửa chữa / bảo hành:</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Phí dịch vụ:</Text>
          <Text
            style={[
              styles.feeValue,
              isGuarantee ? styles.freeValue : styles.quoteValue,
            ]}
          >
            {isGuarantee ? "Miễn phí" : "Xưởng sẽ báo giá chi tiết sau"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.label}>Ghi chú bổ sung:</Text>
        <TextInput
          style={styles.textArea}
          value={note}
          onChangeText={setNote}
          placeholder="Thông tin bổ sung về yêu cầu sửa chữa / bảo hành..."
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
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
  section: {
    marginVertical: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  switchLabel: {
    marginLeft: 10,
    fontWeight: "500",
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 35,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },
  sectionTitle: {
    fontWeight: "500",
    marginBottom: 10,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 8,
  },
  priceList: {
    marginTop: 5,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    flex: 1,
  },
  priceValue: {
    fontWeight: "500",
    color: appColorTheme.brown_2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  totalLabel: {
    fontWeight: "700",
  },
  totalValue: {
    fontWeight: "700",
    color: appColorTheme.brown_2,
  },
  errorText: {
    color: "#E53E3E",
  },
  feeValue: {
    fontWeight: "700",
  },
  freeValue: {
    color: "#38A169",
  },
  quoteValue: {
    color: "#3182CE",
  },
  label: {
    fontWeight: "500",
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    fontSize: 14,
  },
});
