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
  Image,
  Link as ChakraLink,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { formatPrice } from "../../../../../utils/utils.js";
import ImageListSelector from "../../../../../components/Utility/ImageListSelector.jsx";

const AttributeItem = ({ name, value }) => (
  <HStack justify="space-between" w="100%">
    <Text fontWeight="bold">{name}:</Text>
    <Text>{value}</Text>
  </HStack>
);

export default function SaleProductList({
  products = [],
  totalAmount = 0,
  shipFee,
}) {
  return (
    <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
      <Heading fontWeight="bold" fontSize="20px" mb={6}>
        Thông tin sản phẩm
      </Heading>

      <Accordion allowMultiple>
        {products.map((product) => {
          const saleProduct = product.product;

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
                    <Image
                      src={saleProduct?.mediaUrls?.split(";")[0] || ""}
                      alt={saleProduct?.productName}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <Box>
                      <ChakraLink
                        target="_blank"
                        href={`/product/${saleProduct?.productId}`}
                      >
                        <Text
                          _hover={{
                            textDecoration: "underline",
                          }}
                          fontWeight="bold"
                        >
                          #{product.requestedProductId}
                          {". "}
                          {saleProduct?.productName ||
                            "Sản phẩm không xác định"}{" "}
                          x {product?.quantity}
                        </Text>
                      </ChakraLink>
                      <Badge colorScheme="purple">
                        {product?.category?.categoryName ||
                          saleProduct?.categoryName ||
                          "Không phân loại"}
                      </Badge>
                    </Box>
                    <Text
                      fontSize="xl"
                      color={appColorTheme.brown_2}
                      fontWeight="bold"
                      marginLeft="auto"
                    >
                      {formatPrice(product.totalAmount)}
                    </Text>
                  </HStack>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4}>
                <Stack spacing={6}>
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

                  {/* Product images */}
                  <Box>
                    <Text
                      color={appColorTheme.brown_2}
                      fontWeight="bold"
                      fontSize="lg"
                      my={3}
                    >
                      Hình ảnh sản phẩm:
                    </Text>
                    <ImageListSelector
                      imgUrls={saleProduct?.mediaUrls}
                      imgH={200}
                    />
                  </Box>

                  {/* Description */}
                  {saleProduct?.description && (
                    <Box>
                      <Text
                        color={appColorTheme.brown_2}
                        fontWeight="bold"
                        fontSize="lg"
                        my={3}
                      >
                        Mô tả:
                      </Text>
                      <Text whiteSpace="pre-wrap">
                        {saleProduct.description}
                      </Text>
                    </Box>
                  )}

                  {/* Product Attributes */}
                  <Box>
                    <Text
                      color={appColorTheme.brown_2}
                      fontWeight="bold"
                      fontSize="lg"
                      my={3}
                    >
                      Thông số kỹ thuật:
                    </Text>
                    <Stack spacing={3} divider={<Divider />}>
                      <AttributeItem
                        name="Kích thước"
                        value={`${saleProduct?.length} x ${saleProduct?.width} x ${saleProduct?.height} cm`}
                      />
                      <AttributeItem
                        name="Loại gỗ"
                        value={saleProduct?.woodType || "Không có thông tin"}
                      />
                      <AttributeItem
                        name="Màu sắc"
                        value={saleProduct?.color || "Không có thông tin"}
                      />
                      <AttributeItem
                        name="Tính năng đặc biệt"
                        value={
                          saleProduct?.specialFeature || "Không có thông tin"
                        }
                      />
                      <AttributeItem
                        name="Phong cách"
                        value={saleProduct?.style || "Không có thông tin"}
                      />
                      <AttributeItem
                        name="Điêu khắc"
                        value={saleProduct?.sculpture || "Không có thông tin"}
                      />
                      <AttributeItem
                        name="Mùi hương"
                        value={saleProduct?.scent || "Không có thông tin"}
                      />
                      <AttributeItem
                        name="Bảo hành"
                        value={`${saleProduct?.warrantyDuration || 0} tháng`}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>

      {shipFee > 0 && (
        <Flex alignItems="center" my={4} p={5} bgColor={appColorTheme.grey_0}>
          <Text mr={4} fontSize="16px">
            Phí vận chuyển:
          </Text>
          <Text
            ml="auto"
            fontSize="20px"
            color={appColorTheme.brown_2}
            fontWeight="bold"
          >
            {formatPrice(shipFee)}
          </Text>
        </Flex>
      )}

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
    </Box>
  );
}
