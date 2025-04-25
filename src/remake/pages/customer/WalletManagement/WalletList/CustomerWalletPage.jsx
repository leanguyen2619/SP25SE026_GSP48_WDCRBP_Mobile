import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import {
  appColorTheme,
  transactionTypeColorMap,
  transactionTypeConstants,
} from "../../../../config/appconfig";
import TransactionDetailModal from "../ActionModal/TransactionDetailModal";
import { formatDateTimeString, formatPrice } from "../../../../utils/utils";
import WalletInformation from "../WalletInformation/WalletInformation";
import { useGetUserTransactionsQuery } from "../../../../services/transactionApi";
import useAuth from "../../../../hooks/useAuth";
import Icon from "react-native-vector-icons/Feather";
import CustomerLayout from "../../../../layouts/CustomerLayout";

export default function CustomerWalletPage() {
  const { auth } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: response,
    isLoading,
    error,
  } = useGetUserTransactionsQuery(auth?.userId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Sắp xếp giao dịch theo ID giảm dần
  const transactions = useMemo(() => {
    if (!response?.data) return [];

    return [...response.data]
      .map((transaction) => ({
        ...transaction,
        createdAt: new Date(transaction.createdAt),
      }))
      .sort((a, b) => b.transactionId - a.transactionId); // Sắp xếp giảm dần theo ID
  }, [response]);

  // Tính toán dữ liệu phân trang
  const totalPages = Math.ceil((transactions?.length || 0) / pageSize);
  const paginatedData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const start = (currentPage - 1) * pageSize;
    return transactions.slice(start, start + pageSize);
  }, [transactions, currentPage]);

  const getAmountStyle = (transaction) => {
    if (
      transaction.status === true &&
      (transaction.transactionType === transactionTypeConstants.NAP_VI ||
        transaction.transactionType === transactionTypeConstants.NHAN_TIEN ||
        transaction.transactionType === transactionTypeConstants.HOAN_TIEN)
    ) {
      return styles.positiveAmount;
    } else if (transaction.status === true) {
      return styles.negativeAmount;
    } else {
      return styles.pendingAmount;
    }
  };

  const getFormattedAmount = (transaction) => {
    if (
      (transaction.transactionType === transactionTypeConstants.NAP_VI ||
        transaction.transactionType === transactionTypeConstants.NHAN_TIEN ||
        transaction.transactionType === transactionTypeConstants.HOAN_TIEN) &&
      transaction.status === true
    ) {
      return `+ ${formatPrice(transaction.amount)}`;
    } else if (
      (transaction.transactionType === transactionTypeConstants.RUT_VI ||
        transaction.transactionType ===
          transactionTypeConstants.THANH_TOAN_BANG_VI ||
        transaction.transactionType ===
          transactionTypeConstants.TRU_HOAN_TIEN) &&
      transaction.status === true
    ) {
      return `- ${formatPrice(transaction.amount)}`;
    }

    return formatPrice(transaction.amount);
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionId}>#{item.transactionId}</Text>
        <Text
          style={[
            styles.transactionType,
            { color: transactionTypeColorMap[item.transactionType] },
          ]}
        >
          {item.transactionType}
        </Text>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ngày tạo:</Text>
          <Text style={styles.detailValue}>
            {formatDateTimeString(item.createdAt)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Số tiền:</Text>
          <Text style={[styles.detailValue, getAmountStyle(item)]}>
            {getFormattedAmount(item)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Trạng thái:</Text>
          <Text
            style={[
              styles.detailValue,
              { color: item.status ? "#38A169" : "#E53E3E" },
            ]}
          >
            {item.status ? "Đã hoàn thành" : "Chưa hoàn thành"}
          </Text>
        </View>
      </View>

      <View style={styles.transactionActions}>
        <TransactionDetailModal transaction={item} />
      </View>
    </View>
  );

  // Component phân trang
  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage(currentPage - 1)}
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledButton,
          ]}
        >
          <Text style={styles.paginationButtonText}>Trước</Text>
        </TouchableOpacity>

        <Text style={styles.paginationText}>
          Trang {currentPage} / {totalPages || 1}
        </Text>

        <TouchableOpacity
          disabled={currentPage === totalPages || totalPages === 0}
          onPress={() => setCurrentPage(currentPage + 1)}
          style={[
            styles.paginationButton,
            (currentPage === totalPages || totalPages === 0) &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.paginationButtonText}>Sau</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đã có lỗi xảy ra khi tải danh sách giao dịch</Text>
      </View>
    );
  }

  return (
    <CustomerLayout>
      <SafeAreaView style={styles.container}>
        <WalletInformation />

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Các khoản giao dịch</Text>

          {transactions && transactions.length > 0 ? (
            <FlatList
              data={paginatedData}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.transactionId.toString()}
              contentContainerStyle={styles.transactionList}
            />
          ) : (
            <View style={styles.emptyListContainer}>
              <Icon name="inbox" size={48} color="#CBD5E0" />
              <Text style={styles.emptyListText}>Không có giao dịch nào</Text>
            </View>
          )}
        </View>

        {transactions && transactions.length > 0 && renderPagination()}
      </SafeAreaView>
    </CustomerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  transactionsSection: {
    flex: 1,
    marginTop: 16,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    padding: 16,
  },
  transactionList: {
    paddingHorizontal: 16,
  },
  transactionItem: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  transactionId: {
    fontWeight: "600",
  },
  transactionType: {
    fontWeight: "600",
  },
  transactionDetails: {
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  detailLabel: {
    color: "#4A5568",
  },
  detailValue: {
    fontWeight: "500",
  },
  positiveAmount: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  negativeAmount: {
    color: appColorTheme.red_0,
    fontWeight: "bold",
  },
  pendingAmount: {
    color: "grey",
    fontWeight: "bold",
  },
  transactionActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  emptyListContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyListText: {
    marginTop: 8,
    color: "#718096",
    fontSize: 16,
  },
  // Thêm styles cho phân trang
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  paginationButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  paginationText: {
    fontSize: 14,
  },
});
