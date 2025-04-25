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
import { useAcceptFreeGuaranteeOrderMutation } from "../../../../../../services/guaranteeOrderApi";
import { createAndUpdateShipmentForGuaranteeGetProductFromCustomer } from "../../../../../../utils/shippingUtils.js";

export default function GuaranteeAcceptModal({
  refetch,
  order,
  guaranteeOrderId,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [acceptFreeGuaranteeOrder, { isLoading: isAccepting }] =
    useAcceptFreeGuaranteeOrderMutation();
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

  // Process shipment creation for the guarantee order
  const processShipment = async () => {
    try {
      setProcessingShipment(true);

      const product = order?.serviceOrderDetail?.requestedProduct.find(
        (item) =>
          item.requestedProductId == order?.requestedProduct?.requestedProductId
      );

      // Use the utility function
      const result =
        await createAndUpdateShipmentForGuaranteeGetProductFromCustomer({
          order,
          product,
          shipmentData,
          guaranteeOrderId,
          createShipment,
          updateShipmentOrderCode,
          notify,
        });

      return result.success;
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
      const shipmentCreated = await processShipment();
      if (!shipmentCreated) return;

      await acceptFreeGuaranteeOrder(guaranteeOrderId).unwrap();

      notify(
        "Chấp nhận bảo hành",
        "Yêu cầu bảo hành đã được chấp nhận",
        "success"
      );

      onClose();
      refetch && refetch();
    } catch (error) {
      notify(
        "Lỗi",
        error.data?.message || "Không thể chấp nhận yêu cầu bảo hành",
        "error"
      );
    }
  };

  const handleClose = () => {
    setIsButtonDisabled(true);
    onClose();
  };

  const isProcessing =
    isAccepting ||
    loadingShipment ||
    creatingShipment ||
    updatingShipment ||
    processingShipment;

  const confirmationItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  return (
    <>
      <Button
        py={1}
        px={2}
        colorScheme="green"
        variant={"outline"}
        leftIcon={<FiCheckCircle />}
        onClick={onOpen}
      >
        Chấp nhận bảo hành miễn phí
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={isProcessing ? null : handleClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận chấp nhận bảo hành miễn phí</ModalHeader>
          {!isProcessing && <ModalCloseButton />}
          <ModalBody pb={6}>
            {isProcessing ? (
              <Center py={8} flexDirection="column">
                <Spinner size="xl" color={appColorTheme.brown_2} mb={4} />
                <Text>
                  {processingShipment
                    ? "Đang tạo vận đơn nhận hàng..."
                    : "Đang xử lý..."}
                </Text>
              </Center>
            ) : (
              <Box>
                <Text mb={4}>
                  Bạn đang xác nhận chấp nhận bảo hành miễn phí cho sản phẩm
                  này.
                </Text>

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
                Xác nhận
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
