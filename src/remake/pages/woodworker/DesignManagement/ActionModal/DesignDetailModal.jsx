import {
  Box,
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  SimpleGrid,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Badge,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiEye, FiPackage } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import ImageListSelector from "../../../../components/Utility/ImageListSelector";
import { formatPrice } from "../../../../utils/utils";
import {
  useGetDesignByIdQuery,
  useGetDesignIdeaVariantQuery,
} from "../../../../services/designIdeaApi";
import StarReview from "../../../../components/Utility/StarReview";

export default function DesignDetailModal({ data }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const designId = data?.designIdeaId;

  // Fetch design data and variant data when modal is open
  const {
    data: designData,
    isLoading: isDesignLoading,
    error: designError,
  } = useGetDesignByIdQuery(designId, { skip: !isOpen });

  const {
    data: variantData,
    isLoading: isVariantLoading,
    error: variantError,
  } = useGetDesignIdeaVariantQuery(designId, { skip: !isOpen });

  const design = designData?.data;
  const variants = variantData?.data || [];

  // Handle loading and error states
  const isLoading = isDesignLoading || isVariantLoading;
  const hasError = designError || variantError;

  // Extract unique configurations from variants
  const getUniqueConfigs = () => {
    const configMap = new Map();

    variants.forEach((variant) => {
      variant.designIdeaVariantConfig.forEach((config) => {
        config.designVariantValues.forEach((value) => {
          const configId = value.designIdeaConfig.designIdeaConfigId;
          if (!configMap.has(configId)) {
            configMap.set(configId, {
              id: configId,
              name: value.designIdeaConfig.specifications,
              values: new Map(),
            });
          }

          const valueId = value.designIdeaConfigValueId;
          if (!configMap.get(configId).values.has(valueId)) {
            configMap.get(configId).values.set(valueId, {
              id: valueId,
              name: value.value,
            });
          }
        });
      });
    });

    // Convert Maps to arrays for rendering
    return Array.from(configMap.values()).map((config) => ({
      ...config,
      values: Array.from(config.values.values()),
    }));
  };

  const configurations = getUniqueConfigs();

  return (
    <>
      <Tooltip label="Chi tiết" hasArrow>
        <Button
          p="1px"
          color={appColorTheme.brown_2}
          bg="none"
          border={`1px solid ${appColorTheme.brown_2}`}
          _hover={{ bg: appColorTheme.brown_2, color: "white" }}
          onClick={onOpen}
        >
          <FiEye />
        </Button>
      </Tooltip>

      <Modal
        size="6xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết thiết kế</ModalHeader>
          <ModalCloseButton />
          <ModalBody bgColor="app_grey.1" pb={6}>
            {isLoading ? (
              <Center p={10}>
                <Spinner size="xl" color={appColorTheme.brown_2} />
              </Center>
            ) : hasError ? (
              <Alert status="error">
                <AlertIcon />
                Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.
              </Alert>
            ) : (
              <Stack gap={5}>
                <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
                  {/* Phần hình ảnh */}
                  <Box>
                    <Heading size="md" mb={4}>
                      Hình ảnh sản phẩm
                    </Heading>
                    <ImageListSelector imgH={300} imgUrls={design?.img_urls} />
                  </Box>

                  {/* Phần thông tin cơ bản */}
                  <Box>
                    <Heading size="md" mb={4}>
                      Thông tin cơ bản
                    </Heading>
                    <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontWeight="bold">Tên thiết kế:</Text>
                          <Text>{design?.name}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Danh mục:</Text>
                          <Text>{design?.category?.categoryName}</Text>
                        </Box>

                        <Box>
                          <Text fontWeight="bold">Lắp đặt:</Text>
                          <Text>
                            {design?.isInstall
                              ? "Cần lắp đặt"
                              : "Không cần lắp đặt"}
                          </Text>
                        </Box>

                        <Box>
                          <Text fontWeight="bold">Điểm đánh giá:</Text>
                          <Text>
                            <StarReview
                              totalReviews={design?.totalReviews}
                              totalStar={design?.totalStar}
                            />
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Mô tả:</Text>
                          <Text>{design?.description || "Không có mô tả"}</Text>
                        </Box>
                      </VStack>
                    </Box>
                  </Box>
                </SimpleGrid>

                {/* Phần cấu hình */}
                <Box>
                  <Heading size="md" mb={4}>
                    Cấu hình sản phẩm
                  </Heading>
                  <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
                    <VStack align="stretch" spacing={4}>
                      {configurations.map((config) => (
                        <Box key={config.id}>
                          <Text fontWeight="bold" mb={2}>
                            {config.name}:
                          </Text>
                          <HStack spacing={2} flexWrap="wrap">
                            {config.values.map((value) => (
                              <Text
                                key={value.id}
                                px={3}
                                py={1}
                                bg="gray.100"
                                borderRadius="full"
                                bgColor="white"
                                border={`1px solid ${appColorTheme.brown_2}`}
                                color={appColorTheme.brown_2}
                              >
                                {value.name}
                              </Text>
                            ))}
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </Box>

                {/* Phần bảng giá */}
                <Box>
                  <Heading size="md" mb={4}>
                    Bảng giá theo cấu hình
                  </Heading>
                  <Box
                    bg="white"
                    p={5}
                    borderRadius="lg"
                    boxShadow="md"
                    overflowX="auto"
                  >
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          {configurations.map((config) => (
                            <Th key={config.id}>{config.name}</Th>
                          ))}
                          <Th>Giá</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {variants.map((variant) => (
                          <Tr key={variant.designIdeaVariantId}>
                            {configurations.map((config) => {
                              // Find the value for this configuration in this variant
                              let valueText = "-";
                              variant.designIdeaVariantConfig.forEach(
                                (varConfig) => {
                                  varConfig.designVariantValues.forEach(
                                    (value) => {
                                      if (
                                        value.designIdeaConfig
                                          .designIdeaConfigId === config.id
                                      ) {
                                        valueText = value.value;
                                      }
                                    }
                                  );
                                }
                              );
                              return (
                                <Td
                                  key={`${variant.designIdeaVariantId}-${config.id}`}
                                >
                                  {valueText}
                                </Td>
                              );
                            })}
                            <Td>
                              <Text
                                fontSize="xl"
                                as="b"
                                color={appColorTheme.brown_2}
                              >
                                {formatPrice(variant.price)}
                              </Text>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </Stack>
            )}

            <HStack justify="flex-end" mt={6}>
              <Button onClick={onClose}>Đóng</Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
