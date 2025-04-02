import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appColorTheme } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { adminService } from '../../services/adminService';

const WoodworkerRegistrationManagement = () => {
  const navigation = useNavigation();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch danh sách đơn đăng ký
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await adminService.getWoodworkerRegistrations();
      setRegistrations(response.data || []);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn đăng ký');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Xử lý cập nhật trạng thái
  const handleUpdateStatus = async (woodworkerId, status) => {
    try {
      setRefreshing(true);
      await adminService.updateWoodworkerStatus(woodworkerId, status);
      Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn đăng ký');
      fetchRegistrations(); // Refresh danh sách
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn đăng ký');
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { flex: 0.8 }]}>Mã ĐK</Text>
      <Text style={[styles.headerCell, { flex: 1.2 }]}>Họ và tên</Text>
      <Text style={[styles.headerCell, { flex: 1.5 }]}>Email</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Số điện thoại</Text>
      <Text style={[styles.headerCell, { flex: 1.2 }]}>Tên xưởng mộc</Text>
      <Text style={[styles.headerCell, { flex: 0.8 }]}>Loại hình</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Trạng thái</Text>
      <Text style={[styles.headerCell, { flex: 1.2 }]}>Thao tác</Text>
    </View>
  );

  const TableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, { flex: 0.8 }]}>{item.id}</Text>
      <Text style={[styles.cell, { flex: 1.2 }]}>{item.fullName}</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>{item.email}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.phone}</Text>
      <Text style={[styles.cell, { flex: 1.2 }]}>{item.workshopName}</Text>
      <Text style={[styles.cell, { flex: 0.8 }]}>{item.type}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>
        <Text style={[
          styles.statusText,
          item.status === 'APPROVED' && styles.statusApproved,
          item.status === 'REJECTED' && styles.statusRejected,
          item.status === 'PENDING' && styles.statusPending
        ]}>
          {item.status === 'APPROVED' ? 'Đã duyệt' :
           item.status === 'REJECTED' ? 'Từ chối' :
           'Chờ duyệt'}
        </Text>
      </Text>
      <View style={[styles.cell, { flex: 1.2 }]}>
        <View style={styles.actionButtons}>
          {item.status === 'PENDING' && (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleUpdateStatus(item.id, 'APPROVED')}
                disabled={refreshing}
              >
                <Ionicons name="checkmark-outline" size={20} color={appColorTheme.white_0} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleUpdateStatus(item.id, 'REJECTED')}
                disabled={refreshing}
              >
                <Ionicons name="close-outline" size={20} color={appColorTheme.white_0} />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => {/* Xử lý xem chi tiết */}}
          >
            <Ionicons name="eye-outline" size={20} color={appColorTheme.brown_0} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={appColorTheme.brown_0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý đăng ký thợ mộc</Text>
      </View>

      {/* Loading indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColorTheme.brown_0} />
        </View>
      ) : (
        /* Table */
        <ScrollView 
          style={styles.tableContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
        >
          <View>
            <TableHeader />
            <ScrollView>
              {registrations.map((item, index) => (
                <TableRow key={item.id} item={item} />
              ))}
              {registrations.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Không có đơn đăng ký nào</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: appColorTheme.brown_0 + '20',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  headerCell: {
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
    fontSize: 14,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
    backgroundColor: appColorTheme.white_0,
  },
  cell: {
    fontSize: 14,
    color: appColorTheme.black_0,
    paddingHorizontal: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: appColorTheme.green,
  },
  rejectButton: {
    backgroundColor: appColorTheme.red,
  },
  viewButton: {
    backgroundColor: appColorTheme.brown_0 + '20',
  },
  statusText: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusApproved: {
    backgroundColor: appColorTheme.green + '20',
    color: appColorTheme.green,
  },
  statusRejected: {
    backgroundColor: appColorTheme.red + '20',
    color: appColorTheme.red,
  },
  statusPending: {
    backgroundColor: appColorTheme.yellow + '20',
    color: appColorTheme.yellow,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: appColorTheme.grey_1,
    fontSize: 16,
  },
});

export default WoodworkerRegistrationManagement; 