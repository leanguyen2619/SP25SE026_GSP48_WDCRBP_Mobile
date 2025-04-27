import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { appColorTheme } from "../../../../config/appconfig";
import ImageListSelector from "../../../../components/Utility/ImageListSelector";
import { formatPrice } from "../../../../utils/utils";
import StarReview from "../../../../components/Utility/StarReview";

export default function ProductDetailModal({ product }) {
  const [isOpen, setIsOpen] = useState(false);

  const renderDetailItem = (label, value) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || "-"}</Text>
    </View>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => setIsOpen(true)}
      >
        <Feather name="eye" size={16} color={appColorTheme.brown_2} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Chi tiết sản phẩm</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Hình ảnh sản phẩm</Text>
              <View style={styles.imageContainer}>
                <ImageListSelector imgH={200} imgUrls={product?.mediaUrls} />
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
              <View style={styles.detailsContainer}>
                {renderDetailItem("Mã sản phẩm", product?.productId)}
                {renderDetailItem("Tên sản phẩm", product?.productName)}
                {renderDetailItem("Danh mục", product?.categoryName)}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Mô tả:</Text>
                  <Text style={styles.detailValueMultiline}>
                    {product?.description}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Thông tin kỹ thuật</Text>
              <View style={styles.detailsContainer}>
                <View style={styles.detailsRow}>
                  <View style={styles.detailsColumn}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Giá:</Text>
                      <Text style={styles.priceText}>
                        {formatPrice(product?.price)}
                      </Text>
                    </View>
                    {renderDetailItem("Tồn kho", `${product?.stock} sản phẩm`)}
                    {renderDetailItem(
                      "Bảo hành",
                      `${product?.warrantyDuration} tháng`
                    )}
                    {renderDetailItem(
                      "Kích thước",
                      `${product?.length} x ${product?.width} x ${product?.height} cm`
                    )}
                    {renderDetailItem("Loại gỗ", product?.woodType)}
                  </View>

                  <View style={styles.detailsColumn}>
                    {renderDetailItem("Màu sắc", product?.color)}
                    {renderDetailItem(
                      "Tính năng đặc biệt",
                      product?.specialFeature
                    )}
                    {renderDetailItem("Phong cách", product?.style)}
                    {renderDetailItem("Điêu khắc", product?.sculpture)}
                    {renderDetailItem("Mùi hương", product?.scent)}
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Đánh giá:</Text>
                  <StarReview
                    totalReviews={product?.totalReviews || 0}
                    totalStar={product?.totalStar || 0}
                  />
                </View>

                {renderDetailItem(
                  "Cần giao hàng + lắp đặt",
                  product?.isInstall ? "Có" : "Không"
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={styles.closeModalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  detailButton: {
    padding: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 4,
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
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  detailsColumn: {
    width: "48%",
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
  },
  detailValueMultiline: {
    fontSize: 14,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  closeModalButton: {
    alignSelf: "flex-end",
    backgroundColor: appColorTheme.brown_2,
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 40,
  },
  closeModalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
