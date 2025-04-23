import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Picker } from '@react-native-picker/picker';
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

// Component to render order items (will be passed to Pagination)
const ServiceOrderListItems = ({ data, onViewDetails }) => {
  return (
    <View style={styles.list}>
      {data.length > 0 ? (
        data.map((order) => (
          <ServiceOrderCard
            key={order.orderId}
            order={order}
            onViewDetails={onViewDetails}
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có đơn hàng nào phù hợp với bộ lọc.</Text>
        </View>
      )}
    </View>
  );
};

export default function ServiceOrderList() {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [sortOption, setSortOption] = useState("orderIdDesc");
  const [filteredData, setFilteredData] = useState([]);

  // Get unique status values from the constants for the dropdown
  const statusValues = useMemo(() => {
    return Object.values(serviceOrderStatusConstants);
  }, []);

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useGetServiceOrdersQuery({
    id: auth?.userId,
    role: "Customer",
  });

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
    if (statusFilter !== "") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply service type filter if selected
    if (serviceTypeFilter !== "") {
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
    navigation.navigate('ServiceOrderDetail', { orderId });
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
      <ScrollView style={styles.filterContainer} horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Loại dịch vụ:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={serviceTypeFilter}
              style={styles.picker}
              onValueChange={(itemValue) => setServiceTypeFilter(itemValue)}
            >
              <Picker.Item label="Tất cả dịch vụ" value="" />
              <Picker.Item label="Tùy chỉnh" value="Tùy chỉnh" />
              <Picker.Item label="Cá nhân hóa" value="Cá nhân hóa" />
              <Picker.Item label="Mua hàng" value="Mua hàng" />
            </Picker>
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Trạng thái:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={statusFilter}
              style={styles.picker}
              onValueChange={(itemValue) => setStatusFilter(itemValue)}
            >
              <Picker.Item label="Tất cả trạng thái" value="" />
              {statusValues.map((status) => (
                <Picker.Item key={status} label={status} value={status} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Sắp xếp theo:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sortOption}
              style={styles.picker}
              onValueChange={(itemValue) => setSortOption(itemValue)}
            >
              <Picker.Item label="Mã giảm dần" value="orderIdDesc" />
              <Picker.Item label="Mã tăng dần" value="orderIdAsc" />
            </Picker>
          </View>
        </View>
      </ScrollView>

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={({ item }) => (
            <ServiceOrderCard
              order={item}
              onViewDetails={handleViewDetails}
            />
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có đơn hàng nào phù hợp với bộ lọc.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7FAFC',
    marginBottom: 16,
  },
  filterSection: {
    marginRight: 16,
    minWidth: 180,
  },
  filterLabel: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#4A5568',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: 200,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  }
});
