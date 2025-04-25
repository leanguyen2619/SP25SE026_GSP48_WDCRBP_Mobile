import {
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useGetAllNestedCategoryQuery } from "../../services/categoryApi";
import { appColorTheme } from "../../config/appconfig";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const CategorySelector = ({
  setCategoryId,
  setCategoryName,
  initialCategoryId,
  allowLevel1Selection = true,
}) => {
  const { data, isLoading, error } = useGetAllNestedCategoryQuery();
  const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialCategoryId || null
  );
  const [displayName, setDisplayName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const popoverRef = useRef(null);

  const categories = data?.data || [];

  // Find initial category path based on initialCategoryId
  useEffect(() => {
    if (initialCategoryId && categories.length > 0) {
      // Check if initialCategoryId is a level 1 category
      const topLevelCategory = categories.find(
        (cat) => cat.id === initialCategoryId
      );
      if (topLevelCategory) {
        setSelectedCategoryPath([topLevelCategory]);
        setDisplayName(topLevelCategory.categoryName);
        return;
      }

      // Check in nested categories
      const findCategoryPath = (cats, targetId, currentPath = []) => {
        for (const cat of cats) {
          // Check if this is the target
          if (cat.id === targetId) {
            return [...currentPath, cat];
          }

          // Check children if they exist
          if (cat.children && cat.children.length > 0) {
            const foundPath = findCategoryPath(cat.children, targetId, [
              ...currentPath,
              cat,
            ]);
            if (foundPath) return foundPath;
          }
        }
        return null;
      };

      const path = findCategoryPath(categories, initialCategoryId);
      if (path) {
        setSelectedCategoryPath(path);
        // Set display name to the leaf category
        setDisplayName(path[path.length - 1].categoryName);
      }
    }
  }, [initialCategoryId, categories]);

  // Handle category selection
  const handleCategorySelect = (category, level) => {
    // Trim path to the selected level and add the new category
    const newPath = [...selectedCategoryPath.slice(0, level), category];
    setSelectedCategoryPath(newPath);

    // If it's a leaf category or allowLevel1Selection is true, update the selected ID
    const isLeaf = !category.children || category.children.length === 0;
    if (isLeaf || (level === 0 && allowLevel1Selection)) {
      setSelectedCategoryId(category.id);
      setCategoryId(category.id);
      setDisplayName(category.categoryName);
      if (setCategoryName) setCategoryName(category.categoryName);
      setIsOpen(false); // Close dropdown after selection
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner color={appColorTheme.brown_2} size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Không thể tải danh mục. Vui lòng thử lại sau.
      </Alert>
    );
  }

  return (
    <Box width="100%">
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom-start"
        autoFocus={false}
        isLazy
        closeOnBlur={true}
        gutter={2}
        ref={popoverRef}
      >
        <PopoverTrigger>
          <InputGroup>
            <Input
              placeholder="Chọn danh mục sản phẩm"
              value={displayName}
              bgColor="white"
              readOnly
              cursor="pointer"
              onClick={() => setIsOpen(!isOpen)}
              _hover={{ borderColor: appColorTheme.brown_1 }}
              focusBorderColor={appColorTheme.brown_2}
            />
            <InputRightElement>
              <Icon as={FiChevronDown} />
            </InputRightElement>
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent
          width="600px"
          maxWidth="90vw"
          boxShadow="lg"
          _focus={{ outline: "none" }}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <PopoverBody p={0}>
            <HStack align="stretch" spacing={0} width="100%">
              {/* Left panel - Level 0 categories */}
              <VStack
                align="stretch"
                spacing={0}
                width="40%"
                borderRight="1px solid"
                borderColor="gray.200"
              >
                {categories.map((category) => (
                  <Box
                    key={category.id}
                    p={3}
                    cursor="pointer"
                    bg={
                      hoveredCategory === category.id ||
                      selectedCategoryId === category.id
                        ? "gray.100"
                        : "white"
                    }
                    _hover={{ bg: "gray.100" }}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    onClick={() => handleCategorySelect(category, 0)}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    position="relative"
                  >
                    <HStack justifyContent="space-between">
                      <Text
                        fontWeight={
                          selectedCategoryId === category.id ? "bold" : "normal"
                        }
                      >
                        {category.categoryName}
                      </Text>
                      {category.children && category.children.length > 0 && (
                        <Icon as={FiChevronRight} />
                      )}
                    </HStack>

                    {selectedCategoryId === category.id && (
                      <Badge
                        position="absolute"
                        right={2}
                        top={2}
                        colorScheme="green"
                        variant="solid"
                        size="sm"
                        fontSize="8px"
                        borderRadius="full"
                      >
                        ✓
                      </Badge>
                    )}
                  </Box>
                ))}
              </VStack>

              {/* Right panel - Level 1 categories (if any) */}
              <Box width="60%" p={2} bg="white">
                {hoveredCategory &&
                categories.find((cat) => cat.id === hoveredCategory)?.children
                  ?.length > 0 ? (
                  <VStack align="stretch" spacing={1}>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.600"
                      mb={1}
                    >
                      Danh mục con:
                    </Text>
                    {categories
                      .find((cat) => cat.id === hoveredCategory)
                      ?.children.map((subCategory) => (
                        <Box
                          key={subCategory.id}
                          p={2}
                          cursor="pointer"
                          borderRadius="md"
                          bg={
                            selectedCategoryId === subCategory.id
                              ? "blue.50"
                              : "transparent"
                          }
                          _hover={{ bg: "gray.50" }}
                          onClick={() => handleCategorySelect(subCategory, 1)}
                        >
                          <Text
                            fontWeight={
                              selectedCategoryId === subCategory.id
                                ? "bold"
                                : "normal"
                            }
                            color={
                              selectedCategoryId === subCategory.id
                                ? "blue.600"
                                : "inherit"
                            }
                          >
                            {subCategory.categoryName}
                          </Text>
                        </Box>
                      ))}
                  </VStack>
                ) : (
                  <Text
                    color="gray.500"
                    fontSize="sm"
                    textAlign="center"
                    py={6}
                  >
                    {hoveredCategory
                      ? "Danh mục này không có danh mục con"
                      : "Vui lòng chọn một danh mục bên trái để xem chi tiết"}
                  </Text>
                )}
              </Box>
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default CategorySelector;
