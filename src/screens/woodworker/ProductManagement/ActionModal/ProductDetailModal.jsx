import {
  Box,
  Button,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiEye } from "react-icons/fi";
import { appColorTheme } from "../../../../config/appconfig";
import ImageListSelector from "../../../../components/Utility/ImageListSelector";
import { formatPrice } from "../../../../utils/utils";
import StarReview from "../../../../components/Utility/StarReview";

export default function ProductDetailModal({ product }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

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
          <ModalHeader>Chi tiết sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody bgColor="app_grey.1" pb={6}>
            <Stack gap={5}>
              <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
                {/* Product images */}
                <Box>
                  <Heading size="md" mb={4}>
                    Hình ảnh sản phẩm
                  </Heading>
                  <ImageListSelector imgH={300} imgUrls={product?.mediaUrls} />
                </Box>

                {/* Basic information */}
                <Box>
                  <Heading size="md" mb={4}>
                    Thông tin cơ bản
                  </Heading>
                  <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Text fontWeight="bold">Mã sản phẩm:</Text>
                        <Text>{product?.productId}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Tên sản phẩm:</Text>
                        <Text>{product?.productName}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Danh mục:</Text>
                        <Text>{product?.categoryName}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Mô tả:</Text>
                        <Text whiteSpace="pre-wrap">
                          {product?.description}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </SimpleGrid>

              {/* Technical details */}
              <Box>
                <Heading size="md" mb={4}>
                  Thông tin kỹ thuật
                </Heading>
                <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
                  <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                    <Box>
                      <Text fontWeight="bold">Giá:</Text>
                      <Text fontSize="xl" as="b" color={appColorTheme.brown_2}>
                        {formatPrice(product?.price)}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Tồn kho:</Text>
                      <Text>{product?.stock} sản phẩm</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Bảo hành:</Text>
                      <Text>{product?.warrantyDuration} tháng</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Kích thước:</Text>
                      <Text>
                        {product?.length} x {product?.width} x {product?.height}{" "}
                        cm
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Loại gỗ:</Text>
                      <Text>{product?.woodType}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Màu sắc:</Text>
                      <Text>{product?.color}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Tính năng đặc biệt:</Text>
                      <Text>{product?.specialFeature}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Phong cách:</Text>
                      <Text>{product?.style}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Điêu khắc:</Text>
                      <Text>{product?.sculpture}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Mùi hương:</Text>
                      <Text>{product?.scent}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Đánh giá:</Text>
                      <StarReview
                        totalReviews={product?.totalReviews || 0}
                        totalStar={product?.totalStar || 0}
                      />
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Cần giao hàng + lắp đặt:</Text>
                      <Text>{product?.isInstall ? "Có" : "Không"}</Text>
                    </Box>
                  </Grid>
                </Box>
              </Box>
            </Stack>

            <Button onClick={onClose} mt={6} float="right">
              Đóng
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
