import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Divider,
  useDisclosure,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  useAcceptGuaranteeQuotationsMutation,
  useGetByGuaranteeOrderMutation,
} from "../../../../../../services/quotationApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { FiCheck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { formatPrice } from "../../../../../../utils/utils";
import { appColorTheme } from "../../../../../../config/appconfig";

export default function QuotationConfirmModal({
  order,
  buttonText = "Xác nhận báo giá",
  refetch,
  refetchDeposit,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notify = useNotify();
  const [acceptQuotation, { isLoading: isAccepting }] =
    useAcceptGuaranteeQuotationsMutation();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  // For fetching quotation data
  const [getByGuaranteeOrder, { isLoading: isLoadingQuotation }] =
    useGetByGuaranteeOrderMutation();
  const [quotationData, setQuotationData] = useState(null);
  const [quotationError, setQuotationError] = useState(null);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  // Fetch quotation data when modal opens
  useEffect(() => {
    if (isOpen && order?.guaranteeOrderId) {
      fetchQuotationData();
    }
  }, [isOpen, order?.guaranteeOrderId]);

  const fetchQuotationData = async () => {
    if (!order?.guaranteeOrderId) return;

    try {
      const response = await getByGuaranteeOrder({
        guaranteeOrderId: parseInt(order.guaranteeOrderId),
      }).unwrap();
      setQuotationData(response.data || null);
      setQuotationError(null);
    } catch (error) {
      console.error("Error fetching quotation:", error);
      setQuotationError(error);
      setQuotationData(null);
    }
  };

  // Calculate total quotation amount
  const calculateTotalPrice = (quotationDetails = []) => {
    return (
      quotationDetails?.reduce(
        (total, detail) => total + (detail.costAmount || 0),
        0
      ) || 0
    );
  };

  const quotationDetails = quotationData?.quotationDetails || [];
  const totalQuotationAmount = calculateTotalPrice(quotationDetails);

  const handleSubmit = async () => {
    try {
      await acceptQuotation({
        guaranteeOrderId: parseInt(order.guaranteeOrderId),
      }).unwrap();

      notify("Xác nhận thành công", "Báo giá đã được chấp nhận", "success");

      onClose();
      refetch && refetch(); // Refresh data
      refetchDeposit();
    } catch (err) {
      notify(
        "Xác nhận thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  const handleClose = () => {
    setIsCheckboxDisabled(true);
    onClose();
  };

  return (
    <>
      <Button leftIcon={<FiCheckCircle />} colorScheme="green" onClick={onOpen}>
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={isAccepting ? null : handleClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{buttonText}</ModalHeader>
          {!isAccepting && <ModalCloseButton />}
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Text fontSize="lg" fontWeight="bold">
                Chi tiết báo giá sửa chữa
              </Text>

              <Box p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                {isLoadingQuotation ? (
                  <Center py={8}>
                    <Spinner size="md" color={appColorTheme.brown_2} />
                  </Center>
                ) : quotationError ? (
                  <Center py={8}>
                    <Text color="red.500">
                      Đã có lỗi xảy ra khi tải thông tin báo giá
                    </Text>
                  </Center>
                ) : quotationDetails.length === 0 ? (
                  <Center py={8}>
                    <Text color="gray.500">Chưa có thông tin báo giá</Text>
                  </Center>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>STT</Th>
                          <Th>Loại chi phí</Th>
                          <Th>Số lượng cần dùng</Th>
                          <Th>Chi phí</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {quotationDetails.map((detail, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{detail.costType}</Td>
                            <Td>{detail.quantityRequired}</Td>
                            <Td>{formatPrice(detail.costAmount)}</Td>
                          </Tr>
                        ))}
                        {order?.shipFee > 0 && (
                          <Tr>
                            <Td colSpan={3} textAlign="right" fontWeight="bold">
                              Phí vận chuyển:
                            </Td>
                            <Td>{formatPrice(order?.shipFee)}</Td>
                          </Tr>
                        )}
                        <Tr>
                          <Td colSpan={3} textAlign="right" fontWeight="bold">
                            Tổng chi phí:
                          </Td>
                          <Td fontWeight="bold">
                            {formatPrice(
                              totalQuotationAmount + (order?.shipFee || 0)
                            )}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </Box>

              <Divider my={2} />
              <CheckboxList
                items={checkboxItems}
                setButtonDisabled={setIsCheckboxDisabled}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={handleClose}
              leftIcon={<FiXCircle />}
              isDisabled={isAccepting}
            >
              Đóng
            </Button>
            <Button
              colorScheme="green"
              onClick={handleSubmit}
              isLoading={isAccepting}
              isDisabled={isCheckboxDisabled || quotationDetails.length === 0}
              leftIcon={<FiCheck />}
              loadingText="Đang xử lý"
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
