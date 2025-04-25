import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { formatPrice } from "../../../../../utils/utils.js";
import ImageListSelector from "../../../../../components/Utility/ImageListSelector";

const windowWidth = Dimensions.get("window").width;

// Attribute Item Component
const AttributeItem = ({ name, value }) => (
  <View style={styles.attributeItem}>
    <Text style={styles.attributeName}>{name}:</Text>
    <Text style={styles.attributeValue}>{value}</Text>
  </View>
);

// Custom Accordion Component
const AccordionItem = ({
  title,
  children,
  image,
  price,
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
          {price && <Text style={styles.priceText}>{price}</Text>}
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

export default function SaleProductList({
  products = [],
  totalAmount = 0,
  shipFee,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thông tin sản phẩm</Text>

      <ScrollView style={styles.productList}>
        {products.map((product) => {
          const saleProduct = product.product;

          return (
            <AccordionItem
              key={product.requestedProductId}
              title={`#${product.requestedProductId}. ${
                saleProduct?.productName || "Sản phẩm không xác định"
              } x ${product?.quantity}`}
              image={saleProduct?.mediaUrls?.split(";")[0] || ""}
              price={formatPrice(product.totalAmount)}
              badge={
                product?.category?.categoryName ||
                saleProduct?.categoryName ||
                "Không phân loại"
              }
            >
              <View style={styles.productDetailsContainer}>
                {/* Finish Images if available */}
                {product?.finishImgUrls && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>
                      Ảnh hoàn thành sản phẩm:
                    </Text>
                    <ImageListSelector
                      imgUrls={product.finishImgUrls}
                      imgH={200}
                    />
                  </View>
                )}

                {/* Product images */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Hình ảnh sản phẩm:</Text>
                  <ImageListSelector
                    imgUrls={saleProduct?.mediaUrls}
                    imgH={200}
                  />
                </View>

                {/* Description */}
                {saleProduct?.description && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Mô tả:</Text>
                    <Text style={styles.descriptionText}>
                      {saleProduct.description}
                    </Text>
                  </View>
                )}

                {/* Product Attributes */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Thông số kỹ thuật:</Text>
                  <View style={styles.attributesContainer}>
                    <AttributeItem
                      name="Kích thước"
                      value={`${saleProduct?.length} x ${saleProduct?.width} x ${saleProduct?.height} cm`}
                    />
                    <View style={styles.divider} />
                    <AttributeItem
                      name="Loại gỗ"
                      value={saleProduct?.woodType || "Không có thông tin"}
                    />
                    <View style={styles.divider} />
                    <AttributeItem
                      name="Màu sắc"
                      value={saleProduct?.color || "Không có thông tin"}
                    />
                    <View style={styles.divider} />
                    <AttributeItem
                      name="Tính năng đặc biệt"
                      value={
                        saleProduct?.specialFeature || "Không có thông tin"
                      }
                    />
                    <View style={styles.divider} />
                    <AttributeItem
                      name="Phong cách"
                      value={saleProduct?.style || "Không có thông tin"}
                    />
                    <View style={styles.divider} />
                    <AttributeItem
                      name="Điêu khắc"
                      value={saleProduct?.sculpture || "Không có thông tin"}
                    />
                    <View style={styles.divider} />
                    <AttributeItem
                      name="Mùi hương"
                      value={saleProduct?.scent || "Không có thông tin"}
                    />
                    <View style={styles.divider} />
                    <AttributeItem
                      name="Bảo hành"
                      value={`${saleProduct?.warrantyDuration || 0} tháng`}
                    />
                  </View>
                </View>
              </View>
            </AccordionItem>
          );
        })}
      </ScrollView>

      {shipFee > 0 && (
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Phí vận chuyển:</Text>
          <Text style={styles.costValue}>{formatPrice(shipFee)}</Text>
        </View>
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Thành tiền:</Text>
        <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  productList: {
    maxHeight: 500,
  },
  accordionItem: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
  accordionButton: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 10,
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
    fontWeight: "bold",
    flex: 1,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
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
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    marginHorizontal: 8,
  },
  accordionPanel: {
    padding: 12,
  },
  productDetailsContainer: {
    marginTop: 8,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: appColorTheme.brown_2,
  },
  descriptionText: {
    lineHeight: 20,
  },
  attributesContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    padding: 10,
  },
  attributeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  attributeName: {
    fontWeight: "bold",
    flex: 1,
  },
  attributeValue: {
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 6,
  },
  imageGallery: {
    marginTop: 8,
  },
  galleryImage: {
    width: windowWidth * 0.6,
    height: 200,
    marginRight: 8,
    borderRadius: 8,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: appColorTheme.grey_0,
    borderRadius: 8,
    marginTop: 12,
  },
  costLabel: {
    fontSize: 16,
  },
  costValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: appColorTheme.grey_0,
    borderRadius: 8,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
});
