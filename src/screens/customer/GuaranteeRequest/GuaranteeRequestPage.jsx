import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { addMonths, format } from "date-fns";
import { vi } from "date-fns/locale";
import { appColorTheme } from "../../../config/appconfig.js";
import { useNotify } from "../../../components/Utility/Notify.jsx";
import useAuth from "../../../hooks/useAuth.js";
import WoodworkerBox from "../PersonalizationRequest/WoodworkerBox.jsx";
import AddressSelection from "../Cart/components/AddressSelection.jsx";
import {
  useGetServiceOrdersQuery,
  useGetServiceOrderByIdQuery,
} from "../../../services/serviceOrderApi.js";
import { useCreateGuaranteeOrderMutation } from "../../../services/guaranteeOrderApi.js";
import { useGetUserAddressesByUserIdQuery } from "../../../services/userAddressApi.js";
import { useGetWoodworkerByIdQuery } from "../../../services/woodworkerApi.js";
import {
  useCalculateShippingFeeMutation,
  useGetAvailableServicesMutation,
} from "../../../services/ghnApi";
import {
  calculateCheapestShipping,
  extractDimensionsFromProduct,
} from "../../../utils/shippingUtils.js";

// Import our custom components
import OrderSelection from "./components/OrderSelection.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ProductStatusForm from "./components/ProductStatusForm.jsx";
import ShippingAndPriceSection from "./components/ShippingAndPriceSection.jsx";
import ProductSelectionModal from "./components/ProductSelectionModal.jsx";
import RootLayout from "../../../layouts/RootLayout";

export default function GuaranteeRequestPage() {
  const route = useRoute();
  const woodworkerId = route.params?.id;
  const { auth } = useAuth();
  const navigation = useNavigation();
  const notify = useNotify();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentProductStatus, setCurrentProductStatus] = useState("");
  const [currentProductImages, setCurrentProductImages] = useState("");
  const [isInstall, setIsInstall] = useState(false);
  const [note, setNote] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [currentWoodworkerId, setCurrentWoodworkerId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // New states for warranty/repair handling
  const [isGuarantee, setIsGuarantee] = useState(true);
  const [guaranteeError, setGuaranteeError] = useState("");
  const [isWarrantyValid, setIsWarrantyValid] = useState(false);

  // API calls
  const { data: addressesResponse, isLoading: isLoadingAddresses } =
    useGetUserAddressesByUserIdQuery(auth?.userId, { skip: !auth?.userId });

  // Get service orders - either for a specific woodworker or for the customer
  const {
    data: ordersResponse,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useGetServiceOrdersQuery(
    {
      id: woodworkerId || auth?.userId,
      role: woodworkerId ? "Woodworker" : "Customer",
    },
    { skip: !auth?.userId && !woodworkerId }
  );

  // Get detailed order information when selected
  const { data: orderDetailResponse, isLoading: isLoadingOrderDetail } =
    useGetServiceOrderByIdQuery(selectedOrderId, {
      skip: !selectedOrderId,
    });

  // Get woodworker details with districtId and wardCode
  const {
    data: woodworkerDetailResponse,
    isLoading: isLoadingWoodworkerDetail,
  } = useGetWoodworkerByIdQuery(currentWoodworkerId, {
    skip: !currentWoodworkerId,
  });

  const [calculateShippingFee] = useCalculateShippingFeeMutation();
  const [getAvailableServices] = useGetAvailableServicesMutation();

  const [createGuaranteeOrder, { isLoading: isSubmitting }] =
    useCreateGuaranteeOrderMutation();

  // Filter completed orders
  const completedOrders =
    ordersResponse?.data?.filter((order) => order.status === "Đã hoàn tất") ||
    [];

  // Get order detail
  const orderDetail = orderDetailResponse?.data;

  // Get address list
  const addresses = addressesResponse?.data || [];

  // Get woodworker info from API response
  const woodworkerInfo = woodworkerDetailResponse?.data;

  // Update woodworkerId when order changes
  useEffect(() => {
    if (selectedOrder?.service?.wwDto?.woodworkerId) {
      setCurrentWoodworkerId(selectedOrder.service.wwDto.woodworkerId);
    } else if (orderDetail?.service?.wwDto?.woodworkerId) {
      setCurrentWoodworkerId(orderDetail.service.wwDto.woodworkerId);
    } else {
      setCurrentWoodworkerId(null);
    }
  }, [selectedOrder, orderDetail]);

  // Calculate shipping fee when address or product selection changes
  useEffect(() => {
    const calculateShipping = async () => {
      if (!selectedAddress || !selectedProduct || !woodworkerInfo) {
        setShippingFee(0);
        return;
      }

      const selectedAddressObj = addresses.find(
        (addr) => addr.userAddressId.toString() === selectedAddress
      );

      if (!selectedAddressObj || !selectedAddressObj.districtId) {
        return;
      }

      try {
        setIsCalculatingShipping(true);

        // Get dimensions from the product using the utility function
        const dimensions = extractDimensionsFromProduct(selectedProduct);

        // Prepare items data
        const items = [
          {
            name:
              selectedProduct.category?.categoryName ||
              selectedProduct.designIdeaVariantDetail?.name ||
              "Sản phẩm bảo hành",
            quantity: 1,
            height: dimensions.height,
            width: dimensions.width,
            length: dimensions.length,
            weight: 0,
          },
        ];

        // Use the extracted shipping calculation utility
        const { selectedService: cheapestService, shippingFee: calculatedFee } =
          await calculateCheapestShipping({
            fromDistrictId: woodworkerInfo.districtId,
            fromWardCode: woodworkerInfo.wardCode,
            toDistrictId: +selectedAddressObj.districtId,
            toWardCode: selectedAddressObj.wardCode,
            items,
            getAvailableServices,
            calculateShippingFee,
          });

        // Update state with results
        setSelectedService(cheapestService);
        setShippingFee(calculatedFee);
      } catch (error) {
        setSelectedService(null);
        setShippingFee(0);
      } finally {
        setIsCalculatingShipping(false);
      }
    };

    calculateShipping();
  }, [
    selectedAddress,
    selectedProduct,
    addresses,
    woodworkerInfo,
    calculateShippingFee,
    getAvailableServices,
  ]);

  // Update warranty validity check when product changes
  useEffect(() => {
    if (selectedProduct) {
      const warrantyEndDate = getWarrantyEndDate(selectedProduct);
      const valid = warrantyEndDate && new Date() <= warrantyEndDate;
      setIsWarrantyValid(valid);
      setIsGuarantee(valid); // Set initial state based on warranty validity
    } else {
      setIsWarrantyValid(false);
      setIsGuarantee(false);
    }
  }, [selectedProduct]);

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);

    if (orderId) {
      const order = completedOrders.find(
        (order) => order.orderId.toString() === orderId
      );
      setSelectedOrder(order);
      setSelectedProduct(null);
    } else {
      setSelectedOrder(null);
      setSelectedProduct(null);
    }
  };

  // Handle product selection
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setModalVisible(false);
  };

  // Handle image upload completion
  const handleUploadComplete = (urls) => {
    setCurrentProductImages(urls);
  };

  // Calculate warranty end date
  const getWarrantyEndDate = (product) => {
    if (!product || !product.warrantyDuration) return null;

    const orderDate = orderDetail?.updatedAt || orderDetail?.createdAt;
    if (!orderDate) return null;

    const endDate = addMonths(new Date(orderDate), product.warrantyDuration);

    return endDate;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Không có";
    return format(new Date(date), "dd/MM/yyyy", { locale: vi });
  };

  // Handle form submission - updated to include new fields
  const handleSubmit = async () => {
    if (
      !selectedProduct ||
      !selectedAddress ||
      !currentProductImages.length ||
      !currentProductStatus ||
      (isWarrantyValid && isGuarantee && !guaranteeError) // Add validation for guarantee error
    ) {
      notify(
        "Thông tin không đầy đủ",
        isWarrantyValid && isGuarantee && !guaranteeError
          ? "Vui lòng chọn loại lỗi bảo hành."
          : "Vui lòng điền đầy đủ thông tin và cung cấp hình ảnh sản phẩm hiện tại.",
        "error"
      );
      return;
    }

    try {
      const selectedAddressObj = addresses.find(
        (addr) => addr.userAddressId.toString() === selectedAddress
      );

      if (!selectedAddressObj) {
        notify("Lỗi", "Không tìm thấy thông tin địa chỉ.", "error");
        return;
      }

      const requestData = {
        availableServiceId: selectedOrder?.service?.service?.serviceId || 0,
        toDistrictId: selectedAddressObj.districtId,
        toWardCode: selectedAddressObj.wardCode,
        ghnServiceId: selectedService?.service_id || 0,
        ghnServiceTypeId: selectedService?.service_type_id || 0,
        note: note,
        userId: auth?.userId,
        address: selectedAddressObj.address,
        requestedProductId: selectedProduct.requestedProductId,
        isInstall: isInstall,
        priceShipping: shippingFee * 2,
        productCurrentStatus: currentProductStatus,
        currentProductImgUrls: currentProductImages,
        isGuarantee: isGuarantee,
        guaranteeError: isGuarantee ? guaranteeError : "",
      };

      const response = await createGuaranteeOrder(requestData).unwrap();

      notify(
        "Yêu cầu sửa chữa / bảo hành thành công",
        "Yêu cầu của bạn đã được gửi thành công.",
        "success"
      );

      navigation.navigate("Success", {
        title: "Gửi yêu cầu sửa chữa / bảo hành thành công",
        desc: "Yêu cầu của bạn đã được gửi đi, vui lòng đợi xưởng mộc phản hồi.",
        buttonText: "Xem danh sách yêu cầu",
        path: "/cus/guarantee-order",
      });
    } catch (error) {
      notify(
        "Lỗi",
        error.data?.message || "Có lỗi xảy ra khi gửi yêu cầu.",
        "error"
      );
    }
  };

  // Loading state
  if (
    isLoadingOrders ||
    (isLoadingOrderDetail && selectedOrderId) ||
    isLoadingWoodworkerDetail
  ) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  // Error state
  if (ordersError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.alert}>
          <Ionicons name="alert-circle" size={24} color="red" />
          <Text style={styles.alertText}>
            Có lỗi xảy ra khi tải thông tin đơn hàng. Vui lòng thử lại sau.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <RootLayout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>
            Yêu cầu sửa chữa / bảo hành sản phẩm
          </Text>
        </View>

        <View style={styles.content}>
          {/* Order Selection Component */}
          <OrderSelection
            completedOrders={completedOrders}
            selectedOrderId={selectedOrderId}
            handleOrderSelect={handleOrderSelect}
          />

          {/* Product Selection Component */}
          {selectedOrder && (
            <ProductCard
              selectedProduct={selectedProduct}
              orderDetail={orderDetail}
              getWarrantyEndDate={getWarrantyEndDate}
              formatDate={formatDate}
              onOpen={() => setModalVisible(true)}
            />
          )}

          {/* Woodworker Box Component */}
          {woodworkerInfo && (
            <WoodworkerBox woodworkerProfile={woodworkerInfo} />
          )}

          {/* Product Status Component - updated with new props */}
          {selectedProduct && (
            <ProductStatusForm
              currentProductStatus={currentProductStatus}
              setCurrentProductStatus={setCurrentProductStatus}
              currentProductImages={currentProductImages}
              handleUploadComplete={handleUploadComplete}
              isWarrantyValid={isWarrantyValid}
              guaranteeError={guaranteeError}
              setGuaranteeError={setGuaranteeError}
              isGuarantee={isGuarantee}
              setIsGuarantee={setIsGuarantee}
              woodworkerId={currentWoodworkerId}
            />
          )}

          {/* Address Selection Component */}
          <View style={styles.card}>
            <AddressSelection
              addresses={addresses}
              isLoading={isLoadingAddresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          </View>

          {/* Shipping Options Component - updated with new props */}
          {selectedProduct && selectedAddress && (
            <ShippingAndPriceSection
              isInstall={isInstall}
              setIsInstall={setIsInstall}
              isCalculatingShipping={isCalculatingShipping}
              shippingFee={shippingFee}
              note={note}
              setNote={setNote}
              isGuarantee={isGuarantee}
            />
          )}

          {/* Submit Button - updated validation */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!selectedProduct ||
                  !selectedAddress ||
                  !currentProductImages.length ||
                  !currentProductStatus ||
                  (isWarrantyValid && isGuarantee && !guaranteeError) ||
                  isCalculatingShipping) &&
                  styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={
                !selectedProduct ||
                !selectedAddress ||
                !currentProductImages.length ||
                !currentProductStatus ||
                (isWarrantyValid && isGuarantee && !guaranteeError) ||
                isCalculatingShipping ||
                isSubmitting
              }
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons
                    name="send"
                    size={18}
                    color="white"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>
                    Gửi yêu cầu {isGuarantee ? "bảo hành" : "sửa chữa"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Selection Modal */}
        <ProductSelectionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          orderDetail={orderDetail}
          isLoadingOrderDetail={isLoadingOrderDetail}
          getWarrantyEndDate={getWarrantyEndDate}
          formatDate={formatDate}
          handleSelectProduct={handleSelectProduct}
        />
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  alert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  alertText: {
    marginLeft: 10,
    color: "#B91C1C",
    flex: 1,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  card: {
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
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: appColorTheme.brown_2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});
