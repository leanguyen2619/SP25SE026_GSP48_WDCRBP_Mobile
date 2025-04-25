import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  Text,
  Center,
  Spinner,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import CheckboxList from "../../../../../../components/Utility/CheckboxList.jsx";
import {
  useGetShipmentsByGuaranteeOrderIdQuery,
  useUpdateGuaranteeOrderShipmentOrderCodeMutation,
} from "../../../../../../services/shipmentApi";
import { useCreateShipmentForServiceOrderMutation } from "../../../../../../services/ghnApi";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import { useFinishConfirmationMutation } from "../../../../../../services/guaranteeOrderApi";

export default function FinishUpdateModal({
  refetch,
  order,
  guaranteeOrderId,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [finishConfirmation, { isLoading: isFinishing }] =
    useFinishConfirmationMutation();
  const { data: shipmentData, isLoading: loadingShipment } =
    useGetShipmentsByGuaranteeOrderIdQuery(guaranteeOrderId, { skip: !isOpen });
  const [createShipment, { isLoading: creatingShipment }] =
    useCreateShipmentForServiceOrderMutation();
  const [updateShipmentOrderCode, { isLoading: updatingShipment }] =
    useUpdateGuaranteeOrderShipmentOrderCodeMutation();
  const notify = useNotify();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Shipment processing state
  const [processingShipment, setProcessingShipment] = useState(false);

  // Helper function to extract dimensions
  const extractDimensions = (product) => {
    try {
      if (product.designIdeaVariantDetail?.designIdeaVariantConfig) {
        const config = product.designIdeaVariantDetail.designIdeaVariantConfig;
        const dimensionStr = config[0]?.designVariantValues[0]?.value;

        if (dimensionStr) {
          const dimensions = dimensionStr
            .split("x")
            .map((dim) => parseFloat(dim.trim()));

          if (dimensions.length === 3) {
            return {
              length: dimensions[0] || 20,
              width: dimensions[1] || 20,
              height: dimensions[2] || 20,
            };
          }
        }
      } else if (product.personalProductDetail) {
        const techSpecs = product.personalProductDetail.techSpecList || [];
        return {
          length:
            parseFloat(
              techSpecs.find((item) => item.name === "Chiều dài")?.value
            ) || 20,
          width:
            parseFloat(
              techSpecs.find((item) => item.name === "Chiều rộng")?.value
            ) || 20,
          height:
            parseFloat(
              techSpecs.find((item) => item.name === "Chiều cao")?.value
            ) || 20,
        };
      }
      return { length: 20, width: 20, height: 20 };
    } catch (error) {
      console.error("Error extracting dimensions:", error);
      return { length: 20, width: 20, height: 20 };
    }
  };

  // Process shipment creation for the guarantee order
  const processShipment = async () => {
    if (order?.install) {
      return true; // No need to create a shipment for install orders
    }

    try {
      setProcessingShipment(true);

      if (!shipmentData?.data || shipmentData.data.length < 2) {
        notify("Lỗi", "Không tìm thấy thông tin vận chuyển", "error");
        return false;
      }

      // Using shipment[1] as specified
      const shipment = shipmentData.data[1];
      if (!shipment) {
        notify("Lỗi", "Không tìm thấy thông tin vận chuyển trả hàng", "error");
        return false;
      }

      const product = order?.serviceOrderDetail?.requestedProduct.find(
        (item) =>
          item.requestedProductId == order?.requestedProduct?.requestedProductId
      );

      // Prepare items for GHN API
      const dimensions = extractDimensions(product);
      const items = [
        {
          name:
            product.designIdeaVariantDetail?.name ||
            product.category?.categoryName ||
            "Sản phẩm sửa chữa",
          quantity: 1,
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.height,
          weight: 0,
        },
      ];

      // Create GHN shipment request
      const requestData = {
        payment_type_id: 1,
        required_note: "WAIT",
        from_name: order?.woodworkerUser?.username || "Xưởng mộc",
        from_phone: order?.woodworkerUser?.phone || "0123456789",
        from_address: shipment.fromAddress,
        from_ward_name: shipment.fromAddress?.split(",")[1]?.trim() || "N/A",
        from_district_name:
          shipment.fromAddress?.split(",")[2]?.trim() || "N/A",
        from_province_name:
          shipment.fromAddress?.split(",")[3]?.trim() || "N/A",
        to_phone: order?.user?.phone || "0123456789",
        to_name: order?.user?.username || "Khách hàng",
        to_address: shipment.toAddress,
        to_ward_code: shipment.toWardCode,
        to_district_id: shipment.toDistrictId,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        service_type_id: shipment.ghnServiceTypeId || 5,
        items: items,
      };

      // Call GHN API to create shipment
      const response = await createShipment({
        serviceOrderId: guaranteeOrderId,
        data: requestData,
      }).unwrap();

      // Get order code from response
      const orderCode = response.data.data.order_code;

      // Update shipment with order code
      await updateShipmentOrderCode({
        guaranteeOrderId: guaranteeOrderId,
        orderCode: orderCode,
        type: "Giao",
      }).unwrap();

      notify(
        "Thành công",
        "Đã tạo vận đơn trả hàng thành công với mã: " + orderCode,
        "success"
      );

      return true;
    } catch (error) {
      notify(
        "Lỗi vận chuyển",
        error.data?.message || error.message || "Không thể tạo vận đơn",
        "error"
      );
      return false;
    } finally {
      setProcessingShipment(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!order?.install) {
        const shipmentCreated = await processShipment();
        if (!shipmentCreated) return;
      }

      await finishConfirmation({
        guaranteeOrderId: parseInt(guaranteeOrderId),
      }).unwrap();

      notify(
        "Xác nhận hoàn thành",
        "Đơn hàng đã được đánh dấu là hoàn thành",
        "success"
      );

      onClose();
      refetch && refetch();
    } catch (error) {
      notify(
        "Lỗi",
        error.data?.message || "Không thể hoàn thành đơn hàng",
        "error"
      );
    }
  };

  const handleClose = () => {
    setIsButtonDisabled(true);
    onClose();
  };

  const isProcessing =
    isFinishing ||
    loadingShipment ||
    creatingShipment ||
    updatingShipment ||
    processingShipment;

  const confirmationItems = [
    {
      description:
        "Tôi đã hoàn thành sửa chữa sản phẩm và xác nhận giao lại cho khách hàng",
      isOptional: false,
    },
  ];

  return (
    <>
      <Button
        py={1}
        px={2}
        color={appColorTheme.blue_0}
        bg="none"
        border={`1px solid ${appColorTheme.blue_0}`}
        _hover={{ bg: appColorTheme.blue_0, color: "white" }}
        leftIcon={<FiCheckCircle />}
        onClick={onOpen}
      >
        Xác nhận hoàn thành và trả hàng
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={isProcessing ? null : handleClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận hoàn thành sửa chữa</ModalHeader>
          {!isProcessing && <ModalCloseButton />}

          <ModalBody pb={6}>
            {isProcessing ? (
              <Center py={8} flexDirection="column">
                <Spinner size="xl" color={appColorTheme.brown_2} mb={4} />
                <Text>
                  {processingShipment
                    ? "Đang tạo vận đơn trả hàng..."
                    : "Đang xử lý..."}
                </Text>
              </Center>
            ) : (
              <Box>
                <Text mb={4}>
                  Bạn đang xác nhận sản phẩm đã được sửa chữa hoàn thành và sẵn
                  sàng trả lại cho khách hàng.
                </Text>

                {!order?.install && (
                  <Text mb={4}>
                    Hệ thống sẽ tạo vận đơn GHN để giao sản phẩm về cho khách
                    hàng.
                  </Text>
                )}

                <Box mt={6}>
                  <CheckboxList
                    items={confirmationItems}
                    setButtonDisabled={setIsButtonDisabled}
                  />
                </Box>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <HStack width="100%">
              <Spacer />
              <Button
                colorScheme="green"
                onClick={handleSubmit}
                isLoading={isProcessing}
                isDisabled={isButtonDisabled}
                leftIcon={<FiCheckCircle />}
                loadingText={
                  processingShipment ? "Đang tạo vận đơn..." : "Đang xử lý..."
                }
              >
                Xác nhận hoàn thành
              </Button>
              <Button
                onClick={handleClose}
                leftIcon={<FiXCircle />}
                isDisabled={isProcessing}
              >
                Đóng
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
