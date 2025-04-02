import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const QuickActionCard = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: getIconBackground(icon) }]}>
      <Icon name={icon} size={24} color={getIconColor(icon)} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const getIconBackground = (icon) => {
  const colors = {
    'post-add': '#E8F3FF',
    'settings': '#F5E6FF',
    'attach-money': '#E6FFE6',
    'shopping-cart': '#FFF3E6',
    'star': '#FFE6E6',
    'palette': '#E6FFF9',
    'account-balance-wallet': '#F0E6FF',
    'build': '#FFE6F0',
  };
  return colors[icon] || '#E8F3FF';
};

const getIconColor = (icon) => {
  const colors = {
    'post-add': '#0066CC',
    'settings': '#6600CC',
    'attach-money': '#00CC00',
    'shopping-cart': '#CC6600',
    'star': '#CC0000',
    'palette': '#00CCB4',
    'account-balance-wallet': '#6600CC',
    'build': '#CC0066',
  };
  return colors[icon] || '#0066CC';
};

const WoodworkerDashboard = () => {
  const navigation = useNavigation();
  const woodworkerName = "Mộc Chạm"; // Thay thế bằng tên thật từ context/redux

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại sau.');
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const quickActions = [
    {
      icon: 'post-add',
      title: 'Thêm bài đăng',
      subtitle: 'Đăng tải bài đăng mới',
      onPress: () => navigation.navigate('CreatePost')
    },
    {
      icon: 'settings',
      title: 'Cài đặt xưởng',
      subtitle: 'Cập nhật thông tin xưởng',
      onPress: () => navigation.navigate('WorkshopSettings')
    },
    {
      icon: 'attach-money',
      title: 'Gói dịch vụ',
      subtitle: 'Xem và nâng cấp gói',
      onPress: () => navigation.navigate('ServicePackages')
    },
    {
      icon: 'shopping-cart',
      title: 'Đơn hàng',
      subtitle: 'Xem và xử lý đơn hàng',
      onPress: () => navigation.navigate('OrderManagement')
    },
    {
      icon: 'star',
      title: 'Đánh giá',
      subtitle: 'Xem đánh giá khách hàng',
      onPress: () => navigation.navigate('Reviews')
    },
    {
      icon: 'palette',
      title: 'Thiết kế',
      subtitle: 'Thêm thiết kế mới',
      onPress: () => navigation.navigate('AddDesign')
    },
    {
      icon: 'account-balance-wallet',
      title: 'Ví',
      subtitle: 'Quản lý ví của bạn',
      onPress: () => navigation.navigate('Wallet')
    },
    {
      icon: 'build',
      title: 'Dịch vụ',
      subtitle: 'Quản lý dịch vụ',
      onPress: () => navigation.navigate('Services')
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white_0} barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Xin chào, {woodworkerName}</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.brown_0} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Thao tác nhanh</Text>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={index}
              icon={action.icon}
              title={action.title}
              subtitle={action.subtitle}
              onPress={action.onPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white_0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey_1,
    backgroundColor: colors.white_0,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black_0,
  },
  logoutButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black_0,
    padding: 16,
    paddingBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: colors.white_0,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: colors.black_0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black_0,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.grey_0,
  },
});

export default WoodworkerDashboard; 