import React, { useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { useGetContractByServiceOrderIdQuery } from "../../../../../services/contractApi.js";
import { useGetAllOrderDepositByOrderIdQuery } from "../../../../../services/orderDepositApi.js";
import {
  formatPrice,
  formatDateTimeString,
  formatDateString,
} from "../../../../../utils/utils.js";

// Information Row Component
const InfoRow = ({ label, value, valueColor, bold = false }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text
      style={[
        styles.infoValue,
        valueColor && { color: valueColor },
        bold && { fontWeight: "bold" },
      ]}
    >
      {value || "Chưa cập nhật"}
    </Text>
  </View>
);

// Transaction Item Component
const TransactionItem = ({ deposit }) => (
  <View
    style={[
      styles.transactionItem,
      { backgroundColor: deposit.status ? "#F0FFF4" : "#F7FAFC" },
    ]}
  >
    <View style={styles.transactionHeader}>
      <Text style={styles.transactionTitle}>
        Đặt cọc lần {deposit.depositNumber}
      </Text>
      <View
        style={[
          styles.badge,
          { backgroundColor: deposit.status ? "#48BB78" : "#CBD5E0" },
        ]}
      >
        <Text style={styles.badgeText}>
          {deposit.status ? "Đã thanh toán" : "Chưa thanh toán"}
        </Text>
      </View>
    </View>

    <InfoRow
      label="Ngày tạo:"
      value={
        deposit.createdAt
          ? formatDateTimeString(deposit.createdAt)
          : "Chưa cập nhật"
      }
    />

    <InfoRow
      label="Ngày thanh toán:"
      value={
        deposit.updatedAt
          ? formatDateTimeString(deposit.updatedAt)
          : "Chưa cập nhật"
      }
    />

    <InfoRow
      label="Số tiền thanh toán:"
      value={deposit.amount ? formatPrice(deposit.amount) : "Chưa cập nhật"}
      valueColor={appColorTheme.brown_2}
      bold
    />

    <InfoRow
      label="Phần trăm cọc:"
      value={deposit.percent ? `${deposit.percent}%` : "Chưa cập nhật"}
    />
  </View>
);

export default function ContractAndTransactionTab({
  activeTabIndex,
  isActive,
  order,
}) {
  const serviceName = order?.service?.service?.serviceName;
  const route = useRoute();
  const navigation = useNavigation();
  const id = route.params?.id || order?.orderId;

  // Fetch contract data
  const {
    data: contractResponse,
    isLoading: isContractLoading,
    error: contractError,
    refetch: refetchContract,
  } = useGetContractByServiceOrderIdQuery(id);

  // Fetch deposit data
  const {
    data: depositsResponse,
    isLoading: isDepositsLoading,
    error: depositsError,
    refetch: refetchDeposits,
  } = useGetAllOrderDepositByOrderIdQuery(id);

  // Refetch data when tab becomes active
  useEffect(() => {
    if (isActive) {
      refetchContract();
      refetchDeposits();
    }
  }, [isActive, refetchContract, refetchDeposits]);

  const contract = contractResponse?.data;
  const deposits = depositsResponse?.data || [];

  // Loading state
  if (isContractLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  // Error state
  if (contractError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Đã có lỗi xảy ra khi tải thông tin hợp đồng</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Two sections side by side on large screens, stacked on small screens */}
      <View style={styles.contentContainer}>
        {/* Contract Information */}
        {serviceName !== "Sale" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin hợp đồng</Text>

            {contract ? (
              <View style={styles.contractContent}>
                <InfoRow
                  label="Họ tên người đại diện:"
                  value={contract?.woodworker?.username}
                />
                <InfoRow
                  label="SĐT người đại diện:"
                  value={contract?.woodworker?.phone}
                />
                <InfoRow
                  label="Email người đại diện:"
                  value={contract?.woodworker?.email}
                />

                <View style={styles.divider} />

                <InfoRow
                  label="Họ tên khách hàng:"
                  value={contract?.customer?.username}
                />
                <InfoRow
                  label="SĐT khách hàng:"
                  value={contract?.customer?.phone}
                />
                <InfoRow
                  label="Email khách hàng:"
                  value={contract?.customer?.email}
                />

                <View style={styles.divider} />

                <InfoRow label="Mã hợp đồng:" value={contract.contractId} />

                <View style={styles.fullWidthContainer}>
                  <Text style={styles.infoLabel}>
                    Điều khoản của xưởng mộc:
                  </Text>
                  <Text style={styles.termsText}>
                    {contract.woodworkerTerms || "Chưa cập nhật"}
                  </Text>
                </View>

                <InfoRow
                  label="Ngày ký:"
                  value={
                    contract.signDate
                      ? formatDateString(new Date(contract.signDate))
                      : null
                  }
                />

                <InfoRow
                  label="Ngày cam kết hoàn thành sản phẩm:"
                  value={
                    contract.completeDate
                      ? formatDateString(new Date(contract.completeDate))
                      : null
                  }
                />

                <InfoRow
                  label="Giá trị hợp đồng:"
                  value={
                    contract.contractTotalAmount
                      ? formatPrice(contract.contractTotalAmount)
                      : null
                  }
                  valueColor={appColorTheme.brown_2}
                  bold
                />

                <InfoRow
                  label="Thời hạn bảo hành:"
                  value={
                    contract.warrantyPeriod
                      ? formatDateTimeString(contract.warrantyPeriod)
                      : null
                  }
                />

                <View style={styles.signaturesContainer}>
                  <View style={styles.signatureBox}>
                    <Text style={styles.signatureLabel}>
                      Chữ ký người đại diện
                    </Text>
                    {contract.woodworkerSignature ? (
                      <Image
                        source={{ uri: contract.woodworkerSignature }}
                        style={styles.signatureImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.noSignature}>
                        <Text style={styles.noSignatureText}>
                          Chưa có chữ ký
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.signatureBox}>
                    <Text style={styles.signatureLabel}>Chữ ký khách hàng</Text>
                    {contract.customerSignature ? (
                      <Image
                        source={{ uri: contract.customerSignature }}
                        style={styles.signatureImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.noSignature}>
                        <Text style={styles.noSignatureText}>
                          Chưa có chữ ký
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => {
                    const contractId = order?.orderId;
                    if (contractId) {
                      navigation.navigate("Contract", { id: contractId });
                    }
                  }}
                >
                  <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Chưa có thông tin hợp đồng</Text>
              </View>
            )}
          </View>
        )}

        {/* Deposit/Transaction Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin giao dịch</Text>

          {isDepositsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={appColorTheme.brown_2} />
            </View>
          ) : depositsError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Đã có lỗi xảy ra khi tải thông tin thanh toán
              </Text>
            </View>
          ) : deposits.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có thông tin thanh toán</Text>
            </View>
          ) : (
            <View style={styles.transactionsContent}>
              <View style={styles.orderAmountSummary}>
                <InfoRow
                  label="Thành tiền:"
                  value={
                    order?.totalAmount ? formatPrice(order?.totalAmount) : null
                  }
                  valueColor={appColorTheme.brown_2}
                  bold
                />

                <InfoRow
                  label="Số tiền đã thanh toán:"
                  value={formatPrice(order?.amountPaid)}
                  valueColor={appColorTheme.brown_2}
                  bold
                />

                <InfoRow
                  label="Số tiền còn lại:"
                  value={formatPrice(order?.amountRemaining)}
                  valueColor={appColorTheme.brown_2}
                  bold
                />
              </View>

              <View style={styles.depositsList}>
                {deposits.map((deposit) => (
                  <TransactionItem
                    key={deposit.orderDepositId}
                    deposit={deposit}
                  />
                ))}
              </View>
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
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    padding: 10,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: appColorTheme.brown_2,
  },
  contractContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  infoLabel: {
    fontWeight: "bold",
    minWidth: 150,
    marginRight: 8,
  },
  infoValue: {
    flex: 1,
  },
  fullWidthContainer: {
    marginBottom: 10,
  },
  termsText: {
    marginTop: 8,
  },
  divider: {
    height: 10,
  },
  signaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  signatureBox: {
    flex: 1,
    alignItems: "center",
    maxWidth: "48%",
  },
  signatureLabel: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  signatureImage: {
    height: 100,
    width: "100%",
  },
  noSignature: {
    height: 100,
    width: "100%",
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  noSignatureText: {
    color: "#718096",
  },
  viewDetailsButton: {
    alignSelf: "flex-end",
    marginTop: 16,
  },
  viewDetailsText: {
    color: appColorTheme.brown_2,
    textDecorationLine: "underline",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#718096",
    fontSize: 16,
  },
  orderAmountSummary: {
    marginBottom: 20,
  },
  depositsList: {
    marginTop: 16,
  },
  transactionItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  transactionTitle: {
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "white",
  },
  transactionsContent: {
    marginBottom: 16,
  },
});
