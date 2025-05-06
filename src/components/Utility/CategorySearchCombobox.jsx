import React, { useState, useEffect, useRef } from "react";
import { useGetAllCategoryQuery } from "../../services/categoryApi";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { appColorTheme } from "../../config/appconfig";

const CategorySearchCombobox = ({ setCategoryId, defaultCategoryId }) => {
  const { data: response, isLoading, isError } = useGetAllCategoryQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const inputRef = useRef(null);

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
    if (!text) {
      setSelectedCategory(null);
      setCategoryId(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setSearchTerm("");
    setCategoryId(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.alertContainer}>
        <Text style={styles.alertText}>
          Lỗi khi tải danh mục. Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpen(true)}
        style={styles.inputContainer}
      >
        <TextInput
          ref={inputRef}
          placeholder="Chọn danh mục"
          value={searchTerm}
          onChangeText={handleInputChange}
          style={styles.input}
          onFocus={() => setIsOpen(true)}
        />
        <View style={styles.buttonsContainer}>
          {selectedCategory ? (
            <>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleClearSelection}
              >
                <Icon name="x" size={20} color="#666" />
              </TouchableOpacity>
              <Icon
                name="chevron-down"
                size={20}
                color="#666"
                style={styles.icon}
              />
            </>
          ) : (
            <Icon
              name="chevron-down"
              size={20}
              color="#666"
              style={styles.icon}
            />
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn danh mục</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChangeText={handleInputChange}
              />
            </View>

            <ScrollView style={styles.categoryList}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TouchableOpacity
                    key={category.categoryId}
                    style={[
                      styles.categoryItem,
                      hoveredCategory === category.categoryId &&
                        styles.hoveredCategory,
                      selectedCategory?.categoryId === category.categoryId &&
                        styles.selectedCategory,
                    ]}
                    onPress={() => handleSelectCategory(category)}
                    onPressIn={() => setHoveredCategory(category.categoryId)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory?.categoryId === category.categoryId &&
                          styles.selectedCategoryText,
                      ]}
                    >
                      {category.categoryName}
                    </Text>
                    {selectedCategory?.categoryId === category.categoryId && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Không tìm thấy danh mục nào
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !selectedCategory && styles.disabledButton,
                ]}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.confirmButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    paddingRight: 10,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  alertContainer: {
    backgroundColor: "#FED7D7",
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
  },
  alertText: {
    color: "#C53030",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
    maxHeight: "80%",
    maxWidth: 600,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchInput: {
    backgroundColor: "#F7FAFC",
    padding: 10,
    borderRadius: 4,
    fontSize: 16,
  },
  categoryList: {
    maxHeight: 400,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hoveredCategory: {
    backgroundColor: "#F7FAFC",
  },
  selectedCategory: {
    backgroundColor: "#EBF8FF",
  },
  categoryText: {
    fontSize: 16,
  },
  selectedCategoryText: {
    fontWeight: "bold",
    color: "#3182CE",
  },
  badge: {
    backgroundColor: "#38A169",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#718096",
  },
  confirmButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  confirmButton: {
    backgroundColor: appColorTheme.brown_2,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default CategorySearchCombobox;
