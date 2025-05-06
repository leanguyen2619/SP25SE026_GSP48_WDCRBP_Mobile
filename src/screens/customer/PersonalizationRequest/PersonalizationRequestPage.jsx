import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth.js";
import { useNavigation, useRoute } from "@react-navigation/native";
import AddPersonalizationProduct from "./AddPersonalizationProduct.jsx";
import { appColorTheme } from "../../../config/appconfig.js";
import { useNotify } from "../../../components/Utility/Notify.jsx";
import { useGetAllTechSpecQuery } from "../../../services/techSpecApi";
import { useGetWoodworkerByIdQuery } from "../../../services/woodworkerApi";
import { useGetAvailableServiceByWwIdQuery } from "../../../services/availableServiceApi";
import { useCreatePersonalOrderMutation } from "../../../services/serviceOrderApi";
import PersonalizationProductList from "./PersonalizationProductList.jsx";
import WoodworkerBox from "./WoodworkerBox.jsx";
import { useGetUserAddressesByUserIdQuery } from "../../../services/userAddressApi.js";
import AddressSelection from "../Cart/components/AddressSelection.jsx";
import { MaterialIcons } from "@expo/vector-icons";
import RootLayout from "../../../layouts/RootLayout.jsx";

export default function PersonalizationRequestPage() {
  const route = useRoute();
  const woodworkerId = route.params?.id;
  const { auth } = useAuth();
  const navigation = useNavigation();
  const notify = useNotify();
  const [editIndex, setEditIndex] = useState(-1);
  const [notes, setNotes] = useState(""); // Notes state
  const [selectedAddress, setSelectedAddress] = useState(null); // Selected address state
  const [isInstall, setIsInstall] = useState(true); // Installation request state

  // Fetch addresses
  const {
    data: addressesResponse,
    isLoading: isLoadingAddresses,
    error: addressesError,
  } = useGetUserAddressesByUserIdQuery(auth?.userId, {
    skip: !auth?.userId,
  });

  // Fetch tech specs
  const {
    data: techSpecData,
    isLoading: isTechSpecLoading,
    error: techSpecError,
  } = useGetAllTechSpecQuery();

  // Fetch woodworker data
  const {
    data: woodworkerData,
    isLoading: isWoodworkerLoading,
    error: woodworkerError,
  } = useGetWoodworkerByIdQuery(woodworkerId);

  // Fetch available services
  const {
    data: serviceData,
    isLoading: isServiceLoading,
    error: serviceError,
  } = useGetAvailableServiceByWwIdQuery(woodworkerId);

  // Create order mutation
  const [createPersonalOrder, { isLoading: isCreating }] =
    useCreatePersonalOrderMutation();

  // List of added products
  const [productList, setProductList] = useState([]);

  // Store product being edited or created
  const [productData, setProductData] = useState({});

  // Get available addresses
  const addresses = addressesResponse?.data || [];

  // Check service availability
  const woodworker = woodworkerData?.data;
  const availableServices = serviceData?.data || [];

  const personalizationService = availableServices.find(
    (service) => service?.service?.serviceName === "Personalization"
  );

  const isPersonalizationAvailable =
    personalizationService?.operatingStatus !== false &&
    personalizationService?.status !== false;

  const isServicePackValid =
    woodworker?.servicePackEndDate &&
    Date.now() <= new Date(woodworker.servicePackEndDate).getTime();

  const isServiceAvailable = isPersonalizationAvailable && isServicePackValid;

  // Initialize product data
  const initializeProductData = () => {
    if (!techSpecData?.data) return;

    const initialData = {};
    techSpecData.data.forEach((spec) => {
      initialData[`techSpec_${spec.techSpecId}`] = "";
    });

    initialData.quantity = 1;
    initialData.categoryId = null;
    setProductData(initialData);
    setEditIndex(-1);
  };

  useEffect(() => {
    if (techSpecData?.data) {
      initializeProductData();
    }
  }, [techSpecData]);

  // Handle adding or updating product
  const handleAddProduct = () => {
    // Check total quantity limit
    const currentTotalQuantity = productList.reduce((sum, product, index) => {
      if (editIndex !== -1 && index === editIndex) return sum;
      return sum + parseInt(product.quantity || 0);
    }, 0);

    const newQuantity = parseInt(productData.quantity || 0);
    if (currentTotalQuantity + newQuantity > 4) {
      notify("Lỗi!", "Tổng số lượng sản phẩm không được vượt quá 4.", "error");
      return;
    }

    // Check for falsy properties in productData
    const hasFalsyProperty = Object.values(productData).some((value) => !value);
    if (hasFalsyProperty) {
      notify(
        "Lỗi!",
        "Không được để trống bất kỳ thông số kỹ thuật nào.",
        "error"
      );
      return;
    }

    if (editIndex === -1) {
      setProductList([...productList, productData]);
      notify("Thành công!", "Sản phẩm đã được thêm vào danh sách.", "success");
    } else {
      const updatedList = [...productList];
      updatedList[editIndex] = productData;
      setProductList(updatedList);
      notify("Thành công!", "Sản phẩm đã được cập nhật.", "success");
    }

    initializeProductData();
  };

  // Edit a product - scroll to form area and populate with data
  const handleEditProduct = (index) => {
    setProductData({ ...productList[index] });
    setEditIndex(index);
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (productList.length === 0) {
      notify("Lỗi!", "Vui lòng thêm ít nhất một sản phẩm.", "error");
      return;
    }

    // Check if all products have category selected
    const missingCategory = productList.some((product) => !product.categoryId);
    if (missingCategory) {
      notify("Lỗi!", "Vui lòng chọn danh mục cho tất cả sản phẩm.", "error");
      return;
    }

    // Check if address is selected
    if (!selectedAddress) {
      notify("Lỗi!", "Vui lòng chọn địa chỉ giao hàng.", "error");
      return;
    }

    try {
      // Find the selected address object
      const selectedAddressObj = addresses.find(
        (addr) => addr.userAddressId.toString() === selectedAddress
      );

      if (!selectedAddressObj) {
        notify("Lỗi", "Không tìm thấy thông tin địa chỉ.", "error");
        return;
      }

      const requestedProducts = productList.map((product) => {
        // Get all tech specs, even empty ones
        const techSpecs =
          techSpecData?.data.map((spec) => {
            const key = `techSpec_${spec.techSpecId}`;
            return {
              techSpecId: spec.techSpecId,
              values: product[key] || "", // Use empty string if not provided
            };
          }) || [];

        return {
          quantity: product.quantity.toString(),
          techSpecs,
          categoryId: product.categoryId, // Include categoryId in request
        };
      });

      const orderData = {
        availableServiceId: personalizationService?.availableServiceId,
        userId: auth?.userId,
        requestedProducts,
        note: notes.trim(), // Add notes
        address: selectedAddressObj.address, // Send the address string instead of addressId
        isInstall: isInstall, // Add installation flag
        toDistrictId: selectedAddressObj.districtId,
        toWardCode: selectedAddressObj.wardCode,
      };

      await createPersonalOrder(orderData).unwrap();

      navigation.navigate("Success", {
        title: "Đặt hàng thành công",
        desc: "Đơn hàng của bạn đã được tạo thành công, vui lòng đợi xưởng mộc xác nhận đơn hàng.",
        buttonText: "Xem danh sách đơn hàng",
        path: "CustomerServiceOrders",
      });
    } catch (error) {
      notify(
        "Lỗi!",
        error.message || "Có lỗi xảy ra khi tạo đơn hàng.",
        "error"
      );
    }
  };

  // Show loading state
  if (isTechSpecLoading || isWoodworkerLoading || isServiceLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  // Show error state
  if (techSpecError || woodworkerError || serviceError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại sau.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <RootLayout>
      <ScrollView style={styles.container}>
        {!isServiceAvailable && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              Dịch vụ cá nhân hóa tạm thời không khả dụng cho xưởng mộc này.
            </Text>
          </View>
        )}

        {isServiceAvailable && (
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                Đặt thiết kế và gia công theo yêu cầu (cá nhân hóa)
              </Text>
            </View>

            <View>
              {/* Form area */}
              <AddPersonalizationProduct
                techSpecs={techSpecData?.data || []}
                productData={productData}
                setProductData={setProductData}
                handleAddProduct={handleAddProduct}
                isEditing={editIndex !== -1}
                onCancelEdit={() => {
                  initializeProductData();
                  setEditIndex(-1);
                }}
              />

              <View style={styles.spacing} />

              {/* Product list */}
              <PersonalizationProductList
                productList={productList}
                setProductList={setProductList}
                handleEditProduct={handleEditProduct}
                handleRemoveProduct={(index) => {
                  setProductList(productList.filter((_, i) => i !== index));
                  if (editIndex === index) {
                    initializeProductData();
                    setEditIndex(-1);
                  }
                  notify(
                    "Đã xóa",
                    "Sản phẩm đã được xóa khỏi danh sách",
                    "info"
                  );
                }}
                techSpecs={techSpecData?.data || []}
                notify={notify}
              />

              <View style={styles.cardContainer}>
                {/* Address Selection */}
                <View>
                  <AddressSelection
                    addresses={addresses}
                    isLoading={isLoadingAddresses}
                    error={addressesError}
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                  />
                </View>

                <View style={styles.divider} />

                {/* Notes Field */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Ghi chú đơn hàng</Text>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt cho đơn hàng này"
                    value={notes}
                    onChangeText={setNotes}
                    maxLength={500}
                  />
                </View>

                {/* Installation Checkbox */}
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setIsInstall(!isInstall)}
                  >
                    <View
                      style={[
                        styles.checkboxIcon,
                        isInstall && styles.checkboxIconChecked,
                      ]}
                    >
                      {isInstall && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>
                      Yêu cầu giao hàng + lắp đặt bởi xưởng
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <WoodworkerBox woodworkerProfile={woodworker} />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (productList.length === 0 || !selectedAddress) &&
                      styles.disabledButton,
                  ]}
                  onPress={handleSubmitOrder}
                  disabled={
                    productList.length === 0 || !selectedAddress || isCreating
                  }
                >
                  {isCreating ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  warningContainer: {
    backgroundColor: "#FFF3CD",
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  warningText: {
    color: "#856404",
    textAlign: "center",
  },
  headerContainer: {
    marginBottom: 20,
    padding: 10,
  },
  headerText: {
    color: appColorTheme.brown_2,
    fontSize: 20,
    fontWeight: "bold",
  },
  spacing: {
    height: 15,
  },
  cardContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    marginVertical: 10,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: appColorTheme.brown_2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxIconChecked: {
    backgroundColor: appColorTheme.brown_2,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: appColorTheme.brown_2,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 40,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
