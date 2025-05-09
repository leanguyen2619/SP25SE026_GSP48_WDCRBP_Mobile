import { useState, useEffect } from "react";
import {
  useAcceptGuaranteeQuotationsMutation,
  useGetByGuaranteeOrderMutation,
} from "../../../../../../services/quotationApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { Feather } from "@expo/vector-icons";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { formatPrice } from "../../../../../../utils/utils";
import { appColorTheme } from "../../../../../../config/appconfig";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";

export default function QuotationConfirmModal({
  order,
  buttonText = "Xác nhận báo giá",
  refetch,
  refetchDeposit,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const notify = useNotify();
  const [acceptQuotation, { isLoading: isAccepting }] =
    useAcceptGuaranteeQuotationsMutation();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const [getByGuaranteeOrder, { isLoading: isLoadingQuotation }] =
    useGetByGuaranteeOrderMutation();
  const [quotationData, setQuotationData] = useState(null);
  const [quotationError, setQuotationError] = useState(null);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  useEffect(() => {
    if (isModalVisible && order?.guaranteeOrderId) {
      fetchQuotationData();
    }
  }, [isModalVisible, order?.guaranteeOrderId]);

  const fetchQuotationData = async () => {
    if (!order?.guaranteeOrderId) return;

    try {
      const response = await getByGuaranteeOrder({
        guaranteeOrderId: parseInt(order.guaranteeOrderId),
      }).unwrap();
      setQuotationData(response.data || null);
      setQuotationError(null);
    } catch (error) {
      console.error("Error fetching quotation:", error);
      setQuotationError(error);
      setQuotationData(null);
    }
  };

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

  const handleSubmit = async () => {
    try {
      await acceptQuotation({
        guaranteeOrderId: parseInt(order.guaranteeOrderId),
      }).unwrap();

      notify("Xác nhận thành công", "Báo giá đã được chấp nhận", "success");

      setModalVisible(false);
      refetch && refetch();
      refetchDeposit();
    } catch (err) {
      notify(
        "Xác nhận thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  const handleClose = () => {
    setIsCheckboxDisabled(true);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="check-circle" size={18} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isAccepting && handleClose()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{buttonText}</Text>
            {!isAccepting && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Feather name="x-circle" size={20} style={styles.closeIcon} />
              </TouchableOpacity>
            )}

            <View style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Chi tiết báo giá sửa chữa</Text>

              <View style={styles.detailsCard}>
                {isLoadingQuotation ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      size="large"
                      color={appColorTheme.brown_2}
                    />
                  </View>
                ) : quotationError ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                      Đã có lỗi xảy ra khi tải thông tin báo giá
                    </Text>
                  </View>
                ) : quotationDetails.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      Chưa có thông tin báo giá
                    </Text>
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
                        <Text style={styles.cell}>
                          {detail.quantityRequired}
                        </Text>
                        <Text style={styles.cell}>
                          {formatPrice(detail.costAmount)}
                        </Text>
                      </View>
                    ))}

                    {order?.shipFee > 0 && (
                      <View style={styles.tableRow}>
                        <Text style={styles.emptyCell}></Text>
                        <Text style={styles.emptyCell}></Text>
                        <Text
                          style={[
                            styles.cell,
                            styles.boldText,
                            styles.rightAlign,
                          ]}
                        >
                          Phí vận chuyển:
                        </Text>
                        <Text style={styles.cell}>
                          {formatPrice(order?.shipFee)}
                        </Text>
                      </View>
                    )}

                    <View style={styles.tableRow}>
                      <Text style={styles.emptyCell}></Text>
                      <Text style={styles.emptyCell}></Text>
                      <Text
                        style={[
                          styles.cell,
                          styles.boldText,
                          styles.rightAlign,
                        ]}
                      >
                        Tổng chi phí:
                      </Text>
                      <Text style={[styles.cell, styles.totalPrice]}>
                        {formatPrice(
                          totalQuotationAmount + (order?.shipFee || 0)
                        )}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.divider} />
              <CheckboxList
                items={checkboxItems}
                setButtonDisabled={setIsCheckboxDisabled}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.cancelButton]}
                onPress={handleClose}
                disabled={isAccepting}
              >
                <Feather name="x-circle" size={18} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerButton, styles.confirmButton]}
                onPress={handleSubmit}
                disabled={isAccepting || isCheckboxDisabled}
              >
                {isAccepting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Feather name="check" size={18} style={styles.buttonIcon} />
                )}
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#38A169",
    padding: 8,
    borderRadius: 4,
  },
  buttonIcon: {
    color: "white",
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  closeIcon: {
    fontSize: 20,
    color: "#666",
  },
  modalBody: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: "#F7FAFC",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#E53E3E",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#718096",
  },
  tableContainer: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4A5568",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
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
    fontSize: 16,
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#EDF2F7",
  },
  confirmButton: {
    backgroundColor: "#38A169",
  },
  confirmButtonText: {
    color: "white",
  },
});
