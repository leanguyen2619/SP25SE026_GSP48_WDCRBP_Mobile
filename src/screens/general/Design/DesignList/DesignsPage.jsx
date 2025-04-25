import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FiltersComponent from "./FiltersComponent.jsx";
import DesignList from "./DesignList.jsx";
import RootLayout from "../../../../layouts/RootLayout.jsx";
import { appColorTheme } from "../../../../config/appconfig.js";
import { useGetAllDesignIdeasQuery } from "../../../../services/designIdeaApi";
import { Ionicons } from "@expo/vector-icons";

export default function DesignsPage() {
  const { data: response } = useGetAllDesignIdeasQuery();
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const handleFilterChange = (newFilters) => {
    if (!designs) return;

    let result = designs;

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

      // Lọc theo tỉnh thành
      if (newFilters.province) {
        result = result.filter(
          (design) => design.woodworkerProfile?.cityId == newFilters.province
        );
      }

      // Lọc theo loại xưởng (gói dịch vụ)
      if (newFilters.workshopType) {
        result = result.filter(
          (design) =>
            design.woodworkerProfile?.servicePack?.name ===
            newFilters.workshopType
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
  useEffect(() => {
    if (response?.data) {
      const data = response.data.filter((design) => {
        const isVisible =
          design?.woodworkerProfile?.servicePackEndDate &&
          Date.now() <=
            new Date(design?.woodworkerProfile?.servicePackEndDate).getTime() &&
          design?.woodworkerProfile?.publicStatus == true;

        return isVisible;
      });

      setDesigns(data);
      setFilteredDesigns(data);
    }
  }, [response?.data]);

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <RootLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh sách thiết kế</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={toggleFilterVisibility}
          >
            <Ionicons name="filter" size={22} color={appColorTheme.brown_2} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.designListContainer}>
            <DesignList designs={filteredDesigns} />
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
  designListContainer: {
    flex: 1,
  },
});
