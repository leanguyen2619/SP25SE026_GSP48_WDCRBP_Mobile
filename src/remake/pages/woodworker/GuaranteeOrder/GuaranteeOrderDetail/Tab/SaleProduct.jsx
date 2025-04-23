import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Stack,
  Text,
  Image,
  Link as ChakraLink,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { format, add } from "date-fns";
import { appColorTheme } from "../../../../../config/appconfig.js";
import ImageListSelector from "../../../../../components/Utility/ImageListSelector.jsx";

const AttributeItem = ({ name, value }) => (
  <HStack justify="space-between" w="100%">
    <Text fontWeight="bold">{name}:</Text>
    <Text>{value}</Text>
  </HStack>
);

export default function SaleProduct({
  product = {},
  productCurrentStatus = "",
  currentProductImgUrls = "",
  completionDate = null,
  warrantyDuration = 0,
  isGuarantee,
  guaranteeError,
}) {
  const saleProduct = product.product;

  // Calculate warranty end date if completionDate exists
  const warrantyEndDate = completionDate
    ? add(new Date(completionDate), { months: warrantyDuration })
    : null;

  return (
    <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
      <Accordion allowMultiple>
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
                        "Sản phẩm không xác định"} x {product?.quantity}
                    </Text>
                  </ChakraLink>
                  <Badge colorScheme="purple">
                    {product?.category?.categoryName ||
                      saleProduct?.categoryName ||
                      "Không phân loại"}
                  </Badge>
                </Box>
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
                  <Text whiteSpace="pre-wrap">{saleProduct.description}</Text>
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
                    value={saleProduct?.specialFeature || "Không có thông tin"}
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
                </Stack>
              </Box>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* New section: Thông tin sửa chữa */}
      <Box mb={6} p={4} bg={appColorTheme.grey_0} borderRadius="md">
        <Text
          color={appColorTheme.brown_2}
          fontWeight="bold"
          fontSize="lg"
          mb={3}
        >
          Thông tin sửa chữa:
        </Text>

        <Stack spacing={4}>
          {/* Form */}
          <HStack>
            <Text fontWeight="bold">Hình thức yêu cầu:</Text>
            <Text>{isGuarantee ? "Bảo hành" : "Sửa chữa"}</Text>
          </HStack>

          {guaranteeError && isGuarantee && (
            <HStack color="red.500">
              <Text fontWeight="bold">Lỗi bảo hành:</Text>
              <Text>{guaranteeError}</Text>
            </HStack>
          )}

          {/* Current Status */}
          <HStack>
            <Text fontWeight="bold">Trạng thái hiện tại:</Text>
            <Text>{productCurrentStatus || "Chưa có thông tin"}</Text>
          </HStack>

          {/* Completion Date */}
          {completionDate && (
            <HStack>
              <Text fontWeight="bold">Ngày khách nhận hàng:</Text>
              <Text>{format(new Date(completionDate), "dd/MM/yyyy")}</Text>
            </HStack>
          )}

          {/* Warranty Information */}
          {warrantyEndDate && (
            <HStack>
              <Text fontWeight="bold">Bảo hành đến:</Text>
              <Text>{format(warrantyEndDate, "dd/MM/yyyy")}</Text>
            </HStack>
          )}

          {/* Current Product Images */}
          {currentProductImgUrls && (
            <Box mt={2}>
              <Text fontWeight="bold" mb={2}>
                Hình ảnh tình trạng hiện tại:
              </Text>
              <ImageListSelector imgUrls={currentProductImgUrls} imgH={200} />
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
