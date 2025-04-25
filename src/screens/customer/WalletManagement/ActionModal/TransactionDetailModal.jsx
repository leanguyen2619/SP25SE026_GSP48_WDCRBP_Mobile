import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {
  appColorTheme,
  transactionTypeColorMap,
} from "../../../../config/appconfig";
import { formatDateTimeString, formatPrice } from "../../../../utils/utils";
import { useGetTransactionByIdQuery } from "../../../../services/transactionApi";

export default function TransactionDetailModal({ transaction }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: response,
    isLoading,
    error,
  } = useGetTransactionByIdQuery(transaction?.transactionId, {
    skip: !isOpen,
  });

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const transactionDetail = response?.data[0];

  const renderContent = () => {
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
          <Text>Đã có lỗi xảy ra khi tải thông tin giao dịch</Text>
        </View>
      );
    }

    const detail = transactionDetail || transaction;

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Thông tin giao dịch</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mã giao dịch:</Text>
            <Text style={styles.infoValue}>{detail?.transactionId}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Loại giao dịch:</Text>
            <Text
              style={[
                styles.infoValue,
                { color: transactionTypeColorMap[detail?.transactionType] },
              ]}
            >
              {detail?.transactionType}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Số tiền:</Text>
            <Text style={[styles.infoValue, styles.amountText]}>
              {formatPrice(detail?.amount)}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ngày tạo:</Text>
            <Text style={styles.infoValue}>
              {formatDateTimeString(detail?.createdAt)}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mô tả:</Text>
            <Text style={styles.infoValue}>{detail?.description}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text
              style={[
                styles.infoValue,
                { color: detail?.status ? "#38A169" : "#E53E3E" },
              ]}
            >
              {detail?.status ? "Đã hoàn thành" : "Chưa hoàn thành"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={onOpen}
        activeOpacity={0.7}
      >
        <Icon name="eye" size={16} color={appColorTheme.brown_2} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Chi tiết giao dịch</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>{renderContent()}</ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    gap: 16,
  },
  infoItem: {
    flexDirection: "column",
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
  },
  amountText: {
    fontWeight: "700",
    color: appColorTheme.brown_2,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  closeButton: {
    backgroundColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  closeButtonText: {
    fontWeight: "600",
  },
});
