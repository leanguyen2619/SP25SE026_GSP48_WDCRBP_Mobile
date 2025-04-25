import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ImageListSelector from "../../../components/Utility/ImageListSelector.jsx";

export default function PersonalizationProductList({
  productList,
  setProductList,
  handleEditProduct,
  handleRemoveProduct,
  techSpecs,
  notify,
}) {
  // Find tech spec by id
  const getTechSpec = (id) => {
    return techSpecs.find((spec) => spec.techSpecId === parseInt(id));
  };

  // Change quantity for a product in the list
  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 4) return;

    // Calculate total quantity excluding this product
    const totalOtherQuantity = productList.reduce((sum, product, i) => {
      if (i === index) return sum;
      return sum + parseInt(product.quantity || 0);
    }, 0);

    // Check if new total exceeds maximum
    if (totalOtherQuantity + newQuantity > 4) {
      notify("Lỗi!", "Tổng số lượng sản phẩm không được vượt quá 4.", "error");
      return;
    }

    const updatedList = [...productList];
    updatedList[index] = { ...updatedList[index], quantity: newQuantity };
    setProductList(updatedList);
  };

  // Get image URLs from product
  const getProductImages = (product) => {
    // Find the file type tech spec
    const fileSpec = techSpecs.find((spec) => spec.optionType === "file");
    if (!fileSpec) return "";

    // Return the value for this tech spec
    return product[`techSpec_${fileSpec.techSpecId}`] || "";
  };

  if (productList.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Danh sách sản phẩm đã thêm</Text>
        <Text>Chưa có sản phẩm nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Danh sách sản phẩm đã thêm</Text>
      <FlatList
        data={productList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.productCard}>
            <View style={styles.productContent}>
              <View style={styles.mainContent}>
                <View style={styles.productHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.productTitle}>
                      Sản phẩm {index + 1}
                    </Text>
                    {item.categoryName && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {item.categoryName}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Display product images if available */}
                {getProductImages(item) && (
                  <View style={styles.imageContainer}>
                    <ImageListSelector
                      imgUrls={getProductImages(item)}
                      imgH={150}
                    />
                  </View>
                )}

                {/* Dynamically render all tech specs with values */}
                {Object.entries(item)
                  .filter(
                    ([key, value]) =>
                      key.startsWith("techSpec_") &&
                      value &&
                      // Don't show file specs here as we're displaying the images separately
                      getTechSpec(parseInt(key.split("_")[1]))?.optionType !==
                        "file"
                  )
                  .map(([key, value]) => {
                    const techSpecId = parseInt(key.split("_")[1]);
                    const spec = getTechSpec(techSpecId);

                    if (!spec) return null;

                    return (
                      <Text key={key} style={styles.specText}>
                        <Text style={styles.specLabel}>{spec.name}:</Text>{" "}
                        {value || "Chưa chọn"}
                      </Text>
                    );
                  })}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditProduct(index)}
                >
                  <MaterialIcons name="edit" size={16} color="white" />
                  <Text style={styles.buttonText}>Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemoveProduct(index)}
                >
                  <MaterialIcons name="delete" size={16} color="white" />
                  <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.quantityContainer}>
              <QuantitySelector
                quantity={item.quantity}
                onChange={(newQuantity) =>
                  handleQuantityChange(index, newQuantity)
                }
              />
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Sub-component for quantity selection
function QuantitySelector({ quantity, onChange }) {
  return (
    <View style={styles.quantityRow}>
      <Text>Số lượng:</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[
            styles.quantityButton,
            parseInt(quantity) <= 1 && styles.disabledButton,
          ]}
          onPress={() => onChange(parseInt(quantity) - 1)}
          disabled={parseInt(quantity) <= 1}
        >
          <MaterialIcons
            name="remove"
            size={14}
            color={parseInt(quantity) <= 1 ? "gray" : "black"}
          />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{quantity}</Text>

        <TouchableOpacity
          style={[
            styles.quantityButton,
            parseInt(quantity) >= 4 && styles.disabledButton,
          ]}
          onPress={() => onChange(parseInt(quantity) + 1)}
          disabled={parseInt(quantity) >= 4}
        >
          <MaterialIcons
            name="add"
            size={14}
            color={parseInt(quantity) >= 4 ? "gray" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 10,
  },
  productCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F8F9FA",
  },
  productContent: {
    padding: 15,
  },
  mainContent: {
    marginBottom: 10,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  badge: {
    backgroundColor: "green",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 15,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  imageContainer: {
    marginBottom: 15,
  },
  specText: {
    marginBottom: 5,
  },
  specLabel: {
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    backgroundColor: "#4299E1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 10,
  },
  quantityContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    marginLeft: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    paddingHorizontal: 10,
  },
});
