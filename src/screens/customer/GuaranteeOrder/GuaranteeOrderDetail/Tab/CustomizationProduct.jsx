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
} from "@chakra-ui/react";
import { format, add } from "date-fns";
import { appColorTheme } from "../../../../../config/appconfig.js";
import ImageListSelector from "../../../../../components/Utility/ImageListSelector.jsx";

const ConfigurationItem = ({ name, value }) => (
  <HStack justify="space-between" w="100%">
    <Text fontWeight="bold">{name}:</Text>
    <Text>{value}</Text>
  </HStack>
);

export default function CustomizationProduct({
  product = {},
  productCurrentStatus = "",
  currentProductImgUrls = "",
  completionDate = null,
  warrantyDuration = 0,
  isGuarantee,
  guaranteeError,
}) {
  const designDetail = product.designIdeaVariantDetail;

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
                  src={designDetail?.img_urls?.split(";")[0] || ""}
                  alt={designDetail?.name}
                  boxSize="50px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box>
                  <ChakraLink
                    target="_blank"
                    href={`/design/${designDetail?.designIdeaId}`}
                  >
                    <Text
                      _hover={{
                        textDecoration: "underline",
                      }}
                      fontWeight="bold"
                    >
                      #{product.requestedProductId}
                      {". "}
                      {designDetail?.name || "Sản phẩm không xác định"} x{" "}
                      {product?.quantity}
                    </Text>
                  </ChakraLink>
                  <Badge colorScheme="purple">
                    {designDetail?.category?.categoryName || "Không phân loại"}
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

              {/* Cấu hình đã chọn */}
              <Box>
                <Text
                  color={appColorTheme.brown_2}
                  fontWeight="bold"
                  fontSize="lg"
                  my={3}
                >
                  Cấu hình đã chọn:
                </Text>
                <Stack spacing={3}>
                  {designDetail?.designIdeaVariantConfig?.map(
                    (config, index) => {
                      // Extract the config and its value
                      const configSpec =
                        config.designVariantValues[0]?.designIdeaConfig
                          ?.specifications;
                      const configValue = config.designVariantValues[0]?.value;

                      return (
                        <ConfigurationItem
                          key={index}
                          name={configSpec || `Cấu hình ${index + 1}`}
                          value={configValue || "Không xác định"}
                        />
                      );
                    }
                  )}
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
