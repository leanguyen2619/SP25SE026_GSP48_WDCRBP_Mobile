import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatPrice } from "../../../../utils/utils.js";
import {
  calculateCheapestShipping,
  extractDimensionsFromConfig,
} from "../../../../utils/shippingUtils.js";
import { appColorTheme } from "../../../../config/appconfig.js";
import AddressSelection from "../components/AddressSelection.jsx";
import { useCreateCustomizeOrderMutation } from "../../../../services/serviceOrderApi.js";
import {
  useCalculateShippingFeeMutation,
  useGetAvailableServicesMutation,
} from "../../../../services/ghnApi.js";
import { useNotify } from "../../../../components/Utility/Notify.jsx";
import useCart from "../../../../hooks/useCart.js";

export default function DesignOrderSummary({
  auth,
  selectedGroup,
  selectedAddress,
  setSelectedAddress,
  cartDesigns,
  addresses,
  isLoadingAddresses,
  addressError,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const [createCustomizeOrder] = useCreateCustomizeOrderMutation();
  const [calculateShippingFee] = useCalculateShippingFeeMutation();
  const [getAvailableServices] = useGetAvailableServicesMutation();

  const navigation = useNavigation();
  const notify = useNotify();
  const { removeDesignFromCart } = useCart();

  // Check if we have items with installation requirement
  const isInstall = selectedGroup ? selectedGroup[1] === "install" : false;

  // Calculate shipping fee when address changes for non-installation orders
  useEffect(() => {
    const calculateShipping = async () => {
      // Only calculate shipping fee for non-installation orders
      if (isInstall || !selectedAddress || !cartDesigns?.length) {
        setShippingFee(0);
        setSelectedService(null);
        return;
      }

      const selectedAddressObj = addresses.find(
        (addr) => addr.userAddressId.toString() === selectedAddress
      );

      if (!selectedAddressObj || !selectedAddressObj.districtId) {
        return;
      }

      // Get the first item for origin details
      const firstItem = cartDesigns[0];
      if (!firstItem || !firstItem.fromDistrictId) {
        return;
      }

      try {
        setIsLoadingServices(true);
        setIsCalculatingShipping(true);

        // Prepare items data with dimensions
        const items = cartDesigns.map((item) => {
          const dimensions = extractDimensionsFromConfig(
            item.designIdeaVariantConfig[0]
          );
          return {
            name: item.name,
            quantity: item.quantity,
            height: dimensions.height,
            width: dimensions.width,
            length: dimensions.length,
            weight: 0,
          };
        });

        // Use the extracted shipping calculation utility
        const { selectedService: cheapestService, shippingFee: calculatedFee } =
          await calculateCheapestShipping({
            fromDistrictId: +firstItem.fromDistrictId,
            fromWardCode: firstItem.fromWardCode,
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
        console.error("Error in shipping calculation process:", error);
        setSelectedService(null);
        setShippingFee(0);
      } finally {
        setIsLoadingServices(false);
        setIsCalculatingShipping(false);
      }
    };

    calculateShipping();
  }, [
    selectedAddress,
    cartDesigns,
    isInstall,
    addresses,
    calculateShippingFee,
    getAvailableServices,
  ]);

  // Helper function to get total price for the selected items
  const getSelectedDesignsTotal = () => {
    let total = 0;
    const designs = cartDesigns || [];
    designs.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  // Get the total order amount including shipping fee
  const getTotalAmount = () => {
    return getSelectedDesignsTotal() + shippingFee;
  };

  // Get the total quantity of items in cart
  const getTotalQuantity = () => {
    return cartDesigns?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  // Check if both woodworker and address are selected
  const canProceed =
    selectedGroup !== null &&
    selectedAddress !== null &&
    cartDesigns?.length > 0 &&
    !isCalculatingShipping &&
    !isLoadingServices &&
    (isInstall || selectedService !== null);

  // Get woodworker information from the first cart item
  const woodworkerInfo =
    cartDesigns?.length > 0
      ? {
          name: cartDesigns[0].woodworkerName,
          address: cartDesigns[0].address,
        }
      : null;

  // Handle order submission
  const handlePlaceOrder = async () => {
    try {
      // Validate total quantity
      const totalQuantity = getTotalQuantity();
      if (totalQuantity > 4) {
        notify(
          "Số lượng vượt quá giới hạn",
          "Tổng số lượng sản phẩm không được vượt quá 4.",
          "error"
        );
        return;
      }

      // Check if we have valid selected items
      if (!selectedGroup || !cartDesigns.length) {
        notify("Lỗi", "Vui lòng chọn nhóm sản phẩm để đặt hàng.", "error");
        return;
      }

      // For non-install orders, check if shipping service is selected
      if (!isInstall && !selectedService) {
        notify(
          "Lỗi",
          "Không có dịch vụ vận chuyển phù hợp cho đơn hàng này.",
          "error"
        );
        return;
      }

      // Prepare request data
      const availableServiceId = cartDesigns[0].availableServiceId;
      const selectedAddressObj = addresses.find(
        (addr) => addr.userAddressId.toString() === selectedAddress
      );

      if (!selectedAddressObj) {
        notify("Lỗi", "Không tìm thấy thông tin địa chỉ.", "error");
        return;
      }

      const orderData = {
        availableServiceId: availableServiceId,
        userId: auth.userId,
        designIdeaVariantIds: cartDesigns.map((item) => ({
          designIdeaVariantId: item.designIdeaVariantId,
          quantity: item.quantity,
        })),
        address: selectedAddressObj.address,
        description: description.trim(),
        isInstall: isInstall, // Use the installation flag from selected group
        // Add shipping information for non-installation orders
        toDistrictId: !isInstall ? selectedAddressObj.districtId : "",
        toWardCode: !isInstall ? selectedAddressObj.wardCode : "",
        priceShipping: !isInstall ? shippingFee : 0,
        ghnServiceId:
          !isInstall && selectedService ? selectedService.service_id : 0,
        ghnServiceTypeId:
          !isInstall && selectedService ? selectedService.service_type_id : 0,
      };

      // Call the API
      setIsSubmitting(true);
      const response = await createCustomizeOrder(orderData).unwrap();

      if (response.code === 200) {
        // Clear cart items for this woodworker after successful order
        const woodworkerId = selectedGroup[0];
        cartDesigns.forEach((item) => {
          removeDesignFromCart(woodworkerId, item.designIdeaVariantId);
        });

        notify(
          "Đặt hàng thành công",
          "Đơn hàng của bạn đã được tạo",
          "success"
        );

        navigation.navigate("Success", {
          title: "Đặt hàng thành công",
          desc: "Đơn hàng của bạn đã được tạo thành công, vui lòng đợi xưởng mộc xác nhận đơn hàng.",
          buttonText: "Xem danh sách đơn hàng",
          path: "CustomerServiceOrders",
        });
      } else {
        throw new Error(response.message || "Có lỗi xảy ra khi đặt hàng");
      }
    } catch (error) {
      console.error("Order error:", error);
      notify(
        "Đặt hàng thất bại",
        error.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Auth");
  };

  if (!selectedGroup) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Thông tin đặt hàng</Text>
        <Text style={styles.emptyText}>
          Vui lòng chọn một nhóm sản phẩm để tiến hành đặt hàng
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin đặt hàng</Text>

      {getTotalQuantity() > 4 && (
        <View style={styles.warningAlert}>
          <MaterialIcons
            name="warning"
            size={20}
            color="#DD6B20"
            style={styles.alertIcon}
          />
          <Text style={styles.warningAlertText}>
            Số lượng sản phẩm vượt quá giới hạn (tối đa 4)
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      {/* Order Type Information */}
      <View
        style={[
          styles.orderTypeContainer,
          isInstall ? styles.installOrderType : styles.noInstallOrderType,
        ]}
      >
        <Text style={styles.orderTypeText}>
          {isInstall ? "Đơn hàng có lắp đặt" : "Đơn hàng không cần lắp đặt"}
        </Text>
      </View>

      {/* Woodworker Information Section */}
      {woodworkerInfo && (
        <View style={styles.woodworkerInfo}>
          <Text style={styles.woodworkerTitle}>Thông tin xưởng mộc:</Text>

          <View style={styles.woodworkerNameContainer}>
            <MaterialIcons
              name="store"
              size={16}
              color="#4A5568"
              style={styles.iconMargin}
            />
            <Text style={styles.woodworkerName} numberOfLines={1}>
              {woodworkerInfo.name || "Không có tên xưởng"}
            </Text>
          </View>

          <View style={styles.woodworkerAddressContainer}>
            <MaterialIcons
              name="location-on"
              size={16}
              color="#718096"
              style={styles.iconMargin}
            />
            <Text style={styles.woodworkerAddress}>
              {woodworkerInfo.address || "Không có địa chỉ"}
            </Text>
          </View>
        </View>
      )}

      {/* Address Selection Section */}
      {auth && (
        <View style={styles.addressSection}>
          <AddressSelection
            addresses={addresses}
            isLoading={isLoadingAddresses}
            error={addressError}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </View>
      )}

      {/* Shipping Service Info for non-installation orders */}
      {!isInstall &&
        selectedAddress &&
        (isLoadingServices || isCalculatingShipping) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3182CE" />
          </View>
        )}

      {/* Note Section */}
      <View style={styles.notesSection}>
        <Text style={styles.notesLabel}>Ghi chú đơn hàng</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt cho đơn hàng này"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.divider} />

      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tiền sản phẩm:</Text>
          <Text style={styles.summaryValue}>
            {formatPrice(getSelectedDesignsTotal())}
          </Text>
        </View>

        {!isInstall && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>

            {isCalculatingShipping || isLoadingServices ? (
              <ActivityIndicator size="small" color="#3182CE" />
            ) : selectedService ? (
              <Text style={styles.summaryValue}>
                {shippingFee > 0 ? formatPrice(shippingFee) : "Miễn phí"}
              </Text>
            ) : (
              <Text style={styles.notAvailableText}>Không khả dụng</Text>
            )}
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng giá trị:</Text>
          <Text style={styles.totalValue}>{formatPrice(getTotalAmount())}</Text>
        </View>
      </View>

      {auth ? (
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            (!canProceed || getTotalQuantity() > 4) && styles.disabledButton,
          ]}
          disabled={!canProceed || getTotalQuantity() > 4 || isSubmitting}
          onPress={handlePlaceOrder}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Feather
                name="shopping-cart"
                size={20}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.placeOrderButtonText}>
                Tiến hành đặt hàng
              </Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Feather
            name="log-in"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.loginButtonText}>
            Đăng nhập để sử dụng dịch vụ
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyText: {
    color: "#718096",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },
  warningAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEEBC8",
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  alertIcon: {
    marginRight: 8,
  },
  warningAlertText: {
    color: "#DD6B20",
    flex: 1,
  },
  orderTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  installOrderType: {
    backgroundColor: "#EBF8FF",
  },
  noInstallOrderType: {
    backgroundColor: "#FEEBC8",
  },
  orderTypeText: {
    fontWeight: "500",
  },
  woodworkerInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F7FAFC",
    borderRadius: 6,
  },
  woodworkerTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  woodworkerNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  woodworkerName: {
    fontWeight: "500",
    fontSize: 14,
  },
  woodworkerAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  woodworkerAddress: {
    fontSize: 14,
    color: "#718096",
  },
  iconMargin: {
    marginRight: 6,
  },
  addressSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginVertical: 8,
  },
  notesSection: {
    marginTop: 16,
  },
  notesLabel: {
    fontWeight: "500",
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 12,
    minHeight: 100,
  },
  summaryContainer: {
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  notAvailableText: {
    color: "#E53E3E",
    fontSize: 14,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  placeOrderButton: {
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CBD5E0",
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  placeOrderButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
