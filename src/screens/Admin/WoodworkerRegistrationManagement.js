import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appColorTheme } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { adminService } from '../../services/adminService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WoodworkerRegistrationManagement = () => {
  const navigation = useNavigation();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Kiểm tra token và role
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userRole = await AsyncStorage.getItem('userRole');
      
      if (!token || userRole !== 'Admin') {
        Alert.alert('Lỗi', 'Bạn không có quyền truy cập trang này');
        navigation.replace('Login');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Check auth error:', error);
      return false;
    }
  };

  // Fetch danh sách đơn đăng ký
  const fetchRegistrations = async () => {
    try {
      const isAuth = await checkAuth();
      if (!isAuth) return;

      setLoading(true);
      const response = await adminService.getWoodworkerRegistrations();
      if (response?.data) {
        // Kiểm tra và lọc dữ liệu hợp lệ, loại bỏ trùng lặp
        const validRegistrations = response.data
          .filter(item => item && typeof item === 'object')
          .filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
          );
        setRegistrations(validRegistrations);
      }
    } catch (error) {
      console.error('Fetch registrations error:', error);
      if (error.response?.status === 401) {
        Alert.alert('Lỗi', 'Phiên đăng nhập đã hết hạn');
        navigation.replace('Login');
      } else {
        Alert.alert('Lỗi', 'Không thể tải danh sách đơn đăng ký');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRegistrations();
  };

  const renderRegistrationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('WoodworkerRegistrationDetail', { registration: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardId}>Mã thợ mộc: {item.id || 'Không có'}</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'APPROVED' && styles.statusApproved,
            item.status === 'REJECTED' && styles.statusRejected,
            item.status === 'PENDING' && styles.statusPending
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'APPROVED' && styles.statusApprovedText,
              item.status === 'REJECTED' && styles.statusRejectedText,
              item.status === 'PENDING' && styles.statusPendingText
            ]}>
              {item.status === 'APPROVED' ? 'Đã duyệt' :
               item.status === 'REJECTED' ? 'Từ chối' :
               'Chờ duyệt'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={appColorTheme.grey_1} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={16} color={appColorTheme.grey_0} />
            <Text style={styles.infoText}>{item.fullName || 'Không có'}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={16} color={appColorTheme.grey_0} />
            <Text style={styles.infoText}>{item.email || 'Không có'}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={16} color={appColorTheme.grey_0} />
            <Text style={styles.infoText}>{item.phone || 'Không có'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
        <View style={styles.headerRight} />
      </View>

      {/* List */}
      <FlatList
        data={registrations}
        renderItem={renderRegistrationItem}
        keyExtractor={item => `registration-${item?.id || Math.random().toString()}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColorTheme.brown_0]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={appColorTheme.grey_1} />
              <Text style={styles.emptyText}>Không có đơn đăng ký nào</Text>
            </View>
          )
        }
      />

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColorTheme.brown_0} />
        </View>
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
    backgroundColor: appColorTheme.white_0,
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: appColorTheme.white_0,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: appColorTheme.grey_1 + '20',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1 + '20',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardId: {
    fontSize: 14,
    fontWeight: '600',
    color: appColorTheme.brown_0,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusApproved: {
    backgroundColor: appColorTheme.green + '20',
  },
  statusRejected: {
    backgroundColor: appColorTheme.red + '20',
  },
  statusPending: {
    backgroundColor: appColorTheme.yellow + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusApprovedText: {
    color: appColorTheme.green,
  },
  statusRejectedText: {
    color: appColorTheme.red,
  },
  statusPendingText: {
    color: appColorTheme.yellow,
  },
  cardBody: {
    padding: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 4,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    flexWrap: 'wrap',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: appColorTheme.black_0,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: appColorTheme.grey_1,
  },
});

export default WoodworkerRegistrationManagement; 