import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RootLayout from "../../../../layouts/RootLayout";
import FiltersComponent from "./FiltersComponent";
import WoodworkerList from "./WoodworkerList";
import { appColorTheme } from "../../../../config/appconfig";
import { useListWoodworkersQuery } from "../../../../services/woodworkerApi";

export default function WoodworkersPage() {
  const { data: response, isLoading } = useListWoodworkersQuery();
  const [wws, setWws] = useState([]);
  const [filteredWoodworkers, setFilteredWoodworkers] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const handleFilterChange = (newFilters) => {
    if (!wws) return;

    let result = wws;

    // Chỉ áp dụng filter nếu checkbox được chọn
    if (newFilters?.applyFilters) {
      // Lọc theo tỉnh thành
      if (newFilters.province) {
        result = result.filter((ww) => {
          return ww?.cityId == newFilters.province;
        });
      }

      // Lọc theo loại xưởng (gói dịch vụ)
      if (newFilters.workshopType) {
        result = result.filter((ww) => {
          return ww.servicePack?.name === newFilters.workshopType;
        });
      }

      // Lọc theo rating
      if (newFilters.ratingRange) {
        result = result.filter((ww) => {
          const rating = ww.totalReviews ? ww.totalStar / ww.totalReviews : 0;

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
      result = result.filter((ww) =>
        ww.brandName.toLowerCase().includes(searchLower)
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
            return a.brandName.localeCompare(b.brandName);
          case "name-desc":
            return b.brandName.localeCompare(a.brandName);
          default:
            return 0;
        }
      });
    }

    setFilteredWoodworkers(result);
  };

  // Set initial data
  useMemo(() => {
    if (response?.data) {
      const data = response.data.filter((item) => {
        const publicStatus = item?.publicStatus;

        return publicStatus;
      });

      setWws(data);
      setFilteredWoodworkers(data);
    }
  }, [response?.data]);

  const toggleFilterModal = useCallback(() => {
    setFilterModalVisible(!filterModalVisible);
  }, [filterModalVisible]);

  if (isLoading) {
    return (
      <RootLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColorTheme.brown_2} />
          <Text style={styles.loadingText}>
            Đang tải danh sách xưởng mộc...
          </Text>
        </View>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh sách xưởng mộc</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={toggleFilterModal}
          >
            <Ionicons name="filter" size={20} color="white" />
            <Text style={styles.filterButtonText}>Lọc</Text>
          </TouchableOpacity>
        </View>

        <WoodworkerList woodworkers={filteredWoodworkers} />

        <FiltersComponent
          visible={filterModalVisible}
          onClose={toggleFilterModal}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#4A5568",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
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
