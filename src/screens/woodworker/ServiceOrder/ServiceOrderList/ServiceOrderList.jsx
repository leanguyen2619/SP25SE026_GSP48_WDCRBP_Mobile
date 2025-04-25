import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
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
import { formatPrice } from "../../../../utils/utils";

// Map between display values and API values for service types
const serviceTypeMap = {
  "Tùy chỉnh": "Customization",
  "Cá nhân hóa": "Personalization",
  "Mua hàng": "Sale",
};

// Reverse lookup for display names
const getServiceTypeDisplayName = (apiValue) => {
  for (const [display, api] of Object.entries(serviceTypeMap)) {
    if (api === apiValue) return display;
  }
  return apiValue;
};

const { width, height } = Dimensions.get("window");

export default function ServiceOrderList() {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Get unique status values from the constants for the dropdown
  const statusValues = useMemo(() => {
    return Object.values(serviceOrderStatusConstants);
  }, []);

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useGetServiceOrdersQuery({
    id: auth?.wwId,
    role: "Woodworker",
  });

  // Set initial filtered data when API data is loaded
  useEffect(() => {
    if (apiResponse?.data) {
      setFilteredData(apiResponse.data);
    }
  }, [apiResponse]);

  // Filter data when filters change
  useEffect(() => {
    if (!apiResponse?.data) return;

    let filtered = [...apiResponse.data];

    console.log("statusFilter:", statusFilter);
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

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, serviceTypeFilter, apiResponse]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setStatusFilter("");
    setServiceTypeFilter("");
  };

  const renderItem = ({ item }) => {
    const needsResponse = item?.role === "Woodworker";
    const serviceName = item.service?.service?.serviceName || "N/A";
    const displayServiceName = getServiceTypeDisplayName(serviceName);

    return (
      <View style={styles.listItem}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>Mã đơn hàng:</Text>
            <Text style={styles.cellValue}>{item.orderId}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>Loại dịch vụ:</Text>
            <Text style={styles.cellValue}>{displayServiceName}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>Tổng tiền:</Text>
            <Text style={styles.cellValue}>
              {!item.totalAmount
                ? "Chưa cập nhật"
                : formatPrice(item.totalAmount)}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>SĐT k.hàng:</Text>
            <Text style={styles.cellValue}>{item.user?.phone || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>Trạng thái:</Text>
            <Text style={styles.cellValue}>{item.status}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>Cần lắp đặt:</Text>
            <Text style={styles.cellValue}>
              {item.install ? "Có" : "Không"}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>Cần phản hồi?:</Text>
            <Text
              style={[
                needsResponse ? styles.responseNeeded : styles.responseWaiting,
              ]}
            >
              {needsResponse
                ? "Cần bạn phản hồi"
                : "Chờ phản hồi từ khách hàng"}
            </Text>
          </View>
          <View style={styles.cell}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() =>
                navigation.navigate("WWServiceOrderDetail", {
                  orderId: item.orderId,
                })
              }
            >
              <Ionicons name="eye-outline" size={18} color="white" />
              <Text style={styles.viewButtonText}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage(currentPage - 1)}
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledButton,
          ]}
        >
          <Text style={styles.paginationButtonText}>Trước</Text>
        </TouchableOpacity>

        <Text style={styles.paginationText}>
          Trang {currentPage} / {totalPages || 1}
        </Text>

        <TouchableOpacity
          disabled={currentPage === totalPages || totalPages === 0}
          onPress={() => setCurrentPage(currentPage + 1)}
          style={[
            styles.paginationButton,
            (currentPage === totalPages || totalPages === 0) &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.paginationButtonText}>Sau</Text>
        </TouchableOpacity>
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

      <FlatList
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.orderId.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
          </View>
        }
      />

      {renderPagination()}

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
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  listContainer: {
    padding: 10,
  },
  listItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cell: {
    flex: 1,
  },
  cellLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  cellValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  responseNeeded: {
    color: "green",
    fontWeight: "bold",
  },
  responseWaiting: {
    color: "#666",
  },
  viewButton: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  viewButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  paginationButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  paginationText: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
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
