import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useMemo, useEffect } from "react";
import {
  appColorTheme,
  complaintStatusConstants,
} from "../../../../config/appconfig";
import ComplaintCreateModal from "../ActionModal/ComplaintCreateModal";
import { useGetUserComplaintsQuery } from "../../../../services/complaintApi";
import useAuth from "../../../../hooks/useAuth";
import { useGetServiceOrdersQuery } from "../../../../services/serviceOrderApi";
import Pagination from "../../../../components/Utility/Pagination";
import ComplaintCard from "./ComplaintCard";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import CustomerLayout from "../../../../layouts/CustomerLayout";

const { width, height } = Dimensions.get("window");

// Component to render complaint items (will be passed to Pagination)
const ComplaintListItems = ({ data, refetch }) => {
  return (
    <View style={styles.listContainer}>
      {data.length > 0 ? (
        data.map((complaint) => (
          <ComplaintCard
            key={complaint.complaintId}
            complaint={complaint}
            refetch={refetch}
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không có khiếu nại nào phù hợp với bộ lọc.
          </Text>
        </View>
      )}
    </View>
  );
};

export default function CustomerComplaintPage() {
  const { auth } = useAuth();
  const { data, isLoading, isError, refetch } = useGetUserComplaintsQuery(
    auth?.userId
  );

  // Get service orders for the user
  const { data: ordersData, isLoading: isLoadingOrders } =
    useGetServiceOrdersQuery(
      {
        id: auth?.userId,
        role: "Customer",
      },
      {
        skip: !auth?.userId,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
      }
    );

  const complaints = data?.data || [];
  const serviceOrders = ordersData?.data || [];

  // Filtering states
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("complaintIdDesc");
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Get status values from constants for the dropdown
  const statusValues = useMemo(() => {
    return Object.values(complaintStatusConstants);
  }, []);

  // Apply filters and sorting when necessary
  useEffect(() => {
    if (!complaints) return;

    let filtered = [...complaints];

    // Apply status filter if selected
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "complaintIdAsc":
          return a.complaintId - b.complaintId;
        case "complaintIdDesc":
        default:
          return b.complaintId - a.complaintId;
      }
    });

    setFilteredComplaints(sorted);
  }, [complaints, statusFilter, sortOption]);

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setStatusFilter("");
    setSortOption("complaintIdDesc");
  };

  // Show loading state
  if (isLoading || isLoadingOrders) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  // Show error state
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Đã xảy ra lỗi khi tải dữ liệu.</Text>
      </View>
    );
  }

  return (
    <CustomerLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Quản lý Khiếu nại</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="filter" size={20} color="white" />
              <Text style={styles.filterButtonText}>Lọc</Text>
            </TouchableOpacity>
            <ComplaintCreateModal
              refetch={refetch}
              serviceOrders={serviceOrders}
            />
          </View>
        </View>

        <ScrollView style={styles.contentContainer}>
          {filteredComplaints.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Không có khiếu nại nào phù hợp với bộ lọc.
              </Text>
            </View>
          ) : (
            <Pagination
              dataList={filteredComplaints}
              DisplayComponent={(props) => (
                <ComplaintListItems {...props} refetch={refetch} />
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
                <Text style={styles.modalTitle}>Bộ lọc khiếu nại</Text>
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
                      <Picker.Item label="Tất cả trạng thái" value="" />
                      {statusValues.map((status) => (
                        <Picker.Item
                          key={status}
                          label={status}
                          value={status}
                        />
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
                      <Picker.Item
                        label="Mã giảm dần"
                        value="complaintIdDesc"
                      />
                      <Picker.Item label="Mã tăng dần" value="complaintIdAsc" />
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
      </SafeAreaView>
    </CustomerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    marginTop: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
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
