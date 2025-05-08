import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { useGetByGuaranteeOrderMutation } from "../../../../../services/quotationApi.js";
import { useGetAllOrderDepositByGuaranteeOrderIdQuery } from "../../../../../services/orderDepositApi.js";
import {
  formatPrice,
  formatDateTimeString,
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

export default function QuotationAndTransactionTab({
  activeTabIndex,
  isActive,
  order,
}) {
  const [quotationData, setQuotationData] = useState(null);
  const [isQuotationLoading, setIsQuotationLoading] = useState(false);
  const [quotationError, setQuotationError] = useState(null);

  const [getByGuaranteeOrder] = useGetByGuaranteeOrderMutation();

  const {
    data: depositsResponse,
    isLoading: isDepositsLoading,
    error: depositsError,
    refetch: refetchDeposits,
  } = useGetAllOrderDepositByGuaranteeOrderIdQuery(order?.guaranteeOrderId);

  const fetchQuotationData = async () => {
    if (!order?.guaranteeOrderId) return;

    try {
      setIsQuotationLoading(true);
      const response = await getByGuaranteeOrder({
        guaranteeOrderId: parseInt(order.guaranteeOrderId),
      }).unwrap();
      setQuotationData(response.data || null);
      setQuotationError(null);
    } catch (error) {
      console.error("Error fetching quotation:", error);
      setQuotationError(error);
      setQuotationData(null);
    } finally {
      setIsQuotationLoading(false);
    }
  };

  useEffect(() => {
    if (isActive && order?.guaranteeOrderId) {
      fetchQuotationData();
      refetchDeposits();
    }
  }, [isActive, order?.guaranteeOrderId, refetchDeposits]);

  const deposits = depositsResponse?.data || [];

  const calculateTotalPrice = (quotationDetails = []) => {
    return (
      quotationDetails?.reduce(
        (total, detail) => total + (detail.costAmount || 0),
        0
      ) || 0
    );
  };

  const quotationDetails = quotationData?.quotationDetails || [];
  const totalQuotationAmount = calculateTotalPrice(quotationDetails);

  if (isQuotationLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Quotation Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Báo giá chi tiết</Text>

          {isQuotationLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={appColorTheme.brown_2} />
            </View>
          ) : quotationError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Đã có lỗi xảy ra khi tải thông tin báo giá
              </Text>
            </View>
          ) : quotationDetails.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có thông tin báo giá</Text>
            </View>
          ) : (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>STT</Text>
                <Text style={styles.headerCell}>Loại chi phí</Text>
                <Text style={styles.headerCell}>Số lượng</Text>
                <Text style={styles.headerCell}>Chi phí</Text>
              </View>

              {quotationDetails.map((detail, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>{detail.costType}</Text>
                  <Text style={styles.cell}>{detail.quantityRequired}</Text>
                  <Text style={styles.cell}>
                    {formatPrice(detail.costAmount)}
                  </Text>
                </View>
              ))}

              <View style={styles.tableRow}>
                <Text style={styles.emptyCell}></Text>
                <Text style={styles.emptyCell}></Text>
                <Text style={[styles.cell, styles.boldText, styles.rightAlign]}>
                  Phí vận chuyển:
                </Text>
                <Text style={styles.cell}>{formatPrice(order?.shipFee)}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.emptyCell}></Text>
                <Text style={styles.emptyCell}></Text>
                <Text style={[styles.cell, styles.boldText, styles.rightAlign]}>
                  Tổng chi phí:
                </Text>
                <Text style={[styles.cell, styles.totalPrice]}>
                  {formatPrice(totalQuotationAmount + order?.shipFee)}
                </Text>
              </View>
            </View>
          )}
        </View>

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
                  value={formatPrice(order?.amountPaid || 0)}
                  valueColor={appColorTheme.brown_2}
                  bold
                />

                <InfoRow
                  label="Số tiền còn lại:"
                  value={formatPrice(order?.amountRemaining || 0)}
                  valueColor={appColorTheme.brown_2}
                  bold
                />
              </View>

              <View style={styles.depositsList}>
                {deposits.map((deposit) => (
                  <TransactionItem
                    key={deposit.orderDepositId || deposit.serviceDepositId}
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
  tableContainer: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  emptyCell: {
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
  },
  rightAlign: {
    textAlign: "right",
  },
  totalPrice: {
    fontSize: 18,
    color: appColorTheme.brown_2,
    fontWeight: "bold",
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
  // Transaction styles
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
  transactionsContent: {
    marginBottom: 16,
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
});
