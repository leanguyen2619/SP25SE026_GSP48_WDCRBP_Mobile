import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ImageUpdateUploader from "../../../components/Utility/ImageUpdateUploader.jsx";
import ActionButton from "../../../components/Button/ActionButton.jsx";
import AutoCompleteInput from "./AutoCompleteInput.jsx";
import { useState } from "react";
import CategorySelector from "../../../components/Utility/CategorySelector.jsx";
import NumberInput from "../../../components/Utility/NumberInput.jsx";

export default function AddPersonalizationProduct({
  techSpecs = [],
  productData = {},
  setProductData,
  handleAddProduct,
  isEditing = false,
  onCancelEdit,
}) {
  // Add a resetKey state to force components to remount
  const [resetKeys, setResetKeys] = useState({});

  // Handle form input changes
  const handleInputChange = (techSpecId, value) => {
    setProductData({
      ...productData,
      [`techSpec_${techSpecId}`]: value,
    });
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setProductData((prevData) => {
      const newData = {
        ...prevData,
        categoryId: categoryId,
      };

      return newData;
    });
  };

  // Handle category name update
  const handleCategoryNameChange = (categoryName) => {
    setProductData((prevData) => {
      const newData = {
        ...prevData,
        categoryName: categoryName,
      };

      return newData;
    });
  };

  // Handle quantity changes
  const handleQuantityChange = (value) => {
    // Đảm bảo giá trị nằm trong khoảng 1-4
    let numValue = parseInt(value) || 1;
    if (numValue < 1) numValue = 1;
    if (numValue > 4) numValue = 4;

    setProductData({
      ...productData,
      quantity: numValue,
    });
  };

  // Create a wrapped handleAddProduct function to reset components
  const wrappedHandleAddProduct = () => {
    // Call the original handleAddProduct function
    handleAddProduct();

    // Reset keys to force components to remount
    const newResetKeys = {
      categorySelector: Date.now(), // Add a key for CategorySelector
    };

    // Reset AutoCompleteInput và ImageUpdateUploader keys
    techSpecs.forEach((spec) => {
      if (spec.optionType === "file" || spec.optionType === "select") {
        newResetKeys[spec.techSpecId] = Date.now();
      }
    });

    setResetKeys(newResetKeys);

    // Reset toàn bộ dữ liệu sản phẩm
    if (!isEditing) {
      setProductData({});
    }
  };

  // Handle file upload completion
  const handleImageUploadComplete = (techSpecId, imageUrls) => {
    handleInputChange(techSpecId, imageUrls);
  };

  // Render appropriate input for each tech spec type
  const renderInput = (techSpec) => {
    const value = productData[`techSpec_${techSpec.techSpecId}`] || "";

    switch (techSpec.optionType) {
      case "number":
        return (
          <NumberInput
            value={value}
            onChangeText={(valueString) =>
              handleInputChange(techSpec.techSpecId, valueString)
            }
            min={1}
            label=""
          />
        );

      case "select":
        return (
          <AutoCompleteInput
            options={techSpec.values || []}
            key={resetKeys[techSpec.techSpecId] || techSpec.techSpecId}
            value={value}
            onChange={(newValue) => {
              handleInputChange(techSpec.techSpecId, newValue);
            }}
            placeholder={`Chọn ${techSpec.name.toLowerCase()}`}
          />
        );

      case "file":
        // Add key prop to force re-render
        return (
          <ImageUpdateUploader
            key={resetKeys[techSpec.techSpecId] || techSpec.techSpecId}
            imgUrls={value} // Pass the current image URLs
            maxFiles={4}
            onUploadComplete={(imgUrls) =>
              handleImageUploadComplete(techSpec.techSpecId, imgUrls)
            }
          />
        );

      case "text":
      default:
        return (
          <TextInput
            style={styles.textInput}
            placeholder={`Nhập ${techSpec.name.toLowerCase()}`}
            value={value}
            onChangeText={(text) =>
              handleInputChange(techSpec.techSpecId, text)
            }
          />
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>
          {isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        </Text>

        <Text style={styles.note}>
          (Lưu ý sử dụng <Text style={styles.bold}>cm</Text> làm đơn vị cho kích
          thước)
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Danh mục sản phẩm *</Text>
          <CategorySelector
            key={resetKeys.categorySelector || "category-selector"}
            setCategoryId={handleCategoryChange}
            setCategoryName={handleCategoryNameChange}
          />
          {productData.categoryName && (
            <Text style={styles.categorySelected}>
              Danh mục đã chọn:{" "}
              <Text style={styles.bold}>{productData.categoryName}</Text>
            </Text>
          )}
        </View>

        {techSpecs.map((techSpec) => (
          <View key={techSpec.techSpecId} style={styles.formGroup}>
            <Text style={styles.label}>{techSpec.name} *</Text>
            {renderInput(techSpec)}
          </View>
        ))}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Số lượng sản phẩm</Text>
          <View style={styles.quantityContainer}>
            <NumberInput
              value={productData.quantity?.toString()}
              onChangeText={handleQuantityChange}
              min={1}
              max={4}
              style={{ width: 120 }}
            />
            <Text style={styles.quantityHelp}>Tối đa 4 sản phẩm</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <View style={styles.buttonGroup}>
              <ActionButton
                text="Hủy"
                bgColor="gray"
                onClickExeFn={onCancelEdit}
              />
              <View style={styles.buttonSpacing} />
              <ActionButton
                text="Cập nhật"
                onClickExeFn={wrappedHandleAddProduct}
              />
            </View>
          ) : (
            <ActionButton
              text="+ Thêm sản phẩm"
              onClickExeFn={wrappedHandleAddProduct}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  note: {
    color: "gray",
    marginBottom: 15,
  },
  bold: {
    fontWeight: "bold",
  },
  formGroup: {
    marginTop: 15,
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  numberInput: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 120,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
  },
  numberInputField: {
    flex: 1,
    textAlign: "center",
    padding: 10,
    fontSize: 16,
  },
  stepperButton: {
    width: 30,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityHelp: {
    marginLeft: 10,
    color: "gray",
  },
  categorySelected: {
    marginTop: 8,
    fontSize: 14,
    color: "green",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  buttonGroup: {
    flexDirection: "row",
  },
  buttonSpacing: {
    width: 10,
  },
});
