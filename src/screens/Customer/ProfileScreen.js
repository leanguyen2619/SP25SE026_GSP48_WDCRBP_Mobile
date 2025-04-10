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
import { fetchUserById } from '../../redux/slice/userSlice';
import {
  fetchUserAddresses,
  deleteUserAddress,
} from '../../redux/slice/userAddressSlice';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../components/common/footer/footer';
import AddAddressModal from '../../components/common/modals/AddAddressModal';
import { resolveLocation } from '../../utils/locationResolver'; // 👈 Your location helper

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { userId, signOut } = useAuth();
  const { profile, loading, error } = useSelector((state) => state.user);
  const { list: rawAddresses } = useSelector((state) => state.userAddress);
  const addresses = Array.isArray(rawAddresses) ? rawAddresses : [];
  const user = profile?.data;

  const [showEmail, setShowEmail] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [resolvedAddresses, setResolvedAddresses] = useState([]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchUserAddresses(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const resolveAll = async () => {
      const enriched = await Promise.all(
        addresses.map(async (addr) => {
          const names = await resolveLocation(addr);
          return {
            ...addr,
            fullAddress: `${addr.address}, ${names.ward}, ${names.district}, ${names.city}`,
          };
        })
      );
      setResolvedAddresses(enriched);
    };

    if (addresses.length > 0) {
      resolveAll();
    }
  }, [addresses]);

  const handleDeleteAddress = (id) => {
    dispatch(deleteUserAddress(id));
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
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../../assets/avatar-placeholder.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.username}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <InfoItem label="Tên" value={user?.username} />
          <InfoItem
            label="Email"
            value={showEmail ? user?.email : '••••••••'}
            secure={!showEmail}
            onToggle={() => setShowEmail(!showEmail)}
          />
          <InfoItem
            label="Vai trò"
            value={showRole ? user?.role : '••••••'}
            secure={!showRole}
            onToggle={() => setShowRole(!showRole)}
          />
          <InfoItem label="Điện thoại" value={user?.phone} />

          {/* Address List */}
          <View style={styles.addressHeader}>
            <Text style={styles.subTitle}>Địa chỉ</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#28a745" />
            </TouchableOpacity>
          </View>

          {resolvedAddresses.length === 0 ? (
            <Text style={styles.noAddressText}>Chưa có địa chỉ nào.</Text>
          ) : (
            <View style={styles.addressList}>
              {resolvedAddresses.map((addr) => (
                <View key={addr.id} style={styles.addressRow}>
                  <Text style={styles.addressText}>{addr.fullAddress}</Text>
                  <TouchableOpacity onPress={() => handleDeleteAddress(addr.id)}>
                    <Ionicons name="remove-circle-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Logout */}
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
  sectionTitle: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 8 },

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
