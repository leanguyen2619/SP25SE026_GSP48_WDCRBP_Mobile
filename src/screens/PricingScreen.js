import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appColorTheme } from '../theme/colors';

const { width } = Dimensions.get('window');

const PricingScreen = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // 'month', 'quarter' or 'year'

  const renderCheckIcon = () => (
    <Icon name="check" size={20} color="#8B4513" />
  );

  const renderCrossIcon = () => (
    <Icon name="close" size={20} color="#FF0000" />
  );

  const renderPackageFeatures = (features) => {
    return features.map((feature, index) => (
      <View key={index} style={styles.featureRow}>
        {feature.available ? renderCheckIcon() : renderCrossIcon()}
        <Text style={[styles.featureText, !feature.available && styles.unavailableFeature]}>
          {feature.text}
        </Text>
      </View>
    ));
  };

  const renderPricingCard = (title, price, features) => (
    <View style={styles.card}>
      <Text style={styles.packageTitle}>{title}</Text>
      <Text style={styles.price}>
        {price.toLocaleString()}
        <Text style={styles.period}> đồng/{
          selectedPeriod === 'month' ? 'tháng' : 
          selectedPeriod === 'quarter' ? 'quý' : 'năm'
        }</Text>
      </Text>
      <TouchableOpacity 
        style={styles.registerButton}
        onPress={() => navigation.navigate('WoodworkerRegistration')}
      >
        <Text style={styles.registerButtonText}>Đăng ký trở thành thợ mộc</Text>
      </TouchableOpacity>
      {renderPackageFeatures(features)}
    </View>
  );

  const getPriceByPeriod = (monthly, quarterly, yearly) => {
    switch(selectedPeriod) {
      case 'month':
        return monthly;
      case 'quarter':
        return quarterly;
      case 'year':
        return yearly;
      default:
        return monthly;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="arrow-back" size={24} color={appColorTheme.black_0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gói dịch vụ</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Chọn gói dịch vụ</Text>
          <Text style={styles.mainTitle}>phù hợp với bạn</Text>
          <Text style={styles.subtitle}>
            Tham gia cùng hàng nghìn nhà cung cấp dịch vụ khác
          </Text>
        </View>

        {/* Period Selection */}
        <View style={styles.periodToggle}>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'month' && styles.selectedPeriod]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'month' && styles.selectedPeriodText]}>
              Hàng tháng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'quarter' && styles.selectedPeriod]}
            onPress={() => setSelectedPeriod('quarter')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'quarter' && styles.selectedPeriodText]}>
              Hàng quý
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.periodButton, selectedPeriod === 'year' && styles.selectedPeriod]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'year' && styles.selectedPeriodText]}>
              Hàng năm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {renderPricingCard('Gói Đồng', 
            getPriceByPeriod(200000, 540000, 2160000),
            [
              { available: true, text: 'Quản lý dịch vụ cung cấp (Tùy chỉnh, sửa chữa)' },
              { available: true, text: 'Quản lý tương thiết kế' },
              { available: true, text: 'Quản lý đơn hàng dịch vụ' },
              { available: true, text: 'Trang cá nhân (Profile) (Giới thiệu, thông tin, hình ảnh)' },
              { available: true, text: '5 bài đăng trên trang cá nhân/tháng' },
              { available: false, text: 'Quản lý sản phẩm & bán sản phẩm có sẵn' },
              { available: false, text: 'Ưu tiên hiển thị trong kết quả tìm kiếm' },
              { available: false, text: 'Chức năng cung cấp dịch vụ cá nhân hóa' }
            ]
          )}

          {renderPricingCard('Gói Bạc',
            getPriceByPeriod(350000, 945000, 3780000),
            [
              { available: true, text: 'Quản lý dịch vụ cung cấp (Tùy chỉnh, sửa chữa)' },
              { available: true, text: 'Quản lý tương thiết kế' },
              { available: true, text: 'Quản lý đơn hàng dịch vụ' },
              { available: true, text: 'Trang cá nhân (Profile) (Giới thiệu, thông tin, hình ảnh)' },
              { available: true, text: '10 bài đăng trên trang cá nhân/tháng' },
              { available: true, text: 'Quản lý sản phẩm & bán sản phẩm có sẵn' },
              { available: true, text: 'Ưu tiên hiển thị trong kết quả tìm kiếm' },
              { available: false, text: 'Chức năng cung cấp dịch vụ cá nhân hóa' }
            ]
          )}

          {renderPricingCard('Gói Vàng',
            getPriceByPeriod(500000, 1350000, 5400000),
            [
              { available: true, text: 'Quản lý dịch vụ cung cấp (Tùy chỉnh, sửa chữa)' },
              { available: true, text: 'Quản lý tương thiết kế' },
              { available: true, text: 'Quản lý đơn hàng dịch vụ' },
              { available: true, text: 'Trang cá nhân (Profile) (Giới thiệu, thông tin, hình ảnh)' },
              { available: true, text: '20 bài đăng trên trang cá nhân/tháng' },
              { available: true, text: 'Quản lý sản phẩm & bán sản phẩm có sẵn' },
              { available: true, text: 'Ưu tiên cao nhất trong kết quả tìm kiếm' },
              { available: true, text: 'Có chức năng cung cấp dịch vụ cá nhân hóa' }
            ]
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: appColorTheme.white_0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.black_0,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: 24,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: appColorTheme.brown_1,
    textAlign: 'center',
    marginTop: 12,
  },
  periodToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: appColorTheme.grey_1,
    marginHorizontal: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  selectedPeriod: {
    backgroundColor: appColorTheme.white_0,
  },
  periodText: {
    color: appColorTheme.brown_1,
    fontSize: 14,
  },
  selectedPeriodText: {
    color: appColorTheme.black_0,
    fontWeight: '500',
  },
  plansContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: appColorTheme.white_0,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    marginBottom: 16,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    marginBottom: 8,
  },
  period: {
    fontSize: 16,
    color: appColorTheme.brown_1,
    marginBottom: 8,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: appColorTheme.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    color: appColorTheme.black_0,
    fontSize: 16,
    fontWeight: '600',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: appColorTheme.black_0,
  },
  unavailableFeature: {
    color: '#e74c3c',
  },
});

export default PricingScreen; 