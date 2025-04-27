import { useState, useEffect } from "react";
import { format, add } from "date-fns";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { formatPrice } from "../../../../../utils/utils.js";
import ImageListSelector from "../../../../../components/Utility/ImageListSelector.jsx";
import { useGetByServiceOrderMutation } from "../../../../../services/quotationApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TechSpecItem = ({ name, value, optionType }) => {
  if (optionType === "file" && value) {
    return (
      <View style={styles.techSpecItem}>
        <Text style={styles.techSpecLabel}>{name}:</Text>
        <ImageListSelector imgUrls={value} imgH={150} />
      </View>
    );
  }

  return (
    <View style={styles.techSpecItem}>
      <Text style={styles.techSpecLabel}>{name}:</Text>
      <Text style={styles.techSpecValue}>{value || "Không có"}</Text>
    </View>
  );
};

export default function PersonalizationProduct({
  product = {},
  orderId,
  productCurrentStatus = "",
  currentProductImgUrls = "",
  completionDate = null,
  warrantyDuration = 0,
  isGuarantee,
  guaranteeError,
}) {
  const [quotationData, setQuotationData] = useState([]);
  const [isLoadingQuotations, setIsLoadingQuotations] = useState(false);
  const [getByServiceOrder] = useGetByServiceOrderMutation();

  const personalDetail = product.personalProductDetail;
  const techSpecList = personalDetail?.techSpecList || [];

  const warrantyEndDate = completionDate
    ? add(new Date(completionDate), { months: warrantyDuration })
    : null;

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

  const findQuotationDetails = () => {
    const productQuotation = quotationData.find(
      (item) =>
        item.requestedProduct.requestedProductId === product.requestedProductId
    );
    return productQuotation?.quotationDetails || [];
  };

  const quotationDetails = findQuotationDetails();

  const calculateTotalPrice = (details) => {
    return (
      details?.reduce((total, detail) => total + (detail.costAmount || 0), 0) ||
      0
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <View style={styles.productDetails}>
              <Text style={styles.productTitle}>
                #{product.requestedProductId}.{" "}
                {product.category?.categoryName} x {product.quantity}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {product.category?.categoryName || "Không phân loại"}
                </Text>
              </View>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
        </View>

        <View style={styles.productContent}>
          {/* Quotation Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết báo giá:</Text>

            {isLoadingQuotations ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={appColorTheme.brown_2} />
              </View>
            ) : quotationDetails.length > 0 ? (
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerCell}>STT</Text>
                  <Text style={styles.headerCell}>Loại chi phí</Text>
                  <Text style={styles.headerCell}>Số lượng cần dùng</Text>
                  <Text style={styles.headerCell}>Chi phí</Text>
                </View>

                {quotationDetails.map((detail, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.cell}>{index + 1}</Text>
                    <Text style={styles.cell}>{detail.costType}</Text>
                    <Text style={styles.cell}>{detail.quantityRequired}</Text>
                    <Text style={styles.cell}>{formatPrice(detail.costAmount)}</Text>
                  </View>
                ))}

                <View style={styles.tableRow}>
                  <Text style={[styles.cell, styles.boldText, styles.rightAlign]}>
                    Tổng chi phí:
                  </Text>
                  <Text style={[styles.cell, styles.totalPrice]}>
                    {formatPrice(calculateTotalPrice(quotationDetails))}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.emptyText}>Chưa có báo giá cho sản phẩm này</Text>
            )}
          </View>

          {/* Finish Images if available */}
          {product?.finishImgUrls && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ảnh hoàn thành sản phẩm:</Text>
              <ImageListSelector
                imgUrls={product.finishImgUrls}
                imgH={200}
              />
            </View>
          )}

          {/* Design Images if available */}
          {personalDetail?.designUrls && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thiết kế:</Text>
              <ImageListSelector
                imgUrls={personalDetail.designUrls}
                imgH={200}
              />
            </View>
          )}

          {/* Technical Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông số kỹ thuật:</Text>
            <View style={styles.techSpecList}>
              {techSpecList.map((spec, index) => (
                <TechSpecItem
                  key={index}
                  name={spec.name}
                  value={spec.value}
                  optionType={spec.optionType}
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Thông tin sửa chữa */}
      <View style={styles.repairInfo}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColorTheme.brown_2,
  },
  categoryBadge: {
    backgroundColor: '#f0e6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryText: {
    color: '#6b46c1',
    fontSize: 12,
  },
  productContent: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColorTheme.brown_2,
    marginBottom: 8,
  },
  centerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  tableContainer: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  rightAlign: {
    textAlign: 'right',
  },
  totalPrice: {
    fontSize: 18,
    color: appColorTheme.brown_2,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  techSpecList: {
    gap: 8,
  },
  techSpecItem: {
    marginBottom: 8,
  },
  techSpecLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  techSpecValue: {
    flex: 1,
  },
  repairInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
  },
  repairTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColorTheme.brown_2,
    marginBottom: 12,
  },
  repairContent: {
    gap: 8,
  },
  repairItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repairLabel: {
    fontWeight: 'bold',
  },
  repairValue: {
    flex: 1,
    textAlign: 'right',
  },
  errorLabel: {
    fontWeight: 'bold',
    color: 'red',
  },
  errorValue: {
    color: 'red',
    flex: 1,
    textAlign: 'right',
  },
});
