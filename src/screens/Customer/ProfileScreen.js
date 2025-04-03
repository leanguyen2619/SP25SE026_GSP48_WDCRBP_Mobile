import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../../redux/slice/userSlice';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../components/common/footer/footer';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { userId, signOut } = useAuth();
  const { profile, loading, error } = useSelector((state) => state.user);
  const user = profile?.data;

  const [showEmail, setShowEmail] = useState(false);
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

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

        {/* Info Card */}
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
        </View>

        {/* Settings-style actions */}
        <View style={styles.settingsContainer}>
          <View style={styles.divider} />
          <SettingsItem icon="cart-outline" label="Order History" onPress={() => {}} />
          <SettingsItem icon="language-outline" label="Language" onPress={() => {}} />
          <SettingsItem icon="location-outline" label="Location" onPress={() => {}} />
          <SettingsItem icon="wallet-outline" label="Wallet" onPress={() => {}} />

          {/* ✅ Proper Logout handling */}
          <SettingsItem
            icon="log-out-outline"
            label="Logout"
            color="red"
            bold
            onPress={() => {
              signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
          />

          <View style={styles.divider} />
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer navigation={navigation} />
    </View>
  );
};

// Reusable Info Row
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

// Reusable Settings Row
const SettingsItem = ({ icon, label, onPress, color = '#000', bold = false }) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsLeft}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.settingsLabel, { color }, bold && { fontWeight: 'bold' }]}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#ccc" />
  </TouchableOpacity>
);

export default ProfileScreen;

// Styles
const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#f4f8ff',
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginTop: 20,
    marginBottom: 30,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888',
    marginBottom: 4,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsLabel: {
    marginLeft: 12,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
