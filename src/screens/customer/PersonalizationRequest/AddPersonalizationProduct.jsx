import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  ButtonGroup,
} from "@chakra-ui/react";
import ImageUpdateUploader from "../../../components/Utility/ImageUpdateUploader.jsx";
import ActionButton from "../../../components/Button/ActionButton.jsx";
import AutoCompleteInput from "./AutoCompleteInput.jsx";
import { useState } from "react";
import CategorySelector from "../../../components/Utility/CategorySelector.jsx";

export default function AddPersonalizationProduct({
  techSpecs = [],
  productData = {},
  setProductData,
  handleAddProduct,
  isEditing = false,
  onCancelEdit,
}) {
  // Add a resetKey state to force components to remount
  const [resetKeys, setResetKeys] = useState({});

  // Handle form input changes
  const handleInputChange = (techSpecId, value) => {
    setProductData({
      ...productData,
      [`techSpec_${techSpecId}`]: value,
    });
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setProductData((prevData) => {
      const newData = {
        ...prevData,
        categoryId: categoryId,
      };

      return newData;
    });
  };

  // Handle category name update
  const handleCategoryNameChange = (categoryName) => {
    setProductData((prevData) => {
      const newData = {
        ...prevData,
        categoryName: categoryName,
      };

      return newData;
    });
  };

  // Handle quantity changes
  const handleQuantityChange = (value) => {
    if (value < 1) value = 1;
    if (value > 4) value = 4;
    setProductData({
      ...productData,
      quantity: value,
    });
  };

  // Create a wrapped handleAddProduct function to reset components
  const wrappedHandleAddProduct = () => {
    // Call the original handleAddProduct function
    handleAddProduct();

    // Reset keys to force components to remount
    const newResetKeys = {
      categorySelector: Date.now(), // Add a key for CategorySelector
    };

    // Also reset ImageUpdateUploader keys
    techSpecs.forEach((spec) => {
      if (spec.optionType === "file") {
        newResetKeys[spec.techSpecId] = Date.now();
      }
    });

    setResetKeys(newResetKeys);
  };

  // Handle file upload completion
  const handleImageUploadComplete = (techSpecId, imageUrls) => {
    handleInputChange(techSpecId, imageUrls);
  };

  // Render appropriate input for each tech spec type
  const renderInput = (techSpec) => {
    const value = productData[`techSpec_${techSpec.techSpecId}`] || "";

    switch (techSpec.optionType) {
      case "number":
        return (
          <NumberInput
            min={1}
            value={value}
            onChange={(valueString) =>
              handleInputChange(techSpec.techSpecId, valueString)
            }
          >
            <NumberInputField
              placeholder={`Nhập ${techSpec.name.toLowerCase()}`}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        );

      case "select":
        return (
          <AutoCompleteInput
            options={techSpec.values || []}
            value={value}
            onChange={(newValue) =>
              handleInputChange(techSpec.techSpecId, newValue)
            }
            placeholder={`Chọn ${techSpec.name.toLowerCase()}`}
          />
        );

      case "file":
        // Add key prop to force re-render
        return (
          <ImageUpdateUploader
            key={resetKeys[techSpec.techSpecId] || techSpec.techSpecId}
            imgUrls={value} // Pass the current image URLs
            maxFiles={4}
            onUploadComplete={(imgUrls) =>
              handleImageUploadComplete(techSpec.techSpecId, imgUrls)
            }
          />
        );

      case "text":
      default:
        return (
          <Input
            placeholder={`Nhập ${techSpec.name.toLowerCase()}`}
            value={value}
            onChange={(e) =>
              handleInputChange(techSpec.techSpecId, e.target.value)
            }
          />
        );
    }
  };

  return (
    <Box>
      <Box bgColor="white" p="20px" borderRadius="10px">
        <Heading fontWeight="bold" fontSize="20px" mb={4}>
          {isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        </Heading>

        <Text color="gray.500">
          (Lưu ý sử dụng <b>cm</b> làm đơn vị cho kích thước)
        </Text>

        <FormControl mt={4} isRequired>
          <FormLabel>Danh mục sản phẩm</FormLabel>
          <CategorySelector
            key={resetKeys.categorySelector || "category-selector"}
            setCategoryId={handleCategoryChange}
            setCategoryName={handleCategoryNameChange}
          />
          {productData.categoryName && (
            <Text mt={2} fontSize="sm" color="green.600">
              Danh mục đã chọn: <strong>{productData.categoryName}</strong>
            </Text>
          )}
        </FormControl>

        {techSpecs.map((techSpec) => (
          <FormControl key={techSpec.techSpecId} mt={4} isRequired>
            <FormLabel>{techSpec.name}</FormLabel>
            {renderInput(techSpec)}
          </FormControl>
        ))}

        <FormControl mt={4} isRequired>
          <FormLabel>Số lượng ({productData.quantity}/4)</FormLabel>
          <Flex align="center">
            <NumberInput
              min={1}
              max={4}
              value={productData.quantity || 1}
              onChange={(valueString) =>
                handleQuantityChange(parseInt(valueString))
              }
              maxW="100px"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text ml={2} color="gray.500">
              Tối đa 4 sản phẩm
            </Text>
          </Flex>
        </FormControl>

        <Flex mt={6}>
          <Spacer />
          {isEditing && (
            <ButtonGroup spacing={4}>
              <ActionButton
                text="Hủy"
                bgColor="gray.400"
                onClickExeFn={onCancelEdit}
              />
              <ActionButton
                text="Cập nhật"
                onClickExeFn={wrappedHandleAddProduct}
              />
            </ButtonGroup>
          )}
          {!isEditing && (
            <ActionButton
              text="+ Thêm sản phẩm"
              onClickExeFn={wrappedHandleAddProduct}
            />
          )}
        </Flex>
      </Box>
    </Box>
  );
}
