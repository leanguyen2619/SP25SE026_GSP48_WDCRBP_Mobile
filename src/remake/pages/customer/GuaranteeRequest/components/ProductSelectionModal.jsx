import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Box,
  Flex,
  Text,
  Image,
  Stack,
  Badge,
  Alert,
  AlertIcon,
  Center,
  Spinner,
} from "@chakra-ui/react";

export default function ProductSelectionModal({
  isOpen,
  onClose,
  orderDetail,
  isLoadingOrderDetail,
  getWarrantyEndDate,
  formatDate,
  handleSelectProduct,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chọn sản phẩm cần sửa chữa / bảo hành</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoadingOrderDetail ? (
            <Center p={10}>
              <Spinner />
            </Center>
          ) : orderDetail?.requestedProduct?.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {orderDetail.requestedProduct.map((product) => {
                const warrantyEndDate = getWarrantyEndDate(product);
                const isExpired =
                  warrantyEndDate && new Date() > warrantyEndDate;

                return (
                  <Box
                    key={product.requestedProductId}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <Flex>
                      {(product.designIdeaVariantDetail?.img_urls ||
                        product.finishImgUrls) && (
                        <Image
                          boxSize="80px"
                          objectFit="cover"
                          src={
                            (
                              product.designIdeaVariantDetail?.img_urls ||
                              product.finishImgUrls
                            )?.split(";")[0]
                          }
                          alt={product.category?.categoryName}
                          borderRadius="md"
                          mr={4}
                        />
                      )}
                      <Stack flex="1">
                        <Text fontWeight="bold">
                          {`#${product.requestedProductId}. `}
                          {product.designIdeaVariantDetail?.name ||
                            product.category?.categoryName ||
                            "Sản phẩm"}
                        </Text>
                        <Flex justifyContent="space-between">
                          <Text fontSize="sm">
                            Thời hạn bảo hành: {product.warrantyDuration || 0}{" "}
                            tháng
                          </Text>
                          {isExpired ? (
                            <Badge colorScheme="red">Đã hết hạn</Badge>
                          ) : (
                            <Badge colorScheme="green">Còn hạn</Badge>
                          )}
                        </Flex>
                        <Text fontSize="sm">
                          Hết hạn ngày: {formatDate(warrantyEndDate)}
                        </Text>
                      </Stack>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          ) : (
            <Alert status="info">
              <AlertIcon />
              Không tìm thấy thông tin sản phẩm trong đơn hàng này.
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
