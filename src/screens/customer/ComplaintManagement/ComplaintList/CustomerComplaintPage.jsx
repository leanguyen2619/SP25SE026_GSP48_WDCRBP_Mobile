import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
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
      { skip: !auth?.userId }
    );

  const complaints = data?.data || [];
  const serviceOrders = ordersData?.data || [];

  // Filtering states
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("complaintIdDesc");
  const [filteredComplaints, setFilteredComplaints] = useState([]);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Quản lý Khiếu nại</Text>
        <ComplaintCreateModal refetch={refetch} serviceOrders={serviceOrders} />
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Lọc theo trạng thái:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={statusFilter}
                onValueChange={(itemValue) => setStatusFilter(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Tất cả trạng thái" value="" />
                {statusValues.map((status) => (
                  <Picker.Item key={status} label={status} value={status} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sắp xếp theo:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sortOption}
                onValueChange={(itemValue) => setSortOption(itemValue)}
                style={styles.picker}
              >
                <Picker.Item
                  label="Mã khiếu nại giảm dần"
                  value="complaintIdDesc"
                />
                <Picker.Item
                  label="Mã khiếu nại tăng dần"
                  value="complaintIdAsc"
                />
              </Picker>
            </View>
          </View>
        </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
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
    marginBottom: 20,
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
  },
  filtersContainer: {
    marginBottom: 15,
  },
  filterGroup: {
    marginBottom: 10,
  },
  filterLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  picker: {
    height: 40,
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
});
