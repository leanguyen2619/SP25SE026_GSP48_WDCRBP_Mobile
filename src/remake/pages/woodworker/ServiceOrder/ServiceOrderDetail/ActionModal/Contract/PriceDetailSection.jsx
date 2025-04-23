import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  IconButton,
  HStack,
  Text,
  ButtonGroup,
  Heading,
  Alert,
  AlertIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiEdit, FiSave, FiXCircle } from "react-icons/fi";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import {
  useGetByServiceOrderMutation,
  useSaveQuotationDetailsMutation,
} from "../../../../../../services/quotationApi";

const MIN_PRICE = 1000;
const MAX_PRICE = 50000000;
const PRICE_STEP = 1000;

export default function PriceDetailSection({ orderId, onQuotationComplete }) {
  const notify = useNotify();
  const [getByServiceOrder, { isLoading: isLoadingQuotations }] =
    useGetByServiceOrderMutation();
  const [saveQuotationDetails, { isLoading: isSaving }] =
    useSaveQuotationDetailsMutation();

  const [quotationData, setQuotationData] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingDetails, setEditingDetails] = useState({});
  const [isAllProductsQuoted, setIsAllProductsQuoted] = useState(false);

  // Fetch quotation data
  const fetchQuotations = async () => {
    try {
      const response = await getByServiceOrder({
        serviceOrderId: parseInt(orderId),
      }).unwrap();
      setQuotationData(response.data || []);

      // Check if all products have quotations
      const allQuoted = (response.data || []).every(
        (item) => item.quotationDetails && item.quotationDetails.length > 0
      );
      setIsAllProductsQuoted(allQuoted);

      // Notify parent component about quotation status
      onQuotationComplete && onQuotationComplete(allQuoted);
    } catch (error) {
      notify("Lỗi lấy dữ liệu", "Không thể lấy dữ liệu báo giá", "error");
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (orderId) {
      fetchQuotations();
    }
  }, [orderId]);

  const validatePriceDetails = (details) => {
    const errors = [];
    const isValid = details.every((detail, index) => {
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

  const handleStartEdit = (productId, existingQuotations = []) => {
    // Map existing quotations to our editing format or initialize with empty array
    const details =
      existingQuotations.length > 0
        ? existingQuotations.map((q) => ({
            id: q.quotationDetailId || Date.now() + Math.random(),
            costType: q.costType || "",
            quantityRequired: q.quantityRequired || "",
            costAmount: q.costAmount || MIN_PRICE,
          }))
        : [];

    setEditingProductId(productId);
    setEditingDetails(details);
  };

  const handleSave = async (productId) => {
    const { isValid, errors } = validatePriceDetails(editingDetails);

    if (!isValid) {
      notify("Dữ liệu không hợp lệ", errors.join("\n"), "error");
      return;
    }

    try {
      const payload = {
        requestedProductId: productId,
        quotations: editingDetails.map((detail) => ({
          costType: detail.costType,
          costAmount: parseInt(detail.costAmount),
          quantityRequired: detail.quantityRequired,
        })),
      };

      await saveQuotationDetails(payload).unwrap();
      setEditingProductId(null);
      notify("Lưu thành công", "Đã cập nhật chi tiết giá", "success");
      fetchQuotations();
    } catch (error) {
      notify("Lỗi lưu dữ liệu", "Không thể lưu báo giá", "error");
    }
  };

  const handleCancel = () => {
    setEditingProductId(null);
    setEditingDetails([]);
  };

  const handleAddPriceDetail = () => {
    setEditingDetails([
      ...editingDetails,
      {
        id: Date.now(),
        costType: "",
        quantityRequired: "",
        costAmount: MIN_PRICE,
      },
    ]);
  };

  const handlePriceDetailChange = (detailId, field, value) => {
    setEditingDetails(
      editingDetails.map((detail) =>
        detail.id === detailId
          ? {
              ...detail,
              [field]: field === "costAmount" ? Number(value) : value,
            }
          : detail
      )
    );
  };

  const handleRemovePriceDetail = (detailId) => {
    setEditingDetails(
      editingDetails.filter((detail) => detail.id !== detailId)
    );
  };

  const calculateTotalPrice = (details) => {
    return (
      details?.reduce((total, detail) => total + (detail.costAmount || 0), 0) ||
      0
    );
  };

  if (isLoadingQuotations) {
    return (
      <Center p={8}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!quotationData || quotationData.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        Không tìm thấy thông tin sản phẩm cho báo giá.
      </Alert>
    );
  }

  return (
    <Box p={5} bgColor="white" mb={6}>
      <Heading size="md" mb={4}>
        Báo giá sản phẩm
      </Heading>

      <Accordion allowMultiple defaultIndex={[0]}>
        {quotationData.map((productData, productIndex) => {
          const product = productData.requestedProduct;
          const quotations = productData.quotationDetails || [];
          const hasQuotations = quotations.length > 0;
          const isEditing = editingProductId === product.requestedProductId;
          const displayDetails = isEditing ? editingDetails : quotations;

          return (
            <AccordionItem key={product.requestedProductId}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    {product.category}{" "}
                    {hasQuotations && !isEditing && (
                      <Text as="span" ml={2} color="green.500">
                        - Đã báo giá
                      </Text>
                    )}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <HStack justify="space-between" mb={4}>
                  <Text>Số lượng: {product.quantity}</Text>
                  <HStack>
                    {!isEditing ? (
                      <IconButton
                        icon={<FiEdit />}
                        onClick={() =>
                          handleStartEdit(
                            product.requestedProductId,
                            quotations
                          )
                        }
                        colorScheme="teal"
                        size="sm"
                        isDisabled={
                          isEditing &&
                          editingProductId !== product.requestedProductId
                        }
                      />
                    ) : (
                      editingProductId === product.requestedProductId && (
                        <IconButton
                          icon={<FiPlus />}
                          onClick={handleAddPriceDetail}
                          colorScheme="teal"
                          size="sm"
                        />
                      )
                    )}
                  </HStack>
                </HStack>

                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Số thứ tự</Th>
                      <Th>Loại chi phí</Th>
                      <Th>Số lượng cần dùng</Th>
                      <Th>Chi phí</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {displayDetails?.length > 0 ? (
                      displayDetails.map((detail, index) => (
                        <Tr key={detail.id || index}>
                          <Td>{index + 1}</Td>
                          <Td>
                            {isEditing &&
                            editingProductId === product.requestedProductId ? (
                              <Input
                                size="sm"
                                value={detail.costType}
                                onChange={(e) =>
                                  handlePriceDetailChange(
                                    detail.id,
                                    "costType",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              detail.costType
                            )}
                          </Td>
                          <Td>
                            {isEditing &&
                            editingProductId === product.requestedProductId ? (
                              <Input
                                size="sm"
                                value={detail.quantityRequired}
                                onChange={(e) =>
                                  handlePriceDetailChange(
                                    detail.id,
                                    "quantityRequired",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              detail.quantityRequired
                            )}
                          </Td>
                          <Td>
                            {isEditing &&
                            editingProductId === product.requestedProductId ? (
                              <Input
                                size="sm"
                                type="number"
                                value={detail.costAmount}
                                onChange={(e) =>
                                  handlePriceDetailChange(
                                    detail.id,
                                    "costAmount",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              detail.costAmount.toLocaleString() + "đ"
                            )}
                          </Td>
                          <Td>
                            {isEditing &&
                              editingProductId ===
                                product.requestedProductId && (
                                <IconButton
                                  icon={<FiTrash2 />}
                                  onClick={() =>
                                    handleRemovePriceDetail(detail.id)
                                  }
                                  colorScheme="red"
                                  size="sm"
                                />
                              )}
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={5} textAlign="center">
                          {!isEditing
                            ? "Chưa có báo giá"
                            : "Thêm mục báo giá mới"}
                        </Td>
                      </Tr>
                    )}
                    {displayDetails?.length > 0 && (
                      <Tr>
                        <Td colSpan={3} textAlign="right" fontWeight="bold">
                          Tổng chi phí:
                        </Td>
                        <Td fontWeight="bold">
                          {calculateTotalPrice(displayDetails).toLocaleString()}
                          đ
                        </Td>
                        <Td></Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>

                {isEditing &&
                  editingProductId === product.requestedProductId && (
                    <ButtonGroup
                      spacing={2}
                      mt={4}
                      width="100%"
                      justifyContent="flex-end"
                    >
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        isDisabled={isSaving}
                        leftIcon={<FiXCircle />}
                      >
                        Đóng
                      </Button>
                      <Button
                        onClick={() => handleSave(product.requestedProductId)}
                        colorScheme="blue"
                        leftIcon={<FiSave />}
                        isLoading={isSaving}
                      >
                        Lưu báo giá
                      </Button>
                    </ButtonGroup>
                  )}
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>

      {isAllProductsQuoted && (
        <Alert status="success" mt={4}>
          <AlertIcon />
          Tất cả sản phẩm đã được báo giá. Bạn có thể tiếp tục tạo hợp đồng.
        </Alert>
      )}
    </Box>
  );
}
