import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FiltersComponent from "./FiltersComponent.jsx";
import ProductList from "./ProductList.jsx";
import RootLayout from "../../../../layouts/RootLayout.jsx";
import {
  appColorTheme,
  servicePackNameConstants,
} from "../../../../config/appconfig.js";
import { useGetAllProductsQuery } from "../../../../services/productApi";
import { Ionicons } from "@expo/vector-icons";

export default function ProductsPage() {
  const { data: response, isLoading, error } = useGetAllProductsQuery();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Set initial data when API response changes
  useEffect(() => {
    if (response?.data) {
      const data = response.data.filter((product) => {
        const isVisible =
          product?.servicePackEndDate &&
          Date.now() <= new Date(product.servicePackEndDate).getTime() &&
          product?.packType !== servicePackNameConstants.BRONZE &&
          product.isWoodworkerProfilePublic == true;

        return isVisible;
      });

      setProducts(data);
      setFilteredProducts(data);
    }
  }, [response?.data]);

  // Handler for filter changes
  const handleFilterChange = (newFilters) => {
    if (!products) return;

    let result = products;

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

      // Lọc theo tỉnh thành
      if (newFilters.province) {
        result = result.filter(
          (product) => product.cityId == newFilters.province
        );
      }

      // Lọc theo loại xưởng (gói dịch vụ)
      if (newFilters.workshopType) {
        result = result.filter(
          (product) => product.packType === newFilters.workshopType
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

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <RootLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh sách sản phẩm</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={toggleFilterVisibility}
          >
            <Ionicons name="filter" size={22} color={appColorTheme.brown_2} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.productListContainer}>
            <ProductList
              products={filteredProducts}
              isLoading={isLoading}
              error={error}
            />
          </View>
        </View>

        {/* Filter Modal */}
        <FiltersComponent
          visible={isFilterVisible}
          onClose={toggleFilterVisibility}
          onFilterChange={handleFilterChange}
        />
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  filterButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  productListContainer: {
    flex: 1,
  },
});
