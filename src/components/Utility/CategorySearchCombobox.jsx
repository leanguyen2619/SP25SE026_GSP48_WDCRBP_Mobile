import React, { useState, useEffect } from "react";
import { useGetAllCategoryQuery } from "../../services/categoryApi";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CategorySearchCombobox = ({ setCategoryId, defaultCategoryId }) => {
  const { data: response, isLoading, isError } = useGetAllCategoryQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = response?.data || [];
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Set default selected category if defaultCategoryId is provided
  useEffect(() => {
    if (defaultCategoryId && categories.length > 0) {
      const defaultCategory = categories.find(
        (cat) => cat.categoryId === defaultCategoryId
      );
      if (defaultCategory) {
        setSelectedCategory(defaultCategory);
        setSearchTerm(defaultCategory.categoryName);
      }
    }
  }, [defaultCategoryId, categories]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setSearchTerm(category.categoryName);
    setCategoryId(category.categoryId);
    setIsOpen(false);
  };

  const handleInputChange = (text) => {
    setSearchTerm(text);
    setIsOpen(true);
    if (!text) {
      setSelectedCategory(null);
      setCategoryId(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setSearchTerm("");
    setCategoryId(null);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#3182CE" />
        <Text style={styles.loadingText}>Đang tải danh mục...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <Text style={styles.errorText}>
        Lỗi khi tải danh mục. Vui lòng thử lại sau.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Chọn danh mục"
          value={searchTerm}
          onChangeText={handleInputChange}
          onFocus={() => !selectedCategory && setIsOpen(true)}
          editable={!selectedCategory}
        />
        <View style={styles.buttonsContainer}>
          {selectedCategory ? (
            <>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleClearSelection}
              >
                <Ionicons name="close" size={20} color="#718096" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsOpen(!isOpen)}
              >
                <Ionicons name="chevron-down" size={20} color="#718096" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsOpen(!isOpen)}
            >
              <Ionicons name="chevron-down" size={20} color="#718096" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isOpen && !selectedCategory && (
        <View style={styles.dropdown}>
          {filteredCategories.length > 0 ? (
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.categoryId.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectCategory(item)}
                >
                  <Text>{item.categoryName}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
            />
          ) : (
            <View style={styles.dropdownItem}>
              <Text>Không tìm thấy danh mục nào</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
  },
  dropdown: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    maxHeight: 200,
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
  },
  errorText: {
    color: "#E53E3E",
    padding: 10,
    fontSize: 14,
  },
});

export default CategorySearchCombobox;
