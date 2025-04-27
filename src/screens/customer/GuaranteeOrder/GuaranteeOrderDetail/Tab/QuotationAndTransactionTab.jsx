import { useEffect, useState } from "react";
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
      <View style={styles.gridContainer}>
        {/* Quotation Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Báo giá chi tiết</Text>

          {isQuotationLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={appColorTheme.brown_2} />
            </View>
          ) : quotationError ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>
                Đã có lỗi xảy ra khi tải thông tin báo giá
              </Text>
            </View>
          ) : quotationDetails.length === 0 ? (
            <View style={styles.centerContainer}>
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
                  <Text style={styles.cell}>{formatPrice(detail.costAmount)}</Text>
                </View>
              ))}

              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.boldText, styles.rightAlign]}>
                  Phí vận chuyển:
                </Text>
                <Text style={styles.cell}>{formatPrice(order?.shipFee)}</Text>
              </View>

              <View style={styles.tableRow}>
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
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={appColorTheme.brown_2} />
            </View>
          ) : depositsError ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>
                Đã có lỗi xảy ra khi tải thông tin thanh toán
              </Text>
            </View>
          ) : deposits.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Chưa có thông tin thanh toán</Text>
            </View>
          ) : (
            <View style={styles.transactionContainer}>
              <View style={styles.amountInfo}>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Thành tiền:</Text>
                  <Text style={styles.amountValue}>
                    {formatPrice(order?.totalAmount)}
                  </Text>
                </View>

                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Số tiền đã thanh toán:</Text>
                  <Text style={styles.amountValue}>
                    {formatPrice(order?.amountPaid || 0)}
                  </Text>
                </View>

                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Số tiền còn lại:</Text>
                  <Text style={styles.amountValue}>
                    {formatPrice(order?.amountRemaining || 0)}
                  </Text>
                </View>
              </View>

              <View style={styles.depositsContainer}>
                {deposits.map((deposit) => (
                  <View
                    key={deposit.serviceDepositId}
                    style={[
                      styles.depositCard,
                      deposit.status && styles.paidDeposit,
                    ]}
                  >
                    <View style={styles.depositHeader}>
                      <Text style={styles.depositTitle}>
                        Đặt cọc lần {deposit.depositNumber}:
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          deposit.status && styles.paidBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            deposit.status && styles.paidStatusText,
                          ]}
                        >
                          {deposit.status ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.depositInfo}>
                      <Text style={styles.depositLabel}>Ngày tạo:</Text>
                      <Text>
                        {deposit.createdAt
                          ? formatDateTimeString(new Date(deposit.createdAt))
                          : "Chưa cập nhật"}
                      </Text>
                    </View>

                    <View style={styles.depositInfo}>
                      <Text style={styles.depositLabel}>Ngày thanh toán:</Text>
                      <Text>
                        {deposit.updatedAt
                          ? formatDateTimeString(new Date(deposit.updatedAt))
                          : "Chưa cập nhật"}
                      </Text>
                    </View>
                  </View>
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: appColorTheme.brown_2,
  },
  tableContainer: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  rightAlign: {
    textAlign: 'right',
  },
  totalPrice: {
    fontSize: 18,
    color: appColorTheme.brown_2,
    fontWeight: 'bold',
  },
  transactionContainer: {
    gap: 16,
  },
  amountInfo: {
    gap: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountLabel: {
    fontWeight: 'bold',
  },
  amountValue: {
    color: appColorTheme.brown_2,
    fontWeight: 'bold',
  },
  depositsContainer: {
    gap: 12,
  },
  depositCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  paidDeposit: {
    backgroundColor: '#e6ffe6',
  },
  depositHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  depositTitle: {
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#ddd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paidBadge: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: '#666',
    fontSize: 12,
  },
  paidStatusText: {
    color: 'white',
  },
  depositInfo: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  depositLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
});
