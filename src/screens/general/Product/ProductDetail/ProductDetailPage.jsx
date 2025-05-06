import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  appColorTheme,
  servicePackNameConstants,
} from "../../../../config/appconfig.js";
import ReviewSection from "./ReviewSection.jsx";
import StarReview from "../../../../components/Utility/StarReview.jsx";
import ImageListSelector from "../../../../components/Utility/ImageListSelector.jsx";
import RootLayout from "../../../../layouts/RootLayout.jsx";
import { formatPrice } from "../../../../utils/utils.js";
import useAuth from "../../../../hooks/useAuth.js";
import { useGetProductByIdQuery } from "../../../../services/productApi.js";
import { useGetAvailableServiceByWwIdQuery } from "../../../../services/availableServiceApi.js";
import ProductWoodworkerBox from "./ProductWoodworkerBox.jsx";
import useCart from "../../../../hooks/useCart.js";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ProductDetailPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const productId = route.params?.id;
  const { auth } = useAuth();
  const { addProductToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Fetch product data from API
  const {
    data: response,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId);

  const product = response?.data;

  // Fetch woodworker service status
  const woodworkerId = product?.woodworkerId;
  const { data: serviceData, isLoading: isServiceLoading } =
    useGetAvailableServiceByWwIdQuery(woodworkerId, {
      skip: !woodworkerId,
    });

  // Check if sale service is operating
  const availableServices = serviceData?.data || [];

  const saleService = availableServices.find(
    (service) => service?.service?.serviceName === "Sale"
  );

  const isSaleAvailable =
    saleService?.operatingStatus !== false && saleService?.status !== false;

  // Check if service pack is valid (not expired, not BRONZE)
  const isServicePackValid =
    product?.servicePackEndDate &&
    Date.now() <= new Date(product.servicePackEndDate).getTime();

  const isWoodworkerProfilePublic = product?.isWoodworkerProfilePublic == true;

  // Product is available if both service is operating and service pack is valid
  const isProductAvailable =
    isSaleAvailable && isServicePackValid && isWoodworkerProfilePublic;

  // Show notification
  const notify = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product.productId,
      isInstall: product.isInstall,
      productName: product.productName,
      price: product.price,
      mediaUrls: product.mediaUrls,
      woodworkerId: product.woodworkerId,
      woodworkerName: product.woodworkerName,
      fromDistrictId: product.districtId,
      wardCode: product.wardCode,
      quantity: 1,
      woodType: product.woodType,
      color: product.color,
      length: product.length,
      width: product.width,
      height: product.height,
      address: product.address,
      availableServiceId: saleService?.availableServiceId,
    };

    addProductToCart(cartItem);
    notify("Sản phẩm đã được thêm vào giỏ hàng");
  };

  // Handle buy now (add to cart and navigate to checkout)
  const handleBuyNow = () => {
    if (!product) return;

    const cartItem = {
      productId: product.productId,
      productName: product.productName,
      isInstall: product.isInstall,
      price: product.price,
      mediaUrls: product.mediaUrls,
      woodworkerId: product.woodworkerId,
      woodworkerName: product.woodworkerName,
      fromDistrictId: product.districtId,
      fromWardCode: product.wardCode,
      quantity: 1,
      woodType: product.woodType,
      color: product.color,
      length: product.length,
      width: product.width,
      height: product.height,
      address: product.address,
      availableServiceId: saleService?.availableServiceId,
    };

    addProductToCart(cartItem);

    // Navigate to cart page with params
    navigation.navigate("Cart", {
      selectedWoodworker: product.woodworkerId,
      tab: "product",
    });
  };

  // Show loading state
  if (isLoading || (woodworkerId && isServiceLoading)) {
    return (
      <RootLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={appColorTheme.brown_2} />
        </View>
      </RootLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <RootLayout>
        <View style={styles.alertContainer}>
          <View style={styles.alertError}>
            <Ionicons name="alert-circle" size={24} color="red" />
            <Text style={styles.alertText}>
              Có lỗi xảy ra khi tải thông tin sản phẩm. Vui lòng thử lại sau.
            </Text>
          </View>
        </View>
      </RootLayout>
    );
  }

  // Show not found state
  if (!product) {
    return (
      <RootLayout>
        <View style={styles.alertContainer}>
          <View style={styles.alertWarning}>
            <Ionicons name="warning" size={24} color="#ED8936" />
            <Text style={styles.alertText}>
              Không tìm thấy sản phẩm hoặc sản phẩm đã bị xóa.
            </Text>
          </View>
        </View>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>Chi tiết sản phẩm</Text>

        <View style={styles.content}>
          {/* Product Images */}
          <View style={styles.imageContainer}>
            <ImageListSelector imgUrls={product.mediaUrls} />
          </View>

          {/* Product Info */}
          <View style={styles.infoContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.productName}>{product.productName}</Text>
              <StarReview
                totalStar={product.totalStar || 0}
                totalReviews={product.totalReviews || 0}
              />
            </View>

            {!isProductAvailable && (
              <View style={styles.unavailableAlert}>
                <Ionicons name="information-circle" size={20} color="#3182CE" />
                <Text style={styles.unavailableAlertText}>
                  Sản phẩm tạm ngừng kinh doanh
                </Text>
              </View>
            )}

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Loại sản phẩm:</Text>
                <Text style={styles.detailValue}>
                  {product?.categoryName || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Lắp đặt:</Text>
                <Text style={styles.detailValue}>
                  {product?.isInstall ? "Cần lắp đặt" : "Không cần lắp đặt"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Số lượng trong kho:</Text>
                <Text style={styles.detailValue}>{product.stock}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kích thước (D x R x C):</Text>
                <Text style={styles.detailValue}>
                  {product.length} x {product.width} x {product.height} cm
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bảo hành:</Text>
                <Text style={styles.detailValue}>
                  {product.warrantyDuration} tháng
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Loại gỗ:</Text>
                <Text style={styles.detailValue}>{product.woodType}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tính năng đặc biệt:</Text>
                <Text style={styles.detailValue}>{product.specialFeature}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kiểu dáng:</Text>
                <Text style={styles.detailValue}>{product.style}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Chạm khắc:</Text>
                <Text style={styles.detailValue}>{product.sculpture}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hương thơm:</Text>
                <Text style={styles.detailValue}>{product.scent}</Text>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.detailLabel}>Mô tả:</Text>
                <Text style={styles.descriptionText}>
                  {product.description}
                </Text>
              </View>
            </View>

            <View style={styles.priceActionContainer}>
              <View style={styles.priceBox}>
                <Text style={styles.priceText}>
                  {formatPrice(product.price)}
                </Text>
              </View>

              {auth?.role === "Customer" && isProductAvailable && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={handleBuyNow}
                  >
                    <Ionicons
                      name="cart"
                      size={20}
                      color="white"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buyButtonText}>MUA NGAY</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                  >
                    <Ionicons
                      name="add-circle"
                      size={20}
                      color={appColorTheme.brown_2}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.addToCartButtonText}>Thêm vào giỏ</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Woodworker Info */}
          <ProductWoodworkerBox product={product} />

          {/* Reviews */}
          <ReviewSection productId={productId} />
        </View>

        {/* Notification */}
        {showNotification && (
          <View style={styles.notification}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.notificationText}>{notificationMessage}</Text>
          </View>
        )}
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle: {
    color: appColorTheme.brown_2,
    fontSize: 22,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  unavailableAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  unavailableAlertText: {
    marginLeft: 8,
    color: "#2C5282",
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 4,
  },
  detailValue: {
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionText: {
    marginTop: 8,
  },
  priceActionContainer: {
    marginTop: 16,
  },
  priceBox: {
    backgroundColor: appColorTheme.grey_0,
    padding: 16,
    marginBottom: 16,
  },
  priceText: {
    fontSize: 24,
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buyButton: {
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 30,
    padding: 16,
    flex: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addToCartButton: {
    borderColor: appColorTheme.brown_2,
    borderWidth: 1,
    borderRadius: 30,
    padding: 16,
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartButtonText: {
    color: appColorTheme.brown_2,
  },
  alertContainer: {
    padding: 16,
    alignItems: "center",
  },
  alertError: {
    flexDirection: "row",
    backgroundColor: "#FFF5F5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  alertWarning: {
    flexDirection: "row",
    backgroundColor: "#FFFAF0",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  alertText: {
    marginLeft: 8,
    flex: 1,
  },
  notification: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#48BB78",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    marginLeft: 8,
  },
});
