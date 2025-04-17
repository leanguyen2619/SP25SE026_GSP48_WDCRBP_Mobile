import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
  fetchWardsByDistrict,
} from '../../redux/slice/ghnSlice'; // ✅ USING GHN API here

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { userId, signOut } = useAuth();

  const { profile, loading, error } = useSelector((state) => state.user);
  const { list: addresses } = useSelector((state) => state.userAddress);

  const {
    provinces,
    districts,
    wardsByDistrict,
    loading: ghnLoading,
  } = useSelector((state) => state.ghn);

  const [showEmail, setShowEmail] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchUserAddresses(userId));
    }
    dispatch(fetchProvinces());
    dispatch(fetchDistricts());
  }, [dispatch, userId]);

  // Fetch necessary ward data per district in addresses
  useEffect(() => {
    if (!addresses || addresses.length === 0) return;

    const uniqueDistricts = [...new Set(addresses.map((addr) => addr.district_id))];
    uniqueDistricts.forEach((districtId) => {
      if (!wardsByDistrict[districtId]) {
        dispatch(fetchWardsByDistrict(districtId));
      }
    });
  }, [addresses]);

  const handleDeleteAddress = (id) => {
    dispatch(deleteUserAddress(id)).then(() => {
      dispatch(fetchUserAddresses(userId));
    });
  };

  const handleAddressAdded = () => {
    dispatch(fetchUserAddresses(userId));
    setModalVisible(false);
  };

  const getFullAddress = (addr) => {
    const wardList = wardsByDistrict[addr.district_id] || [];

    const wardName =
      wardList.find((w) => w.WardCode === addr.ward_code)?.WardName || '';
    const districtName =
      districts.find((d) => d.DistrictID === addr.district_id)?.DistrictName || '';
    const provinceName =
      provinces.find((p) => p.ProvinceID === addr.city_id)?.ProvinceName || '';

    return `${addr.address}, ${wardName}, ${districtName}, ${provinceName}`;
  };

  if (loading || ghnLoading) {
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

          {(!addresses || addresses.length === 0) ? (
            <Text style={styles.noAddressText}>Chưa có địa chỉ nào.</Text>
          ) : (
            <View style={styles.addressList}>
              {addresses.map((addr) => (
                <View key={addr.user_address_id} style={styles.addressRow}>
                  <Text style={styles.addressText}>{getFullAddress(addr)}</Text>
                  <TouchableOpacity onPress={() => handleDeleteAddress(addr.user_address_id)}>
                    <Ionicons name="remove-circle-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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

  addressList: { marginTop: 8 },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  addressText: { fontSize: 14, color: '#333', flexShrink: 1 },

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
});
