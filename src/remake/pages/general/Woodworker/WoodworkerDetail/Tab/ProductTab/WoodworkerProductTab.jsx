import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useGetProductsByWoodworkerIdQuery } from "../../../../../../services/productApi.js";
import ProductList from "./ProductList.jsx";
import FiltersComponent from "./FiltersComponent.jsx";
import { appColorTheme } from "../../../../../../config/appconfig.js";

export default function WoodworkerProductTab() {
  const route = useRoute();
  const id = route.params?.id;

  const {
    data: response,
    isLoading,
    error,
  } = useGetProductsByWoodworkerIdQuery(id);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Set initial data when API response changes
  useEffect(() => {
    if (response?.data) {
      setFilteredProducts(response.data);
    }
  }, [response?.data]);

  // Handler for filter changes
  const handleFilterChange = (newFilters) => {
    if (!response?.data) return;

    let result = response.data;

    // Chỉ áp dụng filter nếu checkbox được chọn
    if (newFilters?.applyFilters) {
      // Lọc theo danh mục
      if (newFilters.categoryId) {
        result = result.filter(
          (product) =>
            product.categoryId === newFilters.categoryId ||
            // Assuming there might be a parent category relationship
            product.category?.parentId === newFilters.categoryId
        );
      }

      // Lọc theo giá
      if (newFilters.priceRange && newFilters.priceRange.length === 2) {
        result = result.filter(
          (product) =>
            product.price >= newFilters.priceRange[0] &&
            product.price <= newFilters.priceRange[1]
        );
      }

      // Lọc theo rating
      if (newFilters.ratingRange) {
        result = result.filter((product) => {
          const rating = product.totalReviews
            ? product.totalStar / product.totalReviews
            : 0;
          return (
            rating >= newFilters.ratingRange[0] &&
            rating <= newFilters.ratingRange[1]
          );
        });
      }
    }

    // Lọc theo từ khóa tìm kiếm
    if (newFilters?.applySearch && newFilters.searchTerm) {
      const searchLower = newFilters.searchTerm.toLowerCase();
      result = result.filter((product) =>
        product.productName.toLowerCase().includes(searchLower)
      );
    }

    // Sắp xếp
    if (newFilters?.sortBy) {
      result = [...result].sort((a, b) => {
        const ratingA = a.totalReviews ? a.totalStar / a.totalReviews : 0;
        const ratingB = b.totalReviews ? b.totalStar / b.totalReviews : 0;

        switch (newFilters.sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "rating-asc":
            return ratingA - ratingB;
          case "rating-desc":
            return ratingB - ratingA;
          case "name-asc":
            return a.productName.localeCompare(b.productName);
          case "name-desc":
            return b.productName.localeCompare(a.productName);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(result);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsFilterVisible(true)}
      >
        <Ionicons name="filter" size={20} color="white" />
        <Text style={styles.filterButtonText}>Bộ lọc</Text>
      </TouchableOpacity>

      <ProductList
        products={filteredProducts}
        isLoading={isLoading}
        error={error}
      />

      <FiltersComponent
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onFilterChange={handleFilterChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColorTheme.brown_2,
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
});
