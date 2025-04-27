import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {
  appColorTheme,
  guaranteeOrderStatusConstants,
} from "../../../../config/appconfig";
import { useGetGuaranteeOrdersQuery } from "../../../../services/guaranteeOrderApi";
import useAuth from "../../../../hooks/useAuth";
import GuaranteeOrderCard from "./GuaranteeOrderCard";
import Pagination from "../../../../components/Utility/Pagination";
import { useNavigation } from "@react-navigation/native";

// Component to render guarantee order items (will be passed to Pagination)
const GuaranteeOrderListItems = ({ data, onViewDetails }) => {
  return (
    <View style={styles.listContainer}>
      {data.length > 0 ? (
        data.map((order) => (
          <GuaranteeOrderCard
            key={order.guaranteeOrderId}
            order={order}
            onViewDetails={onViewDetails}
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không có đơn hàng nào phù hợp với bộ lọc.
          </Text>
        </View>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get("window");

export default function GuaranteeOrderList() {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("orderIdDesc"); // Mặc định sắp xếp theo ID giảm dần
  const [filteredData, setFilteredData] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Get unique status values from the constants for the dropdown
  const statusValues = useMemo(() => {
    return Object.values(guaranteeOrderStatusConstants);
  }, []);

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useGetGuaranteeOrdersQuery(
    {
      id: auth?.userId,
      role: "Customer",
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // Set initial filtered data when API data is loaded
  useEffect(() => {
    if (apiResponse?.data) {
      // Mặc định sắp xếp theo ID giảm dần
      const sortedData = [...apiResponse.data].sort(
        (a, b) => b.guaranteeOrderId - a.guaranteeOrderId
      );
      setFilteredData(sortedData);
    }
  }, [apiResponse]);

  // Filter and sort data when filters or sort option changes
  useEffect(() => {
    if (!apiResponse?.data) return;

    let filtered = apiResponse.data;

    // Apply status filter if selected
    if (statusFilter !== "" && statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "orderIdAsc":
          return a.guaranteeOrderId - b.guaranteeOrderId;
        case "orderIdDesc":
        default:
          return b.guaranteeOrderId - a.guaranteeOrderId;
      }
    });

    setFilteredData(sorted);
  }, [statusFilter, sortOption, apiResponse]);

  const handleViewDetails = (orderId) => {
    navigation.navigate("CustomerGuaranteeOrderDetail", { id: orderId });
  };

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setStatusFilter("");
    setSortOption("orderIdDesc");
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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn bảo hành, sửa chữa</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={20} color="white" />
          <Text style={styles.filterButtonText}>Lọc</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Không có đơn hàng nào phù hợp với bộ lọc.
            </Text>
          </View>
        ) : (
          <Pagination
            dataList={filteredData}
            DisplayComponent={(props) => (
              <GuaranteeOrderListItems
                {...props}
                onViewDetails={handleViewDetails}
              />
            )}
            itemsPerPage={5}
          />
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bộ lọc đơn hàng</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
              {/* Trạng thái */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trạng thái:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={statusFilter}
                    onValueChange={(value) => setStatusFilter(value)}
                    style={styles.picker}
                    dropdownIconColor={appColorTheme.brown_2}
                    mode="dropdown"
                  >
                    <Picker.Item label="Tất cả trạng thái" value="All" />
                    {statusValues.map((status) => (
                      <Picker.Item key={status} label={status} value={status} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Sắp xếp */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sắp xếp theo:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={sortOption}
                    onValueChange={(value) => setSortOption(value)}
                    style={styles.picker}
                    dropdownIconColor={appColorTheme.brown_2}
                    mode="dropdown"
                  >
                    <Picker.Item label="Mã giảm dần" value="orderIdDesc" />
                    <Picker.Item label="Mã tăng dần" value="orderIdAsc" />
                  </Picker>
                </View>
              </View>
            </ScrollView>

            {/* Button footer */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Đặt lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Ionicons
                  name="filter"
                  size={20}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.applyButtonText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColorTheme.brown_2,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
  listContainer: {
    marginTop: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    maxHeight: height * 0.7,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
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
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: height * 0.5,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 5,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#EDF2F7",
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#4A5568",
    fontWeight: "600",
  },
  applyButton: {
    flex: 2,
    backgroundColor: appColorTheme.brown_2,
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
});
