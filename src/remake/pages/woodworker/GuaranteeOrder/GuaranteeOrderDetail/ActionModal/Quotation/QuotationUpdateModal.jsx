import { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  IconButton,
  Spinner,
  Center,
  Box,
  Alert,
  AlertIcon,
  useDisclosure,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiFileText, FiX, FiCheck } from "react-icons/fi";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import CheckboxList from "../../../../../../components/Utility/CheckboxList.jsx";
import {
  useGetByGuaranteeOrderMutation,
  useSaveQuotationDetailsForGuaranteeMutation,
} from "../../../../../../services/quotationApi";
import { appColorTheme } from "../../../../../../config/appconfig.js";

// Constants for validation
const MIN_PRICE = 0;
const MAX_PRICE = 50000000;
const PRICE_STEP = 1000;

export default function QuotationUpdateModal({ guaranteeOrderId, refetch }) {
  // Modal control
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const notify = useNotify();
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // API hooks
  const [getByGuaranteeOrder] = useGetByGuaranteeOrderMutation();
  const [saveQuotationDetails, { isLoading: isSaving }] =
    useSaveQuotationDetailsForGuaranteeMutation();

  // Confirmation items for CheckboxList
  const confirmationItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  // Fetch quotation data when modal opens
  useEffect(() => {
    if (isOpen && guaranteeOrderId) {
      fetchQuotationData();
    }
  }, [isOpen, guaranteeOrderId]);

  const fetchQuotationData = async () => {
    try {
      setIsLoading(true);
      const response = await getByGuaranteeOrder({
        guaranteeOrderId: parseInt(guaranteeOrderId),
      }).unwrap();

      if (response.data?.quotationDetails?.length > 0) {
        setQuotationDetails(
          response.data.quotationDetails.map((detail) => ({
            id: detail.quotId || Date.now() + Math.random(),
            costType: detail.costType || "",
            quantityRequired: detail.quantityRequired || "",
            costAmount: detail.costAmount || MIN_PRICE,
          }))
        );
      } else {
        // Initialize with empty array if no quotation details found
        setQuotationDetails([]);
      }
    } catch (error) {
      notify("Lỗi lấy dữ liệu", "Không thể lấy dữ liệu báo giá", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuotationDetail = () => {
    setQuotationDetails([
      ...quotationDetails,
      {
        id: Date.now(),
        costType: "",
        quantityRequired: "",
        costAmount: MIN_PRICE,
      },
    ]);
  };

  const handleDetailChange = (detailId, field, value) => {
    setQuotationDetails(
      quotationDetails.map((detail) =>
        detail.id === detailId
          ? {
              ...detail,
              [field]: field === "costAmount" ? Number(value) : value,
            }
          : detail
      )
    );
  };

  const handleRemoveDetail = (detailId) => {
    setQuotationDetails(
      quotationDetails.filter((detail) => detail.id !== detailId)
    );
  };

  const calculateTotalPrice = () => {
    return quotationDetails.reduce(
      (total, detail) => total + (detail.costAmount || 0),
      0
    );
  };

  const validateQuotationDetails = () => {
    const errors = [];
    const isValid = quotationDetails.every((detail, index) => {
      if (!detail.costType || detail.costType.trim() === "") {
        errors.push(`Dòng ${index + 1}: Loại chi phí không được để trống`);
        return false;
      }
      if (!detail.quantityRequired || detail.quantityRequired.trim() === "") {
        errors.push(`Dòng ${index + 1}: Số lượng không được để trống`);
        return false;
      }
      if (detail.costAmount < MIN_PRICE || detail.costAmount > MAX_PRICE) {
        errors.push(
          `Dòng ${
            index + 1
          }: Giá phải từ ${MIN_PRICE.toLocaleString()}đ đến ${MAX_PRICE.toLocaleString()}đ`
        );
        return false;
      }
      if (detail.costAmount % PRICE_STEP !== 0) {
        errors.push(
          `Dòng ${
            index + 1
          }: Giá phải là bội số của ${PRICE_STEP.toLocaleString()}đ`
        );
        return false;
      }
      return true;
    });

    return { isValid, errors };
  };

  const handleSave = async () => {
    const { isValid, errors } = validateQuotationDetails();

    if (!isValid) {
      notify("Dữ liệu không hợp lệ", errors.join("\n"), "error");
      return;
    }

    try {
      const payload = {
        guaranteeOrderId: parseInt(guaranteeOrderId),
        quotations: quotationDetails.map((detail) => ({
          costType: detail.costType,
          costAmount: parseInt(detail.costAmount),
          quantityRequired: detail.quantityRequired,
        })),
      };

      await saveQuotationDetails(payload).unwrap();
      notify("Lưu thành công", "Đã cập nhật chi tiết báo giá", "success");

      // Refresh data after saving
      if (refetch) {
        refetch();
      }

      onClose();
    } catch (error) {
      notify("Lỗi lưu dữ liệu", "Không thể lưu báo giá", "error");
    }
  };

  const handleClose = () => {
    setIsButtonDisabled(true);
    onClose();
  };

  return (
    <>
      <Button
        py={1}
        px={2}
        color={appColorTheme.blue_0}
        bg="none"
        border={`1px solid ${appColorTheme.blue_0}`}
        _hover={{ bg: appColorTheme.blue_0, color: "white" }}
        leftIcon={<FiFileText />}
        onClick={onOpen}
      >
        Cập nhật báo giá chi tiết sửa chữa
      </Button>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent maxWidth="800px">
          <ModalHeader>Cập nhật báo giá sửa chữa</ModalHeader>
          {!isSaving && <ModalCloseButton />}

          <ModalBody bgColor="app_grey.1" pb={6}>
            <Box>
              {isLoading ? (
                <Center p={8}>
                  <Spinner size="xl" />
                </Center>
              ) : (
                <>
                  <Box mb={4} display="flex" justifyContent="flex-end">
                    <Button
                      leftIcon={<FiPlus />}
                      colorScheme="teal"
                      onClick={handleAddQuotationDetail}
                    >
                      Thêm mục báo giá
                    </Button>
                  </Box>

                  <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>STT</Th>
                          <Th>Loại chi phí</Th>
                          <Th>Số lượng cần dùng</Th>
                          <Th>Chi phí</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {quotationDetails.length > 0 ? (
                          quotationDetails.map((detail, index) => (
                            <Tr key={detail.id}>
                              <Td>{index + 1}</Td>
                              <Td>
                                <Input
                                  size="sm"
                                  value={detail.costType}
                                  onChange={(e) =>
                                    handleDetailChange(
                                      detail.id,
                                      "costType",
                                      e.target.value
                                    )
                                  }
                                />
                              </Td>
                              <Td>
                                <Input
                                  size="sm"
                                  value={detail.quantityRequired}
                                  onChange={(e) =>
                                    handleDetailChange(
                                      detail.id,
                                      "quantityRequired",
                                      e.target.value
                                    )
                                  }
                                />
                              </Td>
                              <Td>
                                <Input
                                  size="sm"
                                  type="number"
                                  value={detail.costAmount}
                                  onChange={(e) =>
                                    handleDetailChange(
                                      detail.id,
                                      "costAmount",
                                      e.target.value
                                    )
                                  }
                                />
                              </Td>
                              <Td>
                                <IconButton
                                  icon={<FiTrash2 />}
                                  onClick={() => handleRemoveDetail(detail.id)}
                                  colorScheme="red"
                                  size="sm"
                                />
                              </Td>
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan={5} textAlign="center">
                              Chưa có báo giá. Vui lòng thêm mục báo giá mới.
                            </Td>
                          </Tr>
                        )}
                        {quotationDetails.length > 0 && (
                          <Tr>
                            <Td colSpan={3} textAlign="right" fontWeight="bold">
                              Tổng chi phí:
                            </Td>
                            <Td fontWeight="bold" colSpan={2}>
                              {calculateTotalPrice().toLocaleString()}đ
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </Box>

                  {quotationDetails.length === 0 && (
                    <Alert status="info" mt={4}>
                      <AlertIcon />
                      Chưa có thông tin báo giá. Vui lòng thêm chi tiết báo giá.
                    </Alert>
                  )}
                </>
              )}
            </Box>

            <Box mt={6}>
              <CheckboxList
                items={confirmationItems}
                setButtonDisabled={setIsButtonDisabled}
              />
            </Box>

            <HStack mt={10}>
              <Spacer />
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleSave}
                isLoading={isSaving}
                loadingText="Đang lưu"
                leftIcon={<FiCheck />}
                isDisabled={isButtonDisabled || quotationDetails.length === 0}
              >
                Lưu báo giá
              </Button>
              <Button onClick={handleClose} leftIcon={<FiX />}>
                Đóng
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
