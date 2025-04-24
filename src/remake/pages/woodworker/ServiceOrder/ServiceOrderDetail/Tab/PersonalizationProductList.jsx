import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { formatPrice } from "../../../../../utils/utils.js";
import { useGetByServiceOrderMutation } from "../../../../../services/quotationApi";

const windowWidth = Dimensions.get("window").width;

// Tech Spec Item Component
const TechSpecItem = ({ name, value, optionType }) => {
  // For file type specs, use ImageGallery
  if (optionType === "file" && value) {
    return (
      <View style={styles.specFileContainer}>
        <Text style={styles.specName}>{name}:</Text>
        <ImageGallery imgUrls={value} />
      </View>
    );
  }

  // For other types, show as normal text
  return (
    <View style={styles.techSpecItem}>
      <Text style={styles.specName}>{name}:</Text>
      <Text style={styles.specValue}>{value || "Không có"}</Text>
    </View>
  );
};

// Custom Accordion Component
const AccordionItem = ({ title, children, badge, price, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        style={[styles.accordionButton, isExpanded && styles.accordionButtonExpanded]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.accordionHeaderContent}>
          <View style={styles.accordionTitleContainer}>
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

// Image Gallery Component
const ImageGallery = ({ imgUrls }) => {
  if (!imgUrls) return null;
  
  const urls = imgUrls.split(",").filter(url => url.trim() !== "");
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.imageGallery}
    >
      {urls.map((url, index) => (
        <Image
          key={index}
          source={{ uri: url }}
          style={styles.galleryImage}
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  );
};

// Table Component for Quotation Details
const QuotationTable = ({ details }) => {
  const calculateTotalPrice = () => {
    return details.reduce((total, detail) => total + (detail.costAmount || 0), 0) || 0;
  };

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>STT</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Loại chi phí</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Số lượng</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Chi phí</Text>
      </View>
      
      {details.map((detail, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
          <Text style={[styles.tableCell, { flex: 1.5 }]}>{detail.costType}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{detail.quantityRequired}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{formatPrice(detail.costAmount)}</Text>
        </View>
      ))}
      
      <View style={styles.tableTotalRow}>
        <Text style={[styles.tableTotalLabel, { flex: 3 }]}>Tổng chi phí:</Text>
        <Text style={[styles.tableTotalValue, { flex: 1 }]}>{formatPrice(calculateTotalPrice())}</Text>
      </View>
    </View>
  );
};

export default function PersonalizationProductList({
  products = [],
  totalAmount = 0,
  orderId,
}) {
  const [quotationData, setQuotationData] = useState([]);
  const [isLoadingQuotations, setIsLoadingQuotations] = useState(false);
  const [getByServiceOrder] = useGetByServiceOrderMutation();

  // Fetch quotation data on component mount
  useEffect(() => {
    const fetchQuotations = async () => {
      if (!orderId) return;

      try {
        setIsLoadingQuotations(true);
        const response = await getByServiceOrder({
          serviceOrderId: parseInt(orderId),
        }).unwrap();
        setQuotationData(response.data || []);
      } catch (error) {
        console.error("Failed to fetch quotations:", error);
      } finally {
        setIsLoadingQuotations(false);
      }
    };

    fetchQuotations();
  }, [orderId, getByServiceOrder]);

  // Helper function to find quotation details for a specific product
  const findQuotationDetails = (productId) => {
    const productQuotation = quotationData.find(
      (item) => item.requestedProduct.requestedProductId === productId
    );
    return productQuotation?.quotationDetails || [];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thông tin sản phẩm</Text>

      <ScrollView style={styles.productList}>
        {products.map((product) => {
          const personalDetail = product.personalProductDetail;
          const techSpecList = personalDetail?.techSpecList || [];
          const quotationDetails = findQuotationDetails(
            product.requestedProductId
          );

          return (
            <AccordionItem
              key={product.requestedProductId}
              title={`#${product.requestedProductId}. ${product.category?.categoryName} x ${product.quantity}`}
              badge={product.category?.categoryName || "Không phân loại"}
              price={product.totalAmount > 0 ? formatPrice(product.totalAmount) : null}
            >
              <View style={styles.productDetailsContainer}>
                {/* Quotation Details */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>
                    Chi tiết báo giá:
                  </Text>

                  {isLoadingQuotations ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={appColorTheme.brown_2} />
                    </View>
                  ) : quotationDetails.length > 0 ? (
                    <QuotationTable details={quotationDetails} />
                  ) : (
                    <Text style={styles.emptyMessage}>
                      Chưa có báo giá cho sản phẩm này
                    </Text>
                  )}
                </View>

                {/* Finish Images if available */}
                {product?.finishImgUrls && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>
                      Ảnh hoàn thành sản phẩm:
                    </Text>
                    <ImageGallery imgUrls={product.finishImgUrls} />
                  </View>
                )}

                {/* Design Images if available */}
                {personalDetail?.designUrls && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>
                      Thiết kế:
                    </Text>
                    <ImageGallery imgUrls={personalDetail.designUrls} />
                  </View>
                )}

                {/* Technical Specifications */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>
                    Thông số kỹ thuật:
                  </Text>
                  
                  {techSpecList.length > 0 ? (
                    <View style={styles.techSpecsContainer}>
                      {techSpecList.map((spec, index) => (
                        <React.Fragment key={index}>
                          <TechSpecItem
                            name={spec.name}
                            value={spec.value}
                            optionType={spec.optionType}
                          />
                          {index < techSpecList.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.emptyMessage}>
                      Không có thông số kỹ thuật
                    </Text>
                  )}
                </View>
              </View>
            </AccordionItem>
          );
        })}
      </ScrollView>

      {totalAmount > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Thành tiền:</Text>
          <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
        </View>
      )}
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: appColorTheme.brown_2,
  },
  techSpecsContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    padding: 12,
  },
  techSpecItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  specFileContainer: {
    marginBottom: 10,
  },
  specName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  specValue: {
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 8,
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
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyMessage: {
    padding: 12,
    color: "#718096",
    fontStyle: "italic",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F7FAFC",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 14,
  },
  tableTotalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#F7FAFC",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableTotalLabel: {
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 8,
  },
  tableTotalValue: {
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
