import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { format, add } from "date-fns";
import { appColorTheme } from "../../../../../config/appconfig.js";
import ImageListSelector from "../../../../../components/Utility/ImageListSelector.jsx";
import { Ionicons } from "@expo/vector-icons";

// Custom Accordion Component
const AccordionItem = ({
  title,
  children,
  image,
  badge,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        style={[
          styles.accordionButton,
          isExpanded && styles.accordionButtonExpanded,
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.accordionHeaderContent}>
          <View style={styles.accordionTitleContainer}>
            {image && (
              <Image
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.accordionTitle}>{title}</Text>
              {badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#333"
          />
        </View>
      </TouchableOpacity>
      {isExpanded && <View style={styles.accordionPanel}>{children}</View>}
    </View>
  );
};

const AttributeItem = ({ name, value }) => (
  <View style={styles.attributeItem}>
    <Text style={styles.attributeLabel}>{name}:</Text>
    <Text style={styles.attributeValue}>{value}</Text>
  </View>
);

export default function SaleProduct({
  product = {},
  productCurrentStatus = "",
  currentProductImgUrls = "",
  completionDate = null,
  warrantyDuration = 0,
  isGuarantee,
  guaranteeError,
}) {
  const saleProduct = product.product;

  // Calculate warranty end date if completionDate exists
  const warrantyEndDate = completionDate
    ? add(new Date(completionDate), { months: warrantyDuration })
    : null;

  return (
    <ScrollView style={styles.container}>
      <AccordionItem
        title={`#${product.requestedProductId}. ${
          saleProduct?.productName || "Sản phẩm không xác định"
        } x ${product?.quantity}`}
        image={saleProduct?.mediaUrls?.split(";")[0] || ""}
        badge={
          product?.category?.categoryName ||
          saleProduct?.categoryName ||
          "Không phân loại"
        }
      >
        <View style={styles.productContent}>
          {/* Finish Images if available */}
          {product?.finishImgUrls && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ảnh hoàn thành sản phẩm:</Text>
              <ImageListSelector imgUrls={product.finishImgUrls} imgH={200} />
            </View>
          )}

          {/* Product images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hình ảnh sản phẩm:</Text>
            <ImageListSelector imgUrls={saleProduct?.mediaUrls} imgH={200} />
          </View>

          {/* Description */}
          {saleProduct?.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mô tả:</Text>
              <Text style={styles.descriptionText}>
                {saleProduct.description}
              </Text>
            </View>
          )}

          {/* Product Attributes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông số kỹ thuật:</Text>
            <View style={styles.attributeList}>
              <AttributeItem
                name="Kích thước"
                value={`${saleProduct?.length} x ${saleProduct?.width} x ${saleProduct?.height} cm`}
              />
              <AttributeItem
                name="Loại gỗ"
                value={saleProduct?.woodType || "Không có thông tin"}
              />
              <AttributeItem
                name="Màu sắc"
                value={saleProduct?.color || "Không có thông tin"}
              />
              <AttributeItem
                name="Tính năng đặc biệt"
                value={saleProduct?.specialFeature || "Không có thông tin"}
              />
              <AttributeItem
                name="Phong cách"
                value={saleProduct?.style || "Không có thông tin"}
              />
              <AttributeItem
                name="Điêu khắc"
                value={saleProduct?.sculpture || "Không có thông tin"}
              />
              <AttributeItem
                name="Mùi hương"
                value={saleProduct?.scent || "Không có thông tin"}
              />
            </View>
          </View>
        </View>
      </AccordionItem>

      {/* Thông tin sửa chữa */}
      <View style={styles.repairInfoCard}>
        <Text style={styles.repairTitle}>Thông tin sửa chữa:</Text>

        <View style={styles.repairContent}>
          {/* Form */}
          <View style={styles.repairItem}>
            <Text style={styles.repairLabel}>Hình thức yêu cầu:</Text>
            <Text style={styles.repairValue}>
              {isGuarantee ? "Bảo hành" : "Sửa chữa"}
            </Text>
          </View>

          {guaranteeError && isGuarantee && (
            <View style={styles.repairItem}>
              <Text style={styles.errorLabel}>Lỗi bảo hành:</Text>
              <Text style={styles.errorValue}>{guaranteeError}</Text>
            </View>
          )}

          {/* Current Status */}
          <View style={styles.repairItem}>
            <Text style={styles.repairLabel}>Trạng thái hiện tại:</Text>
            <Text style={styles.repairValue}>
              {productCurrentStatus || "Chưa có thông tin"}
            </Text>
          </View>

          {/* Completion Date */}
          {completionDate && (
            <View style={styles.repairItem}>
              <Text style={styles.repairLabel}>Ngày khách nhận hàng:</Text>
              <Text style={styles.repairValue}>
                {format(new Date(completionDate), "dd/MM/yyyy")}
              </Text>
            </View>
          )}

          {/* Warranty Information */}
          {warrantyEndDate && (
            <View style={styles.repairItem}>
              <Text style={styles.repairLabel}>Bảo hành đến:</Text>
              <Text style={styles.repairValue}>
                {format(warrantyEndDate, "dd/MM/yyyy")}
              </Text>
            </View>
          )}

          {/* Current Product Images */}
          {currentProductImgUrls && (
            <View style={styles.section}>
              <Text style={styles.repairLabel}>
                Hình ảnh tình trạng hiện tại:
              </Text>
              <ImageListSelector imgUrls={currentProductImgUrls} imgH={200} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  accordionItem: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "white",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  accordionButton: {
    padding: 12,
    backgroundColor: "white",
  },
  accordionButtonExpanded: {
    backgroundColor: appColorTheme.brown_0,
  },
  accordionHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  titleContainer: {
    flex: 1,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  badge: {
    backgroundColor: "#805AD5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  accordionPanel: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  productContent: {
    gap: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    padding: 10,
  },
  attributeList: {
    gap: 8,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    padding: 10,
  },
  attributeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  attributeLabel: {
    fontWeight: "bold",
    flex: 1,
  },
  attributeValue: {
    flex: 1,
    textAlign: "right",
  },
  repairInfoCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  repairTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    marginBottom: 12,
  },
  repairContent: {
    gap: 12,
  },
  repairItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 8,
  },
  repairLabel: {
    fontWeight: "bold",
  },
  repairValue: {
    flex: 1,
    textAlign: "right",
  },
  errorLabel: {
    fontWeight: "bold",
    color: "red",
  },
  errorValue: {
    color: "red",
    flex: 1,
    textAlign: "right",
  },
});
