import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appColorTheme } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const AdminScreen = () => {
  const { checkAccess } = useAuth();
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const hasAccess = checkAccess('Admin');
    if (!hasAccess) {
      navigation.goBack();
    }
  }, []);

  const MenuItem = ({ icon, title, onPress, isActive = false }) => (
    <TouchableOpacity 
      style={[styles.menuItem, isActive && styles.menuItemActive]} 
      onPress={() => {
        onPress();
        setIsMenuOpen(false);
      }}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={isActive ? appColorTheme.brown_0 : appColorTheme.brown_1} 
      />
      <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColorTheme.white_0} barStyle="dark-content" />
      
      {/* Header với nút menu */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Ionicons 
            name={isMenuOpen ? "close-outline" : "menu-outline"} 
            size={28} 
            color={appColorTheme.brown_0} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu quản trị viên</Text>
      </View>

      {/* Menu slide từ trái sang */}
      {isMenuOpen && (
        <View style={styles.menuOverlay}>
          <View style={styles.sidebar}>
            <ScrollView style={styles.menuList}>
              <MenuItem 
                icon="document-text-outline" 
                title="Đơn đăng ký xưởng"
                onPress={() => navigation.navigate('WoodworkerRegistrationManagement')}
                isActive={true}
              />
              <MenuItem 
                icon="log-out-outline" 
                title="Đăng xuất"
                onPress={() => navigation.replace('Login')}
              />
            </ScrollView>
          </View>
          <TouchableOpacity 
            style={styles.overlayClose}
            onPress={() => setIsMenuOpen(false)}
          />
        </View>
      )}

      {/* Nội dung chính */}
      <ScrollView style={styles.content}>
        <View style={styles.welcomeContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-outline" size={48} color={appColorTheme.brown_0} />
          </View>
          <Text style={styles.welcomeTitle}>Chào mừng đến với{'\n'}Trang Quản Trị</Text>
          <Text style={styles.welcomeSubtitle}>Đây là khu vực dành cho quản trị viên</Text>
          <TouchableOpacity style={styles.dashboardButton}>
            <Text style={styles.dashboardButtonText}>Đi đến Bảng điều khiển</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

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
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    marginLeft: 16,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    flexDirection: 'row',
  },
  overlayClose: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    width: width * 0.75,
    maxWidth: 300,
    backgroundColor: appColorTheme.white_0,
    paddingTop: 20,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemActive: {
    backgroundColor: appColorTheme.brown_0 + '20',
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: appColorTheme.brown_1,
  },
  menuItemTextActive: {
    color: appColorTheme.brown_0,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: appColorTheme.grey_1 + '20',
  },
  welcomeContainer: {
    padding: 24,
    minHeight: height - 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColorTheme.brown_0 + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: appColorTheme.brown_1,
    marginBottom: 24,
    textAlign: 'center',
  },
  dashboardButton: {
    backgroundColor: appColorTheme.brown_0,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  dashboardButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminScreen; 