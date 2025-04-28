import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProductSelectionModal({
  visible,
  onClose,
  orderDetail,
  isLoadingOrderDetail,
  getWarrantyEndDate,
  formatDate,
  handleSelectProduct,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Chọn sản phẩm cần sửa chữa / bảo hành
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            {isLoadingOrderDetail ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3182CE" />
              </View>
            ) : orderDetail?.requestedProduct?.length > 0 ? (
              <FlatList
                data={orderDetail.requestedProduct}
                keyExtractor={(item) => item.requestedProductId.toString()}
                renderItem={({ item: product }) => {
                  const warrantyEndDate = getWarrantyEndDate(product);
                  const isExpired =
                    warrantyEndDate && new Date() > warrantyEndDate;

                  return (
                    <TouchableOpacity
                      style={styles.productItem}
                      onPress={() => handleSelectProduct(product)}
                    >
                      <View style={styles.productContent}>
                        {(product.designIdeaVariantDetail?.img_urls ||
                          product.finishImgUrls) && (
                          <Image
                            style={styles.productImage}
                            source={{
                              uri: (
                                product.designIdeaVariantDetail?.img_urls ||
                                product.finishImgUrls
                              )?.split(",")[0],
                            }}
                          />
                        )}
                        <View style={styles.productInfo}>
                          <Text style={styles.productName}>
                            {`#${product.requestedProductId}. `}
                            {product.designIdeaVariantDetail?.name ||
                              product.category?.categoryName ||
                              "Sản phẩm"}
                          </Text>
                          <View style={styles.warrantyRow}>
                            <Text style={styles.warrantyText}>
                              Thời hạn bảo hành: {product.warrantyDuration || 0}{" "}
                              tháng
                            </Text>
                            <View
                              style={[
                                styles.badge,
                                isExpired
                                  ? styles.expiredBadge
                                  : styles.validBadge,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.badgeText,
                                  isExpired
                                    ? styles.expiredBadgeText
                                    : styles.validBadgeText,
                                ]}
                              >
                                {isExpired ? "Đã hết hạn" : "Còn hạn"}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.expiryDate}>
                            Hết hạn ngày: {formatDate(warrantyEndDate)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            ) : (
              <View style={styles.alert}>
                <Ionicons name="information-circle" size={24} color="#3182CE" />
                <Text style={styles.alertText}>
                  Không tìm thấy thông tin sản phẩm trong đơn hàng này.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeButtonBottom}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 15,
    maxHeight: 400,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  productItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginBottom: 10,
  },
  productContent: {
    flexDirection: "row",
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
  warrantyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  warrantyText: {
    fontSize: 13,
    color: "#4A5568",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  validBadge: {
    backgroundColor: "rgba(56, 161, 105, 0.1)",
  },
  expiredBadge: {
    backgroundColor: "rgba(229, 62, 62, 0.1)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  validBadgeText: {
    color: "#38A169",
  },
  expiredBadgeText: {
    color: "#E53E3E",
  },
  expiryDate: {
    fontSize: 13,
    color: "#4A5568",
  },
  alert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    padding: 12,
    borderRadius: 6,
  },
  alertText: {
    marginLeft: 8,
    color: "#2C5282",
    flex: 1,
  },
  separator: {
    height: 10,
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "flex-end",
  },
  closeButtonBottom: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#EDF2F7",
    borderRadius: 6,
  },
  closeButtonText: {
    color: "#1A202C",
    fontWeight: "500",
  },
});
