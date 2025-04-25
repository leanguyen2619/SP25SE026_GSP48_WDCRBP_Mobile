import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import {
  appColorTheme,
  serviceOrderStatusConstants,
} from "../../../../config/appconfig";
import { useNavigation } from "@react-navigation/native";
import { useGetServiceOrdersQuery } from "../../../../services/serviceOrderApi";
import useAuth from "../../../../hooks/useAuth";
import ServiceOrderCard from "./ServiceOrderCard";
import Pagination from "../../../../components/Utility/Pagination";

// Map between display values and API values for service types
const serviceTypeMap = {
  "Tùy chỉnh": "Customization",
  "Cá nhân hóa": "Personalization",
  "Mua hàng": "Sale",
};

const { width, height } = Dimensions.get("window");

export default function ServiceOrderList() {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [sortOption, setSortOption] = useState("orderIdDesc");
  const [filteredData, setFilteredData] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Get unique status values from the constants for the dropdown
  const statusValues = useMemo(() => {
    return Object.values(serviceOrderStatusConstants);
  }, []);

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useGetServiceOrdersQuery(
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
      setFilteredData(apiResponse.data);
    }
  }, [apiResponse]);

  // Filter and sort data when filters or sort option changes
  useEffect(() => {
    if (!apiResponse?.data) return;

    let filtered = apiResponse.data;

    // Apply status filter if selected
    if (statusFilter && statusFilter !== "" && statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply service type filter if selected
    if (
      serviceTypeFilter &&
      serviceTypeFilter !== "" &&
      serviceTypeFilter !== "All"
    ) {
      const apiServiceType = serviceTypeMap[serviceTypeFilter];
      filtered = filtered.filter(
        (item) => item.service?.service?.serviceName === apiServiceType
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "orderIdAsc":
          return a.orderId - b.orderId;
        case "orderIdDesc":
          return b.orderId - a.orderId;
        default:
          return b.orderId - a.orderId;
      }
    });

    setFilteredData(sorted);
  }, [statusFilter, serviceTypeFilter, sortOption, apiResponse]);

  const handleViewDetails = (orderId) => {
    navigation.navigate("CustomerServiceOrderDetail", { orderId });
  };

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setStatusFilter("");
    setServiceTypeFilter("");
  };

  // Component hiển thị danh sách đơn hàng cho pagination
  const OrderList = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không có đơn hàng nào phù hợp với bộ lọc.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.orderListContainer}>
        {data.map((item) => (
          <ServiceOrderCard
            key={item.orderId}
            order={item}
            onViewDetails={handleViewDetails}
          />
        ))}
      </View>
    );
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
        <Text style={styles.headerTitle}>Danh sách đơn hàng</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={20} color="white" />
          <Text style={styles.filterButtonText}>Lọc</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {filteredData.length > 0 ? (
          <Pagination
            dataList={filteredData}
            DisplayComponent={OrderList}
            itemsPerPage={4}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Không có đơn hàng nào phù hợp với bộ lọc.
            </Text>
          </View>
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
              {/* Loại dịch vụ */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Loại dịch vụ:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={serviceTypeFilter}
                    onValueChange={(value) => setServiceTypeFilter(value)}
                    style={styles.picker}
                    dropdownIconColor={appColorTheme.brown_2}
                    mode="dropdown"
                  >
                    <Picker.Item label="Tất cả dịch vụ" value="All" />
                    <Picker.Item label="Tùy chỉnh" value="Tùy chỉnh" />
                    <Picker.Item label="Cá nhân hóa" value="Cá nhân hóa" />
                    <Picker.Item label="Mua hàng" value="Mua hàng" />
                  </Picker>
                </View>
              </View>

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
  orderListContainer: {
    width: "100%",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
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
