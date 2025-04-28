import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import CheckboxList from "../../../../../../components/Utility/CheckboxList.jsx";
import {
  useGetByGuaranteeOrderMutation,
  useSaveQuotationDetailsForGuaranteeMutation,
} from "../../../../../../services/quotationApi";
import { appColorTheme } from "../../../../../../config/appconfig.js";

// Constants for validation
const MIN_PRICE = 0;
const MAX_PRICE = 50000000;
const PRICE_STEP = 1000;

export default function QuotationUpdateModal({ guaranteeOrderId, refetch }) {
  // Modal control
  const [isOpen, setIsOpen] = useState(false);
  const initialRef = useRef(null);

  const notify = useNotify();
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // API hooks
  const [getByGuaranteeOrder] = useGetByGuaranteeOrderMutation();
  const [saveQuotationDetails, { isLoading: isSaving }] =
    useSaveQuotationDetailsForGuaranteeMutation();

  // Confirmation items for CheckboxList
  const confirmationItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  // Fetch quotation data when modal opens
  useEffect(() => {
    if (isOpen && guaranteeOrderId) {
      fetchQuotationData();
    }
  }, [isOpen, guaranteeOrderId]);

  const fetchQuotationData = async () => {
    try {
      setIsLoading(true);
      const response = await getByGuaranteeOrder({
        guaranteeOrderId: parseInt(guaranteeOrderId),
      }).unwrap();

      if (response.data?.quotationDetails?.length > 0) {
        setQuotationDetails(
          response.data.quotationDetails.map((detail) => ({
            id: detail.quotId || Date.now() + Math.random(),
            costType: detail.costType || "",
            quantityRequired: detail.quantityRequired || "",
            costAmount: detail.costAmount || MIN_PRICE,
          }))
        );
      } else {
        // Initialize with empty array if no quotation details found
        setQuotationDetails([]);
      }
    } catch (error) {
      notify("Lỗi lấy dữ liệu", "Không thể lấy dữ liệu báo giá", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuotationDetail = () => {
    setQuotationDetails([
      ...quotationDetails,
      {
        id: Date.now(),
        costType: "",
        quantityRequired: "",
        costAmount: MIN_PRICE,
      },
    ]);
  };

  const handleDetailChange = (detailId, field, value) => {
    setQuotationDetails(
      quotationDetails.map((detail) =>
        detail.id === detailId
          ? {
              ...detail,
              [field]: field === "costAmount" ? Number(value) : value,
            }
          : detail
      )
    );
  };

  const handleRemoveDetail = (detailId) => {
    setQuotationDetails(
      quotationDetails.filter((detail) => detail.id !== detailId)
    );
  };

  const calculateTotalPrice = () => {
    return quotationDetails.reduce(
      (total, detail) => total + (detail.costAmount || 0),
      0
    );
  };

  const validateQuotationDetails = () => {
    const errors = [];
    const isValid = quotationDetails.every((detail, index) => {
      if (!detail.costType || detail.costType.trim() === "") {
        errors.push(`Dòng ${index + 1}: Loại chi phí không được để trống`);
        return false;
      }
      if (!detail.quantityRequired || detail.quantityRequired.trim() === "") {
        errors.push(`Dòng ${index + 1}: Số lượng không được để trống`);
        return false;
      }
      if (detail.costAmount < MIN_PRICE || detail.costAmount > MAX_PRICE) {
        errors.push(
          `Dòng ${
            index + 1
          }: Giá phải từ ${MIN_PRICE.toLocaleString()}đ đến ${MAX_PRICE.toLocaleString()}đ`
        );
        return false;
      }
      if (detail.costAmount % PRICE_STEP !== 0) {
        errors.push(
          `Dòng ${
            index + 1
          }: Giá phải là bội số của ${PRICE_STEP.toLocaleString()}đ`
        );
        return false;
      }
      return true;
    });

    return { isValid, errors };
  };

  const handleSave = async () => {
    const { isValid, errors } = validateQuotationDetails();

    if (!isValid) {
      notify("Dữ liệu không hợp lệ", errors.join("\n"), "error");
      return;
    }

    try {
      const payload = {
        guaranteeOrderId: parseInt(guaranteeOrderId),
        quotations: quotationDetails.map((detail) => ({
          costType: detail.costType,
          costAmount: parseInt(detail.costAmount),
          quantityRequired: detail.quantityRequired,
        })),
      };

      await saveQuotationDetails(payload).unwrap();
      notify("Lưu thành công", "Đã cập nhật chi tiết báo giá", "success");

      // Refresh data after saving
      if (refetch) {
        refetch();
      }

      setIsOpen(false);
    } catch (error) {
      notify("Lỗi lưu dữ liệu", "Không thể lưu báo giá", "error");
    }
  };

  const renderQuotationDetail = ({ item }) => (
    <View style={styles.tableRow}>
      <TextInput
        style={styles.tableCell}
        placeholder="Loại chi phí"
        value={item.costType}
        onChangeText={(value) => handleDetailChange(item.id, "costType", value)}
      />

      <TextInput
        style={styles.tableCell}
        placeholder="Số lượng"
        value={item.quantityRequired}
        onChangeText={(value) =>
          handleDetailChange(item.id, "quantityRequired", value)
        }
      />

      <TextInput
        style={styles.tableCell}
        placeholder="Giá"
        keyboardType="numeric"
        value={item.costAmount?.toString()}
        onChangeText={(value) =>
          handleDetailChange(
            item.id,
            "costAmount",
            value === "" ? 0 : parseInt(value.replace(/[^0-9]/g, ""))
          )
        }
      />

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveDetail(item.id)}
      >
        <Icon name="trash-2" size={20} color={appColorTheme.red_1} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
        <Icon
          name="file-text"
          size={20}
          color={appColorTheme.blue_0}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Cập nhật báo giá</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !isSaving && setIsOpen(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập nhật báo giá</Text>
              {!isSaving && (
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.closeButton}
                >
                  <Icon name="x" size={20} color="#000" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={appColorTheme.brown_2}
                  />
                  <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
              ) : (
                <View>
                  <View style={styles.tableHeader}>
                    <Text style={styles.headerCell}>Loại chi phí</Text>
                    <Text style={styles.headerCell}>Số lượng</Text>
                    <Text style={styles.headerCell}>Giá (VNĐ)</Text>
                    <Text style={[styles.headerCell, styles.actionCell]}></Text>
                  </View>

                  <FlatList
                    data={quotationDetails}
                    renderItem={renderQuotationDetail}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    ListEmptyComponent={
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                          Chưa có chi tiết báo giá
                        </Text>
                      </View>
                    }
                  />

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddQuotationDetail}
                  >
                    <Icon
                      name="plus"
                      size={16}
                      color="white"
                      style={styles.addIcon}
                    />
                    <Text style={styles.addButtonText}>Thêm chi tiết</Text>
                  </TouchableOpacity>

                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Tổng tiền:</Text>
                    <Text style={styles.totalAmount}>
                      {calculateTotalPrice().toLocaleString()}đ
                    </Text>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <CheckboxList
                      items={confirmationItems}
                      setButtonDisabled={setIsButtonDisabled}
                    />
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.saveBtn,
                  (isButtonDisabled || isSaving) && styles.disabledButton,
                ]}
                onPress={handleSave}
                disabled={isButtonDisabled || isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Icon
                      name="check"
                      size={18}
                      color="white"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonTextLight}>Lưu báo giá</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerButton, styles.closeBtn]}
                onPress={() => setIsOpen(false)}
                disabled={isSaving}
              >
                <Icon
                  name="x"
                  size={18}
                  color="#000"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTextDark}>Đóng</Text>
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
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: appColorTheme.blue_0,
    backgroundColor: "transparent",
    marginVertical: 8,
  },
  buttonText: {
    color: appColorTheme.blue_0,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "95%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F7FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionCell: {
    width: 40,
    flex: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 8,
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginHorizontal: 2,
    borderRadius: 4,
  },
  deleteButton: {
    width: 40,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#718096",
    fontStyle: "italic",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: appColorTheme.blue_0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 4,
    marginVertical: 16,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  checkboxContainer: {
    marginTop: 16,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    justifyContent: "flex-end",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveBtn: {
    backgroundColor: appColorTheme.blue_0,
  },
  closeBtn: {
    backgroundColor: "#E2E8F0",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonTextLight: {
    color: "white",
    fontWeight: "600",
  },
  buttonTextDark: {
    color: "#1A202C",
    fontWeight: "600",
  },
});
