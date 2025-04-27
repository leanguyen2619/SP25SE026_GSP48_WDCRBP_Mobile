import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { appColorTheme } from "../../../../config/appconfig";
import ImageUpload from "../../../../components/Utility/ImageUpload";
import { formatPrice } from "../../../../utils/utils";
import { useCreateProductMutation } from "../../../../services/productApi";
import useAuth from "../../../../hooks/useAuth";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import CategorySelector from "../../../../components/Utility/CategorySelector";
import { validateProductData } from "../../../../validations";

export default function ProductCreateModal({ refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaUrls, setMediaUrls] = useState("");
  const [price, setPrice] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isInstall, setIsInstall] = useState(false);
  const { auth } = useAuth();
  const notify = useNotify();

  // State for form values
  const [formValues, setFormValues] = useState({
    productName: "",
    description: "",
    stock: "0",
    warrantyDuration: "0",
    length: "0",
    width: "0",
    height: "0",
    woodType: "",
    color: "",
    specialFeature: "",
    style: "",
    sculpture: "",
    scent: "",
  });

  // State for category
  const [categoryId, setCategoryId] = useState(null);

  // Mutation hook for creating products
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleInputChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Build the product data
      const productData = {
        ...formValues,
        price: Number(price),
        stock: Number(formValues.stock),
        warrantyDuration: Number(formValues.warrantyDuration),
        length: Number(formValues.length),
        width: Number(formValues.width),
        height: Number(formValues.height),
        mediaUrls: mediaUrls,
        status: true,
        isInstall: isInstall,
        woodworkerId: auth?.wwId,
        categoryId: Number(categoryId),
      };

      // Validate product data
      const errors = validateProductData(productData);
      if (errors.length > 0) {
        notify("Lỗi khi tạo sản phẩm", errors.join("\n"), "error", 3000);
        return;
      }

      // Send API request
      await createProduct(productData).unwrap();

      notify("Thành công", "Sản phẩm đã được tạo thành công", "success");
      setIsOpen(false);
      refetch?.();
    } catch (error) {
      console.error("Error creating product:", error);
      notify(
        "Lỗi",
        error.data?.message || "Không thể tạo sản phẩm. Vui lòng thử lại sau.",
        "error"
      );
    }
  };

  const renderFormField = (
    label,
    field,
    placeholder,
    keyboardType = "default"
  ) => (
    <View style={styles.formControl}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={formValues[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderTextArea = (label, field, placeholder) => (
    <View style={styles.formControl}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder={placeholder}
        value={formValues[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        multiline
        numberOfLines={5}
      />
    </View>
  );

  const renderNumberInput = (label, field, placeholder) => (
    <View style={styles.formControl}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={formValues[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        keyboardType="numeric"
      />
    </View>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.addButtonText}>
          <Feather name="plus" size={16} /> Thêm sản phẩm mới
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        onRequestClose={() => !isLoading && setIsOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Thêm sản phẩm mới</Text>
            {!isLoading && (
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Feather name="x" size={24} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.formGroup}>
              <View style={styles.formControl}>
                <Text style={styles.label}>
                  Hình ảnh <Text style={styles.required}>*</Text>
                </Text>
                <ImageUpload
                  maxFiles={4}
                  onUploadComplete={(result) => {
                    setMediaUrls(result);
                  }}
                />
              </View>

              <View style={styles.formControl}>
                <Text style={styles.label}>
                  Danh mục <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.categoryContainer}>
                  <CategorySelector
                    setCategoryId={setCategoryId}
                    initialCategoryId={categoryId}
                  />
                </View>
              </View>

              {renderFormField(
                "Tên sản phẩm",
                "productName",
                "Nhập tên sản phẩm"
              )}
              {renderTextArea("Mô tả", "description", "Nhập mô tả")}

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  Cần giao hàng + lắp đặt bởi xưởng
                </Text>
                <Switch
                  value={isInstall}
                  onValueChange={setIsInstall}
                  trackColor={{ false: "#767577", true: appColorTheme.green_0 }}
                />
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>
                    Giá <Text style={styles.required}>*</Text>
                  </Text>
                  <Text style={styles.priceText}>{formatPrice(price)}</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={price.toString()}
                    onChangeText={(text) => setPrice(Number(text) || 0)}
                  />
                </View>

                <View style={styles.halfWidth}>
                  {renderNumberInput("Tồn kho", "stock", "0")}
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  {renderNumberInput(
                    "Bảo hành (tháng)",
                    "warrantyDuration",
                    "0"
                  )}
                </View>
                <View style={styles.halfWidth}>
                  {renderNumberInput("Chiều dài (cm)", "length", "0")}
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  {renderNumberInput("Chiều cao (cm)", "height", "0")}
                </View>
                <View style={styles.halfWidth}>
                  {renderNumberInput("Chiều rộng (cm)", "width", "0")}
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  {renderFormField("Loại gỗ", "woodType", "Nhập loại gỗ")}
                </View>
                <View style={styles.halfWidth}>
                  {renderFormField("Màu sắc", "color", "Nhập màu sắc")}
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  {renderFormField(
                    "Tính năng đặc biệt",
                    "specialFeature",
                    "Nhập tính năng đặc biệt"
                  )}
                </View>
                <View style={styles.halfWidth}>
                  {renderFormField("Phong cách", "style", "Nhập phong cách")}
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  {renderFormField("Điêu khắc", "sculpture", "Nhập điêu khắc")}
                </View>
                <View style={styles.halfWidth}>
                  {renderFormField("Mùi hương", "scent", "Nhập mùi hương")}
                </View>
              </View>

              <View style={styles.checkboxContainer}>
                <CheckboxList
                  items={[
                    {
                      isOptional: false,
                      description:
                        "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                    },
                  ]}
                  setButtonDisabled={setButtonDisabled}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  <Feather name="x" size={16} color="#333" />
                  <Text style={styles.cancelButtonText}>Đóng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    (buttonDisabled || isLoading) && styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={buttonDisabled || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Feather name="save" size={16} color="white" />
                      <Text style={styles.buttonText}>Lưu</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: appColorTheme.green_0,
    borderRadius: 4,
  },
  addButtonText: {
    color: appColorTheme.green_0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  formGroup: {
    gap: 16,
  },
  formControl: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  required: {
    color: "red",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoryContainer: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 4,
    marginBottom: 12,
  },
  switchLabel: {
    fontWeight: "500",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  priceText: {
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    marginBottom: 8,
  },
  checkboxContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    gap: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 4,
    backgroundColor: appColorTheme.green_0,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButtonText: {
    color: "#333",
  },
});
