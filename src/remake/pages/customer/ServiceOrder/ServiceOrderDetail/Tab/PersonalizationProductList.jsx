import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Badge,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { formatPrice } from "../../../../../utils/utils.js";
import ImageListSelector from "../../../../../components/Utility/ImageListSelector.jsx";
import { useGetByServiceOrderMutation } from "../../../../../services/quotationApi";

const TechSpecItem = ({ name, value, optionType }) => {
  // For file type specs, use ImageListSelector
  if (optionType === "file" && value) {
    return (
      <Box mb={4}>
        <Text fontWeight="bold" mb={2}>
          {name}:
        </Text>
        <ImageListSelector imgUrls={value} imgH={150} />
      </Box>
    );
  }

  // For other types, show as normal text
  return (
    <HStack justify="space-between" w="100%" mb={2}>
      <Text fontWeight="bold">{name}:</Text>
      <Text>{value || "Không có"}</Text>
    </HStack>
  );
};

export default function PersonalizationProductList({
  products = [],
  totalAmount = 0,
  orderId,
}) {
  const [quotationData, setQuotationData] = useState([]);
  const [isLoadingQuotations, setIsLoadingQuotations] = useState(false);
  const [getByServiceOrder] = useGetByServiceOrderMutation();

  // Fetch quotation data on component mount
  useEffect(() => {
    const fetchQuotations = async () => {
      if (!orderId) return;

      try {
        setIsLoadingQuotations(true);
        const response = await getByServiceOrder({
          serviceOrderId: parseInt(orderId),
        }).unwrap();
        setQuotationData(response.data || []);
      } catch (error) {
        console.error("Failed to fetch quotations:", error);
      } finally {
        setIsLoadingQuotations(false);
      }
    };

    fetchQuotations();
  }, [orderId, getByServiceOrder]);

  // Helper function to calculate total price for a product's quotation details
  const calculateTotalPrice = (details) => {
    return (
      details?.reduce((total, detail) => total + (detail.costAmount || 0), 0) ||
      0
    );
  };

  // Helper function to find quotation details for a specific product
  const findQuotationDetails = (productId) => {
    const productQuotation = quotationData.find(
      (item) => item.requestedProduct.requestedProductId === productId
    );
    return productQuotation?.quotationDetails || [];
  };

  return (
    <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
      <Heading fontWeight="bold" fontSize="20px" mb={6}>
        Thông tin sản phẩm
      </Heading>

      <Accordion allowMultiple>
        {products.map((product) => {
          const personalDetail = product.personalProductDetail;
          const techSpecList = personalDetail?.techSpecList || [];
          const quotationDetails = findQuotationDetails(
            product.requestedProductId
          );

          return (
            <AccordionItem
              key={product.requestedProductId}
              border="1px solid #ddd"
              bg="white"
              borderRadius="10px"
              mb={4}
            >
              <AccordionButton
                _expanded={{ bg: appColorTheme.brown_0 }}
                borderRadius="10px"
              >
                <Box flex="1" textAlign="left">
                  <HStack>
                    <Box>
                      <Text fontWeight="bold">
                        #{product.requestedProductId} {". "}
                        {product.category?.categoryName} x{" "}
                        {`${product.quantity}`}
                      </Text>
                      <Badge colorScheme="purple">
                        {product.category?.categoryName || "Không phân loại"}
                      </Badge>
                    </Box>
                    {product.totalAmount > 0 && (
                      <Text
                        fontSize="xl"
                        color={appColorTheme.brown_2}
                        fontWeight="bold"
                        marginLeft="auto"
                      >
                        {formatPrice(product.totalAmount)}
                      </Text>
                    )}
                  </HStack>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4}>
                <Stack spacing={4}>
                  {/* Quotation Details */}
                  <Box mt={4}>
                    <Text
                      color={appColorTheme.brown_2}
                      fontWeight="bold"
                      fontSize="lg"
                      my={3}
                    >
                      Chi tiết báo giá:
                    </Text>

                    {isLoadingQuotations ? (
                      <Center p={4}>
                        <Spinner size="md" />
                      </Center>
                    ) : quotationDetails.length > 0 ? (
                      <Box overflowX="auto">
                        <Table variant="simple" size="lg">
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
                            <Tr>
                              <Td
                                colSpan={3}
                                textAlign="right"
                                fontWeight="bold"
                              >
                                Tổng chi phí:
                              </Td>
                              <Td fontWeight="bold">
                                {formatPrice(
                                  calculateTotalPrice(quotationDetails)
                                )}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                    ) : (
                      <Text color="gray.500">
                        Chưa có báo giá cho sản phẩm này
                      </Text>
                    )}
                  </Box>

                  {/* Finish Images if available */}
                  {product?.finishImgUrls && (
                    <Box mt={4}>
                      <Text
                        color={appColorTheme.brown_2}
                        fontWeight="bold"
                        fontSize="lg"
                        my={3}
                      >
                        Ảnh hoàn thành sản phẩm:
                      </Text>
                      <ImageListSelector
                        imgUrls={product.finishImgUrls}
                        imgH={200}
                      />
                    </Box>
                  )}

                  {/* Design Images if available */}
                  {personalDetail?.designUrls && (
                    <Box mt={4}>
                      <Text
                        color={appColorTheme.brown_2}
                        fontWeight="bold"
                        fontSize="lg"
                        my={3}
                      >
                        Thiết kế:
                      </Text>
                      <ImageListSelector
                        imgUrls={personalDetail.designUrls}
                        imgH={200}
                      />
                    </Box>
                  )}

                  {/* Technical Specifications */}
                  <Box>
                    <Text
                      color={appColorTheme.brown_2}
                      fontWeight="bold"
                      fontSize="lg"
                      my={3}
                    >
                      Thông số kỹ thuật:
                    </Text>
                    <Stack spacing={2} divider={<Divider />}>
                      {techSpecList.map((spec, index) => (
                        <TechSpecItem
                          key={index}
                          name={spec.name}
                          value={spec.value}
                          optionType={spec.optionType}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>

      {totalAmount > 0 && (
        <Flex alignItems="center" my={4} p={5} bgColor={appColorTheme.grey_0}>
          <Text mr={4} fontSize="20px">
            Thành tiền:
          </Text>
          <Text
            ml="auto"
            fontSize="30px"
            color={appColorTheme.brown_2}
            fontWeight="bold"
          >
            {formatPrice(totalAmount)}
          </Text>
        </Flex>
      )}
    </Box>
  );
}
