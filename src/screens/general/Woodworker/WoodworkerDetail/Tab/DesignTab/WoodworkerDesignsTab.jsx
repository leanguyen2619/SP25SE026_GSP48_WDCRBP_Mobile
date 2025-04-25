import React, { useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import FiltersComponent from "./FiltersComponent";
import DesignList from "./DesignList";
import { useGetAllDesignIdeasByWoodworkerQuery } from "../../../../../../services/designIdeaApi";
import { appColorTheme } from "../../../../../../config/appconfig";

export default function WoodworkerDesignsTab({ woodworkerId }) {
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const { data: response } =
    useGetAllDesignIdeasByWoodworkerQuery(woodworkerId);

  const handleFilterChange = (newFilters) => {
    if (!response?.data) return;

    let result = response.data;

    // Chỉ áp dụng filter nếu checkbox được chọn
    if (newFilters?.applyFilters) {
      // Lọc theo danh mục
      if (newFilters.categoryId) {
        result = result.filter(
          (design) =>
            design.category?.categoryId === newFilters.categoryId ||
            design.category?.parentId === newFilters.categoryId
        );
      }

      // Lọc theo rating
      if (newFilters.ratingRange) {
        result = result.filter((design) => {
          const rating = design.totalReviews
            ? design.totalStar / design.totalReviews
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
      result = result.filter((design) =>
        design.name.toLowerCase().includes(searchLower)
      );
    }

    // Sắp xếp
    if (newFilters?.sortBy) {
      result = [...result].sort((a, b) => {
        const ratingA = a.totalReviews ? a.totalStar / a.totalReviews : 0;
        const ratingB = b.totalReviews ? b.totalStar / b.totalReviews : 0;

        switch (newFilters.sortBy) {
          case "rating-asc":
            return ratingA - ratingB;
          case "rating-desc":
            return ratingB - ratingA;
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    setFilteredDesigns(result);
  };

  // Set initial data
  useMemo(() => {
    if (response?.data) {
      setFilteredDesigns(response.data);
    }
  }, [response?.data]);

  const toggleFilterModal = useCallback(() => {
    setFilterModalVisible(!filterModalVisible);
  }, [filterModalVisible]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thiết kế từ xưởng mộc này</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleFilterModal}
        >
          <Ionicons name="filter" size={20} color="white" />
          <Text style={styles.filterButtonText}>Lọc</Text>
        </TouchableOpacity>
      </View>

      <DesignList designs={filteredDesigns} />

      <FiltersComponent
        visible={filterModalVisible}
        onClose={toggleFilterModal}
        onFilterChange={handleFilterChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  filterButton: {
    flexDirection: "row",
    backgroundColor: appColorTheme.brown_2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "500",
  },
});
