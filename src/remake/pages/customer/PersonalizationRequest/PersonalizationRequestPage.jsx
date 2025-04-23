import {
  Box,
  Heading,
  SimpleGrid,
  Flex,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Divider,
  VStack,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth.js";
import { useParams, useNavigate, Navigate } from "react-router-dom";
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

export default function PersonalizationRequestPage() {
  const { id: woodworkerId } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
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
    personalizationService?.operatingStatus !== false;

  const isServicePackValid =
    woodworker?.servicePackEndDate &&
    Date.now() <= new Date(woodworker.servicePackEndDate).getTime() &&
    woodworker?.servicePack?.name === "Gold";

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

    if (editIndex === -1) {
      setProductList([...productList, productData]);
      notify("Thành công!", "Sản phẩm đã được thêm vào danh sách.", "success");
    } else {
      const updatedList = [...productList];
      updatedList[editIndex] = productData;
      setProductList(updatedList);
      notify("Thành công!", "Sản phẩm đã được cập nhật.", "success");

      // Scroll up to the form area for better UX after editing
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    initializeProductData();
  };

  // Edit a product - scroll to form area and populate with data
  const handleEditProduct = (index) => {
    setProductData({ ...productList[index] });
    setEditIndex(index);

    // Scroll to the form area for better UX
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

      navigate(
        "/success?title=Đặt hàng thành công&desc=Đơn hàng của bạn đã được tạo thành công, vui lòng đợi xưởng mộc xác nhận đơn hàng.&buttonText=Xem danh sách đơn hàng&path=/cus/service-order"
      );
    } catch (error) {
      notify(
        "Lỗi!",
        error.message || "Có lỗi xảy ra khi tạo đơn hàng.",
        "error"
      );
    }
  };

  // Redirect if user is not a customer
  if (auth?.role != "Customer") {
    return <Navigate to="/unauthorized" />;
  }

  // Show loading state
  if (isTechSpecLoading || isWoodworkerLoading || isServiceLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  // Show error state
  if (techSpecError || woodworkerError || serviceError) {
    return (
      <Box textAlign="center" p={10}>
        <Alert status="error">
          <AlertIcon />
          Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại sau.
        </Alert>
      </Box>
    );
  }

  return (
    <>
      {!isServiceAvailable && (
        <Box textAlign="center" p={10}>
          <Alert status="warning">
            <AlertIcon />
            Dịch vụ cá nhân hóa tạm thời không khả dụng cho xưởng mộc này.
          </Alert>
        </Box>
      )}

      {isServiceAvailable && (
        <>
          <Box mb={6}>
            <Heading
              color={appColorTheme.brown_2}
              fontSize="2xl"
              fontFamily="Montserrat"
            >
              Đặt thiết kế và gia công theo yêu cầu (cá nhân hóa)
            </Heading>
          </Box>

          <Box>
            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5}>
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

              <Box>
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

                <Box bg="white" p={5} borderRadius="10px" mt={5}>
                  <VStack align="stretch" spacing={4}>
                    {/* Address Selection */}
                    <Box>
                      <AddressSelection
                        addresses={addresses}
                        isLoading={isLoadingAddresses}
                        error={addressesError}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                      />
                    </Box>

                    <Divider />

                    {/* Notes Field */}
                    <FormControl>
                      <FormLabel fontWeight="medium">
                        Ghi chú đơn hàng
                      </FormLabel>
                      <Textarea
                        placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt cho đơn hàng này"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        size="md"
                        resize="vertical"
                        maxLength={500}
                      />
                    </FormControl>

                    {/* Installation Checkbox */}
                    <Box py={2} my={2}>
                      <Checkbox
                        isChecked={isInstall}
                        onChange={(e) => setIsInstall(e.target.checked)}
                        size="md"
                      >
                        <Text fontWeight="medium">
                          Yêu cầu giao hàng + lắp đặt bởi xưởng
                        </Text>
                      </Checkbox>
                    </Box>
                  </VStack>
                </Box>

                <WoodworkerBox woodworkerProfile={woodworker} />

                <Flex justifyContent="center" mt={6}>
                  <Button
                    _hover={{ backgroundColor: "app_brown.1", color: "white" }}
                    px="30px"
                    py="20px"
                    bgColor={appColorTheme.brown_2}
                    color="white"
                    borderRadius="40px"
                    onClick={handleSubmitOrder}
                    isLoading={isCreating}
                    isDisabled={productList.length === 0 || !selectedAddress}
                  >
                    Gửi yêu cầu
                  </Button>
                </Flex>
              </Box>
            </SimpleGrid>
          </Box>
        </>
      )}
    </>
  );
}
