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
import ComplaintDetailModal from "../ActionModal/ComplaintDetailModal";
import { formatDateTimeString } from "../../../../utils/utils";
import { useGetUserComplaintsQuery } from "../../../../services/complaintApi";
import useAuth from "../../../../hooks/useAuth";
import Pagination from "../../../../components/Utility/Pagination";
import { Ionicons } from "@expo/vector-icons";
import WoodworkerLayout from "../../../../layouts/WoodworkerLayout";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

// Component to render complaint items (will be passed to Pagination)
const ComplaintListItems = ({ data, refetch }) => {
  return (
    <View style={styles.listContainer}>
      {data.length > 0 ? (
        data.map((complaint) => (
          <View key={complaint.complaintId} style={styles.complaintCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.complaintId}>
                Mã khiếu nại: {complaint.complaintId}
              </Text>
              <Text style={styles.status}>{complaint.status}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.label}>Mã đơn hàng:</Text>
              <Text style={styles.value}>
                {complaint.serviceOrderDetail?.orderId || "N/A"}
              </Text>
              <Text style={styles.label}>Khách hàng:</Text>
              <Text style={styles.value}>
                {complaint.serviceOrderDetail?.user?.username || "N/A"}
              </Text>
              <Text style={styles.label}>Loại khiếu nại:</Text>
              <Text style={styles.value}>{complaint.complaintType}</Text>
              <Text style={styles.label}>Ngày tạo:</Text>
              <Text style={styles.value}>
                {formatDateTimeString(new Date(complaint.createdAt))}
              </Text>
            </View>
            <View style={styles.cardFooter}>
              <ComplaintDetailModal complaint={complaint} refetch={refetch} />
            </View>
          </View>
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

export default function WWComplaintManagementPage() {
  const { auth } = useAuth();
  const { data, isLoading, isError, refetch } = useGetUserComplaintsQuery(
    auth?.userId,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Get unique status values from the constants for the dropdown
  const statusValues = useMemo(() => {
    return Object.values(complaintStatusConstants);
  }, []);

  // Set initial filtered data when API data is loaded
  useEffect(() => {
    if (data?.data) {
      const sortedData = data.data
        .map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))
        .sort((a, b) => b.complaintId - a.complaintId);
      setFilteredData(sortedData);
    }
  }, [data]);

  // Filter data when filters change
  useEffect(() => {
    if (!data?.data) return;

    let filtered = data.data.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));

    // Apply status filter if selected
    if (statusFilter !== "") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Sort by complaintId descending
    filtered.sort((a, b) => b.complaintId - a.complaintId);

    setFilteredData(filtered);
  }, [statusFilter, data]);

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setStatusFilter("");
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Đã xảy ra lỗi khi tải dữ liệu.</Text>
      </View>
    );
  }

  return (
    <WoodworkerLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Quản lý Khiếu nại</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={20} color="white" />
            <Text style={styles.filterButtonText}>Lọc</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentContainer}>
          <Pagination
            dataList={filteredData}
            DisplayComponent={(props) => (
              <ComplaintListItems {...props} refetch={refetch} />
            )}
            itemsPerPage={5}
          />
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
    </WoodworkerLayout>
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
  complaintCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  complaintId: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  status: {
    fontSize: 14,
    color: "#666",
  },
  cardContent: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
