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
} from "@chakra-ui/react";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { formatPrice } from "../../../../../utils/utils.js";
import ImageListSelector from "../../../../../components/Utility/ImageListSelector.jsx";

const ConfigurationItem = ({ name, value }) => (
  <HStack justify="space-between" w="100%">
    <Text fontWeight="bold">{name}:</Text>
    <Text>{value}</Text>
  </HStack>
);

export default function CustomizationProductList({
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
          const designDetail = product.designIdeaVariantDetail;

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
                          {designDetail?.name ||
                            "Sản phẩm không xác định"} x {product?.quantity}
                        </Text>
                      </ChakraLink>
                      <Badge colorScheme="purple">
                        {designDetail?.category?.categoryName ||
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
                          const configValue =
                            config.designVariantValues[0]?.value;

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
