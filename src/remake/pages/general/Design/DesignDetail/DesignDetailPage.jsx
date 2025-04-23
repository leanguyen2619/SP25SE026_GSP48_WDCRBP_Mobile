import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { appColorTheme } from "../../../../config/appconfig.js";
import ReviewSection from "./ReviewSection.jsx";
import { Ionicons } from "@expo/vector-icons";
import ImageListSelector from "../../../../components/Utility/ImageListSelector.jsx";
import DesignVariantConfig from "./DesignVariantConfig.jsx";
import useAuth from "../../../../hooks/useAuth.js";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  useGetDesignByIdQuery,
  useGetDesignIdeaVariantQuery,
} from "../../../../services/designIdeaApi.js";
import { useGetAvailableServiceByWwIdQuery } from "../../../../services/availableServiceApi.js";
import StarReview from "../../../../components/Utility/StarReview.jsx";
import WoodworkerBox from "./WoodworkerBox.jsx";
import useCart from "../../../../hooks/useCart.js";
import { useNotify } from "../../../../components/Utility/Notify.jsx";
import RootLayout from "../../../../layouts/RootLayout.jsx";

export default function DesignDetailPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const designId = route.params?.id;
  const { auth } = useAuth();
  const { addDesignToCart } = useCart();
  const notify = useNotify();

  // State to track selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Fetch design details and variants
  const {
    data: designData,
    isLoading: isDesignLoading,
    error: designError,
  } = useGetDesignByIdQuery(designId);

  const {
    data: variantData,
    isLoading: isVariantLoading,
    error: variantError,
  } = useGetDesignIdeaVariantQuery(designId);

  // Extract design details from API response
  const designDetail = designData?.data;
  const designVariants = variantData?.data;

  // Fetch woodworker service status
  const woodworkerId = designDetail?.woodworkerProfile?.woodworkerId;
  const { data: serviceData, isLoading: isServiceLoading } =
    useGetAvailableServiceByWwIdQuery(woodworkerId, {
      skip: !woodworkerId,
    });

  // Check if customization service is operating
  const availableServices = serviceData?.data || [];

  const customizationService = availableServices.find(
    (service) => service?.service?.serviceName === "Customization"
  );

  const isCustomizationAvailable =
    customizationService?.operatingStatus !== false;

  // Check if service pack is valid (not expired)
  const isServicePackValid =
    designDetail?.woodworkerProfile?.servicePackEndDate &&
    Date.now() <=
      new Date(designDetail.woodworkerProfile.servicePackEndDate).getTime();

  const isWoodworkerProfilePublic =
    designDetail?.woodworkerProfile?.publicStatus == true;

  // Design is available if both service is operating and service pack is valid
  const isDesignAvailable =
    isCustomizationAvailable && isServicePackValid && isWoodworkerProfilePublic;

  if (
    isDesignLoading ||
    isVariantLoading ||
    (woodworkerId && isServiceLoading)
  ) {
    return (
      <RootLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColorTheme.brown_2} />
          <Text style={styles.loadingText}>Đang tải thông tin thiết kế...</Text>
        </View>
      </RootLayout>
    );
  }

  if (designError || variantError) {
    return (
      <RootLayout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Có lỗi xảy ra khi tải thông tin thiết kế. Vui lòng thử lại sau.
          </Text>
        </View>
      </RootLayout>
    );
  }

  // Handler for adding item to cart
  const handleAddToCart = () => {
    if (!selectedVariant) {
      Alert.alert("Thông báo", "Vui lòng chọn biến thể sản phẩm");
      return;
    }

    const cartItem = {
      ...selectedVariant,
      designId,
      name: designDetail?.name,
      img_urls: designDetail?.img_urls?.split(";")[0],
      woodworkerId: designDetail?.woodworkerProfile?.woodworkerId,
      woodworkerName: designDetail?.woodworkerProfile?.brandName,
      quantity: 1,
      address: designDetail?.woodworkerProfile?.address,
      fromDistrictId: designDetail?.woodworkerProfile?.districtId,
      fromWardCode: designDetail?.woodworkerProfile?.wardCode,
      availableServiceId: customizationService?.availableServiceId,
      isInstall: designDetail?.isInstall,
    };

    addDesignToCart(cartItem);

    notify("Thành công", "Sản phẩm đã được thêm vào giỏ hàng", "success");
  };

  // Handler for ordering now (add to cart and navigate to checkout)
  const handleOrderNow = () => {
    if (!selectedVariant) {
      Alert.alert("Thông báo", "Vui lòng chọn biến thể sản phẩm");
      return;
    }

    const cartItem = {
      ...selectedVariant,
      name: designDetail?.name,
      img_urls: designDetail?.img_urls?.split(";")[0],
      woodworkerId: designDetail?.woodworkerProfile?.woodworkerId,
      woodworkerName: designDetail?.woodworkerProfile?.brandName,
      address: designDetail?.woodworkerProfile?.address,
      fromDistrictId: designDetail?.woodworkerProfile?.districtId,
      fromWardCode: designDetail?.woodworkerProfile?.wardCode,
      quantity: 1,
      availableServiceId: customizationService?.availableServiceId,
      isInstall: designDetail?.isInstall,
    };

    addDesignToCart(cartItem);

    // Navigate to cart page with parameters
    navigation.navigate("Cart", {
      selectedWoodworker: designDetail?.woodworkerProfile?.woodworkerId,
      tab: "design",
    });
  };

  return (
    <RootLayout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Chi tiết thiết kế</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.imageSection}>
            <ImageListSelector imgUrls={designDetail?.img_urls || ""} />
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailsContent}>
              <View style={styles.productHeader}>
                <Text style={styles.productTitle}>
                  {designDetail?.name || "Tên sản phẩm"}
                </Text>

                {!isDesignAvailable && (
                  <View style={styles.unavailableAlert}>
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#3182CE"
                    />
                    <Text style={styles.unavailableText}>
                      Tạm ngừng kinh doanh
                    </Text>
                  </View>
                )}

                <StarReview
                  totalReviews={designDetail?.totalReviews}
                  totalStar={designDetail?.totalStar}
                />
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Loại sản phẩm:</Text>
                <Text style={styles.infoValue}>
                  {designDetail?.category?.categoryName || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lắp đặt:</Text>
                <Text style={styles.infoValue}>
                  {designDetail?.isInstall
                    ? "Cần lắp đặt"
                    : "Không cần lắp đặt"}
                </Text>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.infoLabel}>Mô tả:</Text>
                <Text style={styles.descriptionText}>
                  {designDetail?.description || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.configContainer}>
                <DesignVariantConfig
                  design={designDetail}
                  designVariants={designVariants}
                  onVariantSelect={setSelectedVariant}
                />
              </View>

              {auth?.role === "Customer" && isDesignAvailable && (
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.orderButton}
                    onPress={handleOrderNow}
                  >
                    <Ionicons
                      name="bag-outline"
                      size={20}
                      color="white"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.orderButtonText}>ĐẶT NGAY</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cartButton}
                    onPress={handleAddToCart}
                  >
                    <Ionicons
                      name="cart-outline"
                      size={20}
                      color={appColorTheme.brown_2}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.cartButtonText}>Thêm vào giỏ</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <WoodworkerBox designDetail={designDetail} />
          <ReviewSection designId={designId} />
        </View>
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  loadingText: {
    marginTop: 16,
    color: appColorTheme.brown_2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
  },
  imageSection: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: "white",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsSection: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: "white",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsContent: {
    gap: 12,
  },
  productHeader: {
    gap: 8,
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  unavailableAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    borderRadius: 6,
    padding: 8,
  },
  unavailableText: {
    marginLeft: 8,
    color: "#2C5282",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 4,
  },
  infoValue: {
    flex: 1,
  },
  descriptionContainer: {
    marginVertical: 8,
  },
  descriptionText: {
    marginTop: 4,
  },
  configContainer: {
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 16,
    flexDirection: "column",
    gap: 12,
  },
  orderButton: {
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 30,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  orderButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cartButton: {
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 30,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cartButtonText: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginRight: 8,
  },
});
