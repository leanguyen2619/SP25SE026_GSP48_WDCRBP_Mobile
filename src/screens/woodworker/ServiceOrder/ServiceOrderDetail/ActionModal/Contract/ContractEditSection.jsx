import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import { formatDateForInput } from "../../../../../../utils/utils.js";
import SignatureComponent from "../../../../../../components/Common/SignatureComponent.jsx";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
export default function ContractEditSection({
  initialContract,
  onChange,
  onSaveSignature,
  savedSignature,
  order,
  isExistingContract,
}) {
  const [contract, setContract] = useState({
    woodworkerTerms: "",
    contractTotalAmount: 0,
    completeDate: formatDateForInput(
      new Date(new Date().setMonth(new Date().getMonth() + 1))
    ),
    requestedProductIds: [],
    warrantyDurations: [],
    woodworkerSignature: "",
    signatureData: null,
  });

  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize contract data from existing contract (if any) or order data
  useEffect(() => {
    const productIds =
      order.requestedProduct?.map((p) => p.requestedProductId) || [];
    const durations =
      order.requestedProduct?.map((p) => p.warrantyDuration || 12) || [];

    if (initialContract) {
      // Handle data from existing contract
      setContract((prev) => ({
        ...prev,
        woodworkerTerms: initialContract.woodworkerTerms || "",
        contractTotalAmount: initialContract.contractTotalAmount || 0,
        completeDate: formatDateForInput(initialContract.completeDate) || "",
        requestedProductIds: productIds,
        warrantyDurations: durations,
        woodworkerSignature: initialContract.woodworkerSignature || "",
      }));
    } else if (order) {
      setContract((prev) => ({
        ...prev,
        contractTotalAmount: order.totalAmount || 0,
        requestedProductIds: productIds,
        warrantyDurations: durations,
      }));
    }
  }, [initialContract, order]);

  // Notify parent component of changes
  useEffect(() => {
    onChange && onChange(contract);
  }, [contract, onChange]);

  const handleChange = (field, value) => {
    setContract((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle warranty duration change for a specific product
  const handleWarrantyDurationChange = (index, value) => {
    const newWarrantyDurations = [...contract.warrantyDurations];
    newWarrantyDurations[index] = parseInt(value) || 0;

    setContract((prev) => ({
      ...prev,
      warrantyDurations: newWarrantyDurations,
    }));
  };

  // Handle signature save from SignatureComponent
  const handleSignatureSave = (blob, dataUrl) => {
    handleChange("signatureData", dataUrl);
    onSaveSignature && onSaveSignature(blob, dataUrl);
  };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("completeDate", formatDateForInput(selectedDate));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thông tin hợp đồng</Text>

      <View style={styles.stackContainer}>
        {/* Contract basic information */}
        <View style={styles.section}>
          <View style={styles.formGroup}>
            {/* Platform terms section - link to terms page */}
            <Text style={styles.label}>Điều khoản của nền tảng:</Text>
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => navigation.navigate("Terms")}
            >
              <Text style={styles.link}>Xem điều khoản nền tảng</Text>
              <Icon name="external-link" size={16} style={styles.linkIcon} />
            </TouchableOpacity>
          </View>

          {/* Woodworker terms */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Điều khoản của xưởng mộc: <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.textarea}
              multiline={true}
              numberOfLines={6}
              value={contract.woodworkerTerms}
              onChangeText={(value) => handleChange("woodworkerTerms", value)}
              placeholder="Nhập điều khoản của xưởng mộc"
            />
          </View>

          {/* Product warranty durations table */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Thời hạn bảo hành theo sản phẩm (tháng):{" "}
              <Text style={styles.required}>*</Text>
            </Text>
            <ScrollView horizontal style={styles.tableContainer}>
              <View>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderCell}>Mã sản phẩm</Text>
                  <Text style={styles.tableHeaderCell}>Sản phẩm</Text>
                  <Text style={styles.tableHeaderCell}>Số lượng</Text>
                  <Text style={styles.tableHeaderCell}>
                    Thời hạn bảo hành (tháng)
                  </Text>
                </View>
                {order?.requestedProduct?.map((product, index) => (
                  <View
                    key={product.requestedProductId}
                    style={styles.tableRow}
                  >
                    <Text style={styles.tableCell}>
                      {product.requestedProductId}
                    </Text>
                    <Text style={styles.tableCell}>
                      {product.category?.categoryName || "Sản phẩm"}
                    </Text>
                    <Text style={styles.tableCell}>{product.quantity}</Text>
                    <View style={styles.tableCell}>
                      <View style={styles.numberInputContainer}>
                        <TextInput
                          style={styles.numberInput}
                          value={String(contract.warrantyDurations[index] || 0)}
                          onChangeText={(value) =>
                            handleWarrantyDurationChange(index, value)
                          }
                          keyboardType="numeric"
                        />
                        <View style={styles.numberInputStepper}>
                          <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() =>
                              handleWarrantyDurationChange(
                                index,
                                (contract.warrantyDurations[index] || 0) + 1
                              )
                            }
                          >
                            <Icon name="chevron-up" size={16} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() =>
                              handleWarrantyDurationChange(
                                index,
                                Math.max(
                                  0,
                                  (contract.warrantyDurations[index] || 0) - 1
                                )
                              )
                            }
                          >
                            <Icon name="chevron-down" size={16} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Completion date */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Ngày hoàn thành: <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{contract.completeDate}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={new Date(contract.completeDate)}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>
        </View>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          {!isExistingContract ? (
            <SignatureComponent
              onSaveSignature={handleSignatureSave}
              savedSignature={savedSignature}
              title="Chữ ký thợ"
            />
          ) : (
            <SignatureComponent
              initialSignature={contract.woodworkerSignature}
              isEditable={false}
              title="Chữ ký đã lưu"
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  stackContainer: {
    gap: 24,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "500",
    marginBottom: 6,
  },
  required: {
    color: "red",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    color: "blue",
    fontWeight: "500",
  },
  linkIcon: {
    marginLeft: 8,
    color: "blue",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 8,
    height: 120,
    textAlignVertical: "top",
  },
  tableContainer: {
    maxHeight: 250,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: appColorTheme.grey_1,
  },
  tableHeaderCell: {
    padding: 8,
    fontWeight: "600",
    width: 120,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    padding: 8,
    width: 120,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  numberInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
  },
  numberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 4,
  },
  numberInputStepper: {
    marginLeft: 4,
    height: 50,
    justifyContent: "space-between",
  },
  stepperButton: {
    padding: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 10,
  },
  signatureSection: {
    backgroundColor: appColorTheme.grey_1,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
