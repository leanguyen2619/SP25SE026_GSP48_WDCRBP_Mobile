import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Footer from '../../components/common/footer/footer';
import AddAddressModal from '../../components/common/modals/AddAddressModal';

import { fetchUserById } from '../../redux/slice/userSlice';
import {
  fetchUserAddresses,
  deleteUserAddress,
} from '../../redux/slice/userAddressSlice';
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  clearLocationData,
} from '../../redux/slice/ghnSlice'; // ✅ USING GHN API here

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { userId, signOut } = useAuth();

  const { profile, loading, error } = useSelector((state) => state.user);
  const { list: addresses } = useSelector((state) => state.userAddress);
  const { provinces, districts, wards } = useSelector((state) => state.ghn);

  const [showEmail, setShowEmail] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchUserAddresses(userId));
      dispatch(fetchProvinces());
    }
  }, [dispatch, userId]);

  // Log kiểm tra addresses khi có dữ liệu mới
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      console.log('All addresses:', addresses);
      console.log('Default address:', addresses.find(addr => addr.is_default === 1));
    }
  }, [addresses]);

  // Fetch districts and wards when addresses change
  useEffect(() => {
    if (!addresses || addresses.length === 0) return;

    // Clear existing data
    dispatch(clearLocationData());

    // Fetch new data for each address
    const fetchLocationData = async () => {
      try {
        for (const addr of addresses) {
          if (addr.cityId) {
            await dispatch(fetchDistricts(parseInt(addr.cityId))).unwrap();
          }
          if (addr.districtId) {
            await dispatch(fetchWards(parseInt(addr.districtId))).unwrap();
          }
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchLocationData();
  }, [addresses, dispatch]);

  const handleDeleteAddress = async (id) => {
    try {
      console.log('Raw address ID:', id);
      console.log('All addresses:', addresses);
      
      // Tìm địa chỉ cần xóa
      const addressToDelete = addresses.find(addr => addr.userAddressId === id);
      console.log('Found address to delete:', addressToDelete);

      if (!addressToDelete) {
        console.error('Address not found with ID:', id);
        Alert.alert('Lỗi', 'Không tìm thấy địa chỉ để xóa');
        return;
      }

      // Xác nhận trước khi xóa
      Alert.alert(
        'Xác nhận xóa',
        'Bạn có chắc chắn muốn xóa địa chỉ này không?',
        [
          {
            text: 'Hủy',
            style: 'cancel'
          },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: async () => {
              try {
                const result = await dispatch(deleteUserAddress(addressToDelete.userAddressId)).unwrap();
                console.log('Delete result:', result);
                
                if (result) {
                  dispatch(fetchUserAddresses(userId));
                  Alert.alert('Thành công', 'Đã xóa địa chỉ thành công');
                }
              } catch (error) {
                console.error('Error in delete confirmation:', error);
                Alert.alert(
                  'Lỗi',
                  'Không thể xóa địa chỉ. Vui lòng thử lại sau.'
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in handleDeleteAddress:', error);
      Alert.alert(
        'Lỗi',
        'Không thể xử lý yêu cầu xóa địa chỉ. Vui lòng thử lại sau.'
      );
    }
  };

  const handleAddressAdded = () => {
    dispatch(fetchUserAddresses(userId));
    setModalVisible(false);
  };

  const getLocationName = (type, id) => {
    if (!id) {
      console.log(`No ${type} ID provided`);
      return '';
    }
    
    try {
      switch (type) {
        case 'province':
          const provinceId = parseInt(id);
          const province = provinces.find(p => p.ProvinceID === provinceId);
          console.log('Finding province:', { provinceId, found: province?.ProvinceName });
          return province?.ProvinceName || '';
        
        case 'district':
          const districtId = parseInt(id);
          let district = null;
          // Tìm trong tất cả các districts
          for (const districtList of Object.values(districts)) {
            if (!Array.isArray(districtList)) continue;
            district = districtList.find(d => d.DistrictID === districtId);
            if (district) break;
          }
          console.log('Finding district:', { districtId, found: district?.DistrictName });
          return district?.DistrictName || '';
        
        case 'ward':
          const wardId = id.toString();
          let ward = null;
          // Tìm trong tất cả các wards
          for (const wardList of Object.values(wards)) {
            if (!Array.isArray(wardList)) continue;
            ward = wardList.find(w => w.WardCode === wardId);
            if (ward) break;
          }
          console.log('Finding ward:', { wardId, found: ward?.WardName });
          return ward?.WardName || '';
        
        default:
          return '';
      }
    } catch (error) {
      console.error('Error in getLocationName:', { type, id, error });
      return '';
    }
  };

  const getFullAddress = (addr) => {
    if (!addr) return 'Đang cập nhật...';

    console.log('Getting full address for:', addr);
    
    const addressParts = [
      addr.address,
      getLocationName('ward', addr.wardCode),
      getLocationName('district', addr.districtId),
      getLocationName('province', addr.cityId)
    ].filter(Boolean);

    const fullAddress = addressParts.join(', ');
    console.log('Full address:', fullAddress);
    return fullAddress || 'Đang cập nhật...';
  };

  const renderAddresses = () => {
    if (!addresses || addresses.length === 0) {
      return <Text style={styles.noAddressText}>Chưa có địa chỉ nào.</Text>;
    }

    console.log('All addresses before render:', JSON.stringify(addresses, null, 2));

    // Sắp xếp địa chỉ: địa chỉ mặc định lên đầu
    const sortedAddresses = [...addresses].sort((a, b) => {
      console.log('Comparing addresses:', {
        a: { id: a.userAddressId, is_default: a.is_default },
        b: { id: b.userAddressId, is_default: b.is_default }
      });
      return b.is_default - a.is_default;
    });

    return (
      <View style={styles.addressList}>
        {sortedAddresses.map((addr) => {
          console.log('Rendering address:', {
            id: addr.userAddressId,
            is_default: addr.is_default,
            type: typeof addr.is_default
          });
          
          const isDefault = addr.is_default === 1 || addr.is_default === true || addr.is_default === "1";
          
          return (
            <View key={addr.userAddressId} style={[
              styles.addressRow,
              isDefault && { backgroundColor: '#F5F5F5' }
            ]}>
              <View style={styles.addressContent}>
                {isDefault && (
                  <View style={styles.defaultBadgeContainer}>
                    <Text style={styles.defaultBadge}>Mặc định</Text>
                  </View>
                )}
                <Text style={styles.addressText}>{getFullAddress(addr)}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleDeleteAddress(addr.userAddressId)}
                style={styles.deleteButton}
              >
                <Ionicons name="remove-circle-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Lỗi: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../../assets/avatar-placeholder.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile?.username}</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoItem label="Tên" value={profile?.username} />
          <InfoItem
            label="Email"
            value={showEmail ? profile?.email : '••••••••'}
            secure={!showEmail}
            onToggle={() => setShowEmail(!showEmail)}
          />
          <InfoItem label="Điện thoại" value={profile?.phone} />

          <View style={styles.addressHeader}>
            <Text style={styles.subTitle}>Địa chỉ</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#28a745" />
            </TouchableOpacity>
          </View>

          {renderAddresses()}
        </View>

        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.logoutItem}
            onPress={() => {
              signOut();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }}
          >
            <View style={styles.settingsLeft}>
              <Ionicons name="log-out-outline" size={20} color="red" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AddAddressModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        userId={userId}
        onSuccess={handleAddressAdded}
      />
      <Footer navigation={navigation} />
    </View>
  );
};

const InfoItem = ({ label, value, secure = false, onToggle }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoValueRow}>
      <Text style={styles.infoValue}>{value}</Text>
      {onToggle && (
        <TouchableOpacity onPress={onToggle}>
          <Ionicons
            name={secure ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="#888"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  screenWrapper: { flex: 1, backgroundColor: '#f4f8ff' },
  container: { padding: 20, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', fontSize: 16 },

  avatarContainer: { alignItems: 'center', marginVertical: 20 },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: '#fff', backgroundColor: '#ddd',
  },
  name: { fontSize: 20, fontWeight: 'bold', color: '#222', marginTop: 8 },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 10,
  },

  infoItem: { marginBottom: 16 },
  infoLabel: { fontSize: 12, fontWeight: '500', color: '#aaa', marginBottom: 2 },
  infoValueRow: { flexDirection: 'row', alignItems: 'center' },
  infoValue: { fontSize: 15, fontWeight: '500', color: '#222' },

  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subTitle: { fontSize: 15, fontWeight: '600', color: '#444' },
  noAddressText: { fontStyle: 'italic', color: '#888' },

  addressList: { 
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  addressContent: {
    flex: 1,
    paddingRight: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  defaultBadgeContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  defaultBadge: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: 'bold',
  },

  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    marginBottom: 20,
  },
  logoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center' },
  logoutText: { marginLeft: 12, fontSize: 14, color: 'red', fontWeight: 'bold' },

  deleteButton: {
    padding: 8,
  },
});
