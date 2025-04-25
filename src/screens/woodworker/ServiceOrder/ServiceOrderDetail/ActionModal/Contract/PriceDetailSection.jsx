import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import {
  useGetByServiceOrderMutation,
  useSaveQuotationDetailsMutation,
} from "../../../../../../services/quotationApi";
import Accordion from "react-native-collapsible/Accordion";

const MIN_PRICE = 1000;
const MAX_PRICE = 50000000;
const PRICE_STEP = 1000;

export default function PriceDetailSection({ orderId, onQuotationComplete }) {
  const notify = useNotify();
  const [getByServiceOrder, { isLoading: isLoadingQuotations }] =
    useGetByServiceOrderMutation();
  const [saveQuotationDetails, { isLoading: isSaving }] =
    useSaveQuotationDetailsMutation();

  const [quotationData, setQuotationData] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingDetails, setEditingDetails] = useState({});
  const [isAllProductsQuoted, setIsAllProductsQuoted] = useState(false);
  const [activeSections, setActiveSections] = useState([0]); // For accordion

  // Fetch quotation data
  const fetchQuotations = async () => {
    try {
      const response = await getByServiceOrder({
        serviceOrderId: parseInt(orderId),
      }).unwrap();
      setQuotationData(response.data || []);

      // Check if all products have quotations
      const allQuoted = (response.data || []).every(
        (item) => item.quotationDetails && item.quotationDetails.length > 0
      );
      setIsAllProductsQuoted(allQuoted);

      // Notify parent component about quotation status
      onQuotationComplete && onQuotationComplete(allQuoted);
    } catch (error) {
      notify("Lỗi lấy dữ liệu", "Không thể lấy dữ liệu báo giá", "error");
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (orderId) {
      fetchQuotations();
    }
  }, [orderId]);

  const validatePriceDetails = (details) => {
    const errors = [];
    const isValid = details.every((detail, index) => {
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

  const handleStartEdit = (productId, existingQuotations = []) => {
    // Map existing quotations to our editing format or initialize with empty array
    const details =
      existingQuotations.length > 0
        ? existingQuotations.map((q) => ({
            id: q.quotationDetailId || Date.now() + Math.random(),
            costType: q.costType || "",
            quantityRequired: q.quantityRequired || "",
            costAmount: q.costAmount || MIN_PRICE,
          }))
        : [];

    setEditingProductId(productId);
    setEditingDetails(details);
  };

  const handleSave = async (productId) => {
    const { isValid, errors } = validatePriceDetails(editingDetails);

    if (!isValid) {
      notify("Dữ liệu không hợp lệ", errors.join("\n"), "error");
      return;
    }

    try {
      const payload = {
        requestedProductId: productId,
        quotations: editingDetails.map((detail) => ({
          costType: detail.costType,
          costAmount: parseInt(detail.costAmount),
          quantityRequired: detail.quantityRequired,
        })),
      };

      await saveQuotationDetails(payload).unwrap();
      setEditingProductId(null);
      notify("Lưu thành công", "Đã cập nhật chi tiết giá", "success");
      fetchQuotations();
    } catch (error) {
      notify("Lỗi lưu dữ liệu", "Không thể lưu báo giá", "error");
    }
  };

  const handleCancel = () => {
    setEditingProductId(null);
    setEditingDetails([]);
  };

  const handleAddPriceDetail = () => {
    setEditingDetails([
      ...editingDetails,
      {
        id: Date.now(),
        costType: "",
        quantityRequired: "",
        costAmount: MIN_PRICE,
      },
    ]);
  };

  const handlePriceDetailChange = (detailId, field, value) => {
    setEditingDetails(
      editingDetails.map((detail) =>
        detail.id === detailId
          ? {
              ...detail,
              [field]: field === "costAmount" ? Number(value) : value,
            }
          : detail
      )
    );
  };

  const handleRemovePriceDetail = (detailId) => {
    setEditingDetails(
      editingDetails.filter((detail) => detail.id !== detailId)
    );
  };

  const calculateTotalPrice = (details) => {
    return (
      details?.reduce((total, detail) => total + (detail.costAmount || 0), 0) ||
      0
    );
  };

  const updateActiveSections = (sections) => {
    setActiveSections(sections);
  };

  if (isLoadingQuotations) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!quotationData || quotationData.length === 0) {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Không tìm thấy thông tin sản phẩm cho báo giá.
        </Text>
      </View>
    );
  }

  // Prepare sections for Accordion
  const renderHeader = (item, _, isActive) => {
    const product = item.requestedProduct;
    const quotations = item.quotationDetails || [];
    const hasQuotations = quotations.length > 0;

    return (
      <View style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>
          {product.category}
          {hasQuotations && !editingProductId && (
            <Text style={styles.quotedText}> - Đã báo giá</Text>
          )}
        </Text>
        <Icon
          name={isActive ? "chevron-up" : "chevron-down"}
          size={16}
          color="#333"
        />
      </View>
    );
  };

  const renderContent = (item) => {
    const product = item.requestedProduct;
    const quotations = item.quotationDetails || [];
    const hasQuotations = quotations.length > 0;
    const isEditing = editingProductId === product.requestedProductId;
    const displayDetails = isEditing ? editingDetails : quotations;

    return (
      <View style={styles.accordionContent}>
        <View style={styles.productInfoRow}>
          <Text>Số lượng: {product.quantity}</Text>
          <View style={styles.actionButtonContainer}>
            {!isEditing ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  handleStartEdit(product.requestedProductId, quotations)
                }
                disabled={
                  isEditing && editingProductId !== product.requestedProductId
                }
              >
                <Icon name="edit" size={16} color="white" />
              </TouchableOpacity>
            ) : (
              editingProductId === product.requestedProductId && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddPriceDetail}
                >
                  <Icon name="plus" size={16} color="white" />
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>STT</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
              Loại chi phí
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
              Số lượng cần dùng
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Chi phí</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}></Text>
          </View>

          {displayDetails?.length > 0 ? (
            <>
              {displayDetails.map((detail, index) => (
                <View key={detail.id || index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>
                    {index + 1}
                  </Text>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    {isEditing &&
                    editingProductId === product.requestedProductId ? (
                      <TextInput
                        style={styles.tableInput}
                        value={detail.costType}
                        onChangeText={(value) =>
                          handlePriceDetailChange(detail.id, "costType", value)
                        }
                      />
                    ) : (
                      <Text>{detail.costType}</Text>
                    )}
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    {isEditing &&
                    editingProductId === product.requestedProductId ? (
                      <TextInput
                        style={styles.tableInput}
                        value={detail.quantityRequired}
                        onChangeText={(value) =>
                          handlePriceDetailChange(
                            detail.id,
                            "quantityRequired",
                            value
                          )
                        }
                      />
                    ) : (
                      <Text>{detail.quantityRequired}</Text>
                    )}
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    {isEditing &&
                    editingProductId === product.requestedProductId ? (
                      <TextInput
                        style={styles.tableInput}
                        value={String(detail.costAmount)}
                        onChangeText={(value) =>
                          handlePriceDetailChange(
                            detail.id,
                            "costAmount",
                            value
                          )
                        }
                        keyboardType="numeric"
                      />
                    ) : (
                      <Text>{detail.costAmount.toLocaleString()}đ</Text>
                    )}
                  </View>
                  <View style={[styles.tableCell, { flex: 0.5 }]}>
                    {isEditing &&
                      editingProductId === product.requestedProductId && (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleRemovePriceDetail(detail.id)}
                        >
                          <Icon name="trash-2" size={16} color="white" />
                        </TouchableOpacity>
                      )}
                  </View>
                </View>
              ))}

              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 4.5, textAlign: "right", fontWeight: "bold" },
                  ]}
                >
                  Tổng chi phí:
                </Text>
                <Text
                  style={[styles.tableCell, { flex: 2, fontWeight: "bold" }]}
                >
                  {calculateTotalPrice(displayDetails).toLocaleString()}đ
                </Text>
                <View style={[styles.tableCell, { flex: 0.5 }]} />
              </View>
            </>
          ) : (
            <View style={styles.tableRow}>
              <Text
                style={[styles.tableCell, { flex: 1, textAlign: "center" }]}
              >
                {!isEditing ? "Chưa có báo giá" : "Thêm mục báo giá mới"}
              </Text>
            </View>
          )}
        </View>

        {isEditing && editingProductId === product.requestedProductId && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <Icon name="x-circle" size={16} color="#333" />
              <Text style={styles.cancelButtonText}>Đóng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSave(product.requestedProductId)}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Icon name="save" size={16} color="white" />
                  <Text style={styles.saveButtonText}>Lưu báo giá</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Báo giá sản phẩm</Text>

      <Accordion
        sections={quotationData}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateActiveSections}
        expandMultiple
      />

      {isAllProductsQuoted && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            Tất cả sản phẩm đã được báo giá. Bạn có thể tiếp tục tạo hợp đồng.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#E6F6FF",
    borderRadius: 8,
  },
  infoText: {
    color: "#0077CC",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  accordionHeaderText: {
    fontWeight: "bold",
  },
  quotedText: {
    color: "green",
  },
  accordionContent: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  productInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  actionButtonContainer: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#0077CC",
    padding: 8,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: "#38A169",
    padding: 8,
    borderRadius: 4,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    marginBottom: 16,
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    width: "100%",
  },
  tableHeaderCell: {
    padding: 10,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  tableRow: {
    flexDirection: "row",
    width: "100%",
  },
  tableCell: {
    padding: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  tableInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    padding: 6,
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "#E53E3E",
    padding: 6,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 8,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#0077CC",
    gap: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
  successContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#F0FFF4",
    borderRadius: 8,
  },
  successText: {
    color: "#38A169",
  },
});
