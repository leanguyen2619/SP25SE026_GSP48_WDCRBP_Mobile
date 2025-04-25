import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useGetAllNestedCategoryQuery } from "../../services/categoryApi";
import { appColorTheme } from "../../config/appconfig";

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
  const inputRef = useRef(null);

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.alertContainer}>
        <Text style={styles.alertText}>
          Không thể tải danh mục. Vui lòng thử lại sau.
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
          placeholder="Chọn danh mục sản phẩm"
          value={displayName}
          style={styles.input}
          editable={false}
          pointerEvents="none"
        />
        <Icon name="chevron-down" size={20} color="#666" style={styles.icon} />
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

            <View style={styles.categoryContainer}>
              {/* Left panel - Level 0 categories */}
              <View style={styles.leftPanel}>
                <ScrollView>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryItem,
                        hoveredCategory === category.id &&
                          styles.hoveredCategory,
                        selectedCategoryId === category.id &&
                          styles.selectedCategory,
                      ]}
                      onPress={() => handleCategorySelect(category, 0)}
                      onPressIn={() => setHoveredCategory(category.id)}
                    >
                      <View style={styles.categoryItemContent}>
                        <Text
                          style={[
                            styles.categoryText,
                            selectedCategoryId === category.id &&
                              styles.selectedCategoryText,
                          ]}
                        >
                          {category.categoryName}
                        </Text>
                        {category.children && category.children.length > 0 && (
                          <Icon name="chevron-right" size={16} color="#666" />
                        )}
                      </View>

                      {selectedCategoryId === category.id && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Right panel - Level 1 categories (if any) */}
              <View style={styles.rightPanel}>
                <ScrollView>
                  {hoveredCategory &&
                  categories.find((cat) => cat.id === hoveredCategory)?.children
                    ?.length > 0 ? (
                    <View style={styles.subCategoriesContainer}>
                      <Text style={styles.subCategoriesTitle}>
                        Danh mục con:
                      </Text>
                      {categories
                        .find((cat) => cat.id === hoveredCategory)
                        ?.children.map((subCategory) => (
                          <TouchableOpacity
                            key={subCategory.id}
                            style={[
                              styles.subCategoryItem,
                              selectedCategoryId === subCategory.id &&
                                styles.selectedSubCategory,
                            ]}
                            onPress={() => handleCategorySelect(subCategory, 1)}
                          >
                            <Text
                              style={[
                                styles.subCategoryText,
                                selectedCategoryId === subCategory.id &&
                                  styles.selectedSubCategoryText,
                              ]}
                            >
                              {subCategory.categoryName}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  ) : (
                    <View style={styles.emptyRightPanel}>
                      <Text style={styles.emptyRightPanelText}>
                        {hoveredCategory
                          ? "Danh mục này không có danh mục con"
                          : "Vui lòng chọn một danh mục bên trái để xem chi tiết"}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
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
  categoryContainer: {
    flexDirection: "row",
    height: 400,
  },
  leftPanel: {
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  rightPanel: {
    width: "60%",
    padding: 10,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "white",
  },
  hoveredCategory: {
    backgroundColor: "#F7FAFC",
  },
  selectedCategory: {
    backgroundColor: "#F7FAFC",
  },
  categoryItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 16,
  },
  selectedCategoryText: {
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#38A169",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  subCategoriesContainer: {
    padding: 5,
  },
  subCategoriesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 10,
  },
  subCategoryItem: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 4,
  },
  selectedSubCategory: {
    backgroundColor: "#EBF8FF",
  },
  subCategoryText: {
    fontSize: 15,
  },
  selectedSubCategoryText: {
    fontWeight: "bold",
    color: "#3182CE",
  },
  emptyRightPanel: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  emptyRightPanelText: {
    color: "#718096",
    textAlign: "center",
  },
});

export default CategorySelector;
