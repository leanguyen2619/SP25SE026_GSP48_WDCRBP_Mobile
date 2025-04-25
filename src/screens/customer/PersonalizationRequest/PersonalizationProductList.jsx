import {
  Box,
  Heading,
  Text,
  Flex,
  HStack,
  Button,
  IconButton,
  VStack,
  Divider,
  Grid,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { Add, Remove, Edit } from "@mui/icons-material";
import { appColorTheme } from "../../../config/appconfig.js";
import ImageListSelector from "../../../components/Utility/ImageListSelector.jsx";

export default function PersonalizationProductList({
  productList,
  setProductList,
  handleEditProduct,
  handleRemoveProduct,
  techSpecs,
  notify,
}) {
  // Find tech spec by id
  const getTechSpec = (id) => {
    return techSpecs.find((spec) => spec.techSpecId === parseInt(id));
  };

  // Change quantity for a product in the list
  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 4) return;

    // Calculate total quantity excluding this product
    const totalOtherQuantity = productList.reduce((sum, product, i) => {
      if (i === index) return sum;
      return sum + parseInt(product.quantity || 0);
    }, 0);

    // Check if new total exceeds maximum
    if (totalOtherQuantity + newQuantity > 4) {
      notify("Lỗi!", "Tổng số lượng sản phẩm không được vượt quá 4.", "error");
      return;
    }

    const updatedList = [...productList];
    updatedList[index] = { ...updatedList[index], quantity: newQuantity };
    setProductList(updatedList);
  };

  // Get image URLs from product
  const getProductImages = (product) => {
    // Find the file type tech spec
    const fileSpec = techSpecs.find((spec) => spec.optionType === "file");
    if (!fileSpec) return "";

    // Return the value for this tech spec
    return product[`techSpec_${fileSpec.techSpecId}`] || "";
  };

  return (
    <Box bgColor="white" p={5} borderRadius="10px">
      <Heading fontWeight="bold" as="h3" fontSize="20px" mb={4}>
        Danh sách sản phẩm đã thêm
      </Heading>

      {productList.length === 0 ? (
        <Text>Chưa có sản phẩm nào.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {productList.map((product, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              position="relative"
              _hover={{ boxShadow: "sm" }}
              bgColor="gray.50"
            >
              <Grid templateColumns="1fr auto" gap={4}>
                <Box>
                  <Flex
                    justifyContent="space-between"
                    mb={2}
                    alignItems="center"
                  >
                    <Flex alignItems="center" gap={2}>
                      <Text fontWeight="bold" fontSize="lg">
                        Sản phẩm {index + 1}
                      </Text>
                      {product.categoryName && (
                        <Badge
                          colorScheme="green"
                          fontSize="0.8em"
                          px={2}
                          py={1}
                        >
                          {product.categoryName}
                        </Badge>
                      )}
                    </Flex>
                  </Flex>

                  {/* Display product images if available */}
                  {getProductImages(product) && (
                    <Box mb={4}>
                      <ImageListSelector
                        imgUrls={getProductImages(product)}
                        imgH={150}
                      />
                    </Box>
                  )}

                  <Stack gap={2}>
                    {/* Dynamically render all tech specs with values */}
                    {Object.entries(product)
                      .filter(
                        ([key, value]) =>
                          key.startsWith("techSpec_") &&
                          value &&
                          // Don't show file specs here as we're displaying the images separately
                          getTechSpec(parseInt(key.split("_")[1]))
                            ?.optionType !== "file"
                      )
                      .map(([key, value]) => {
                        const techSpecId = parseInt(key.split("_")[1]);
                        const spec = getTechSpec(techSpecId);

                        if (!spec) return null;

                        return (
                          <Text key={key}>
                            <strong>{spec.name}:</strong> {value || "Chưa chọn"}
                          </Text>
                        );
                      })}
                  </Stack>
                </Box>

                <VStack spacing={2} align="flex-end">
                  <Button
                    leftIcon={<Edit />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(index)}
                  >
                    Sửa
                  </Button>

                  <Button
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveProduct(index)}
                  >
                    Xóa
                  </Button>
                </VStack>
              </Grid>

              <Divider my={3} />

              <Flex justifyContent="space-between" alignItems="center">
                <QuantitySelector
                  quantity={product.quantity}
                  onChange={(newQuantity) =>
                    handleQuantityChange(index, newQuantity)
                  }
                />
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}

// Sub-component for quantity selection
function QuantitySelector({ quantity, onChange }) {
  return (
    <HStack>
      <Text>Số lượng:</Text>
      <Flex
        alignItems="center"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <IconButton
          size="sm"
          color="black"
          icon={<Remove sx={{ fontSize: "14px" }} />}
          bg="transparent"
          _hover={{ color: appColorTheme.brown_1 }}
          onClick={() => onChange(parseInt(quantity) - 1)}
          isDisabled={quantity <= 1}
          aria-label="Decrease quantity"
        />
        <Text px={3}>{quantity}</Text>
        <IconButton
          size="sm"
          color="black"
          icon={<Add sx={{ fontSize: "14px" }} />}
          bg="transparent"
          _hover={{ color: appColorTheme.brown_1 }}
          onClick={() => onChange(parseInt(quantity) + 1)}
          isDisabled={quantity >= 4}
          aria-label="Increase quantity"
        />
      </Flex>
    </HStack>
  );
}
