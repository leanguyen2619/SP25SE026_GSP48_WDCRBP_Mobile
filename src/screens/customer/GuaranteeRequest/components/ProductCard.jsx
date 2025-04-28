import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { formatDateString } from "../../../../utils/utils.js";

export default function ProductCard({
  selectedProduct,
  orderDetail,
  getWarrantyEndDate,
  formatDate,
  onOpen,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sản phẩm cần sửa chữa / bảo hành</Text>

      {selectedProduct ? (
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.contentContainer}>
              {(selectedProduct.designIdeaVariantDetail?.img_urls ||
                selectedProduct.finishImgUrls) && (
                <Image
                  style={styles.productImage}
                  source={{
                    uri: (
                      selectedProduct.designIdeaVariantDetail?.img_urls ||
                      selectedProduct.finishImgUrls
                    )?.split(",")[0],
                  }}
                />
              )}

              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {`#${selectedProduct.requestedProductId}. `}
                  {selectedProduct.designIdeaVariantDetail?.name ||
                    selectedProduct.category?.categoryName ||
                    "Sản phẩm"}
                </Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngày nhận sản phẩm:</Text>
                  <Text style={styles.infoValue}>
                    {formatDateString(orderDetail.updatedAt)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Thời hạn bảo hành:</Text>
                  <Text style={styles.infoValue}>
                    {selectedProduct.warrantyDuration || 0} tháng
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Hết hạn bảo hành:</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      {
                        color:
                          getWarrantyEndDate(selectedProduct) &&
                          new Date() > getWarrantyEndDate(selectedProduct)
                            ? "#E53E3E"
                            : "#38A169",
                      },
                    ]}
                  >
                    {formatDate(getWarrantyEndDate(selectedProduct))}
                    {getWarrantyEndDate(selectedProduct) &&
                      new Date() > getWarrantyEndDate(selectedProduct) &&
                      " (Đã hết hạn)"}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.changeButton} onPress={onOpen}>
              <Text style={styles.changeButtonText}>Đổi sản phẩm</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.selectButton} onPress={onOpen}>
          <Text style={styles.selectButtonText}>
            Chọn sản phẩm cần sửa chữa / bảo hành
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  heading: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 15,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardBody: {
    padding: 15,
  },
  contentContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: "#4A5568",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
  },
  changeButton: {
    borderWidth: 1,
    borderColor: "#3182CE",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
    marginTop: 10,
  },
  changeButtonText: {
    color: "#3182CE",
    fontSize: 13,
    fontWeight: "500",
  },
  selectButton: {
    backgroundColor: "#3182CE",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
  selectButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
