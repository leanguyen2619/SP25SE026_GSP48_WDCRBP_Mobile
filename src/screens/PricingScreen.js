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
  const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // 'monthly', 'annual', 'twoYear'

  const plans = {
    standard: {
      monthly: {
        name: 'Gói Đồng',
        price: '200.000',
        originalPrice: '300.000',
        features: [
          'Quản lý dịch vụ cung cấp (Tùy chỉnh, sửa chữa)',
          'Quản lý tương thiết kế',
          'Quản lý đơn hàng dịch vụ',
          'Trang cá nhân (Profile) (Giới thiệu, thông tin, hình ảnh)',
          '5 bài đăng trên trang cá nhân/tháng',
          'Quản lý sản phẩm & bán sản phẩm có sẵn',
          'Ưu tiên hiển thị trong kết quả tìm kiếm',
          'Chức năng cung cấp dịch vụ cá nhân hóa',
        ],
        unavailableFeatures: [5, 6, 7], // Indexes of features that are not available
      },
    },
    premium: {
      monthly: {
        name: 'Gói Bạc',
        price: '350.000',
        originalPrice: '450.000',
        features: [
          'Quản lý dịch vụ cung cấp (Tùy chỉnh, sửa chữa)',
          'Quản lý tương thiết kế',
          'Quản lý đơn hàng dịch vụ',
          'Trang cá nhân (Profile) (Giới thiệu, thông tin, hình ảnh)',
          '10 bài đăng trên trang cá nhân/tháng',
          'Quản lý sản phẩm & bán sản phẩm có sẵn',
          'Ưu tiên hiển thị trong kết quả tìm kiếm',
          'Chức năng cung cấp dịch vụ cá nhân hóa',
        ],
        unavailableFeatures: [7], // Indexes of features that are not available
      },
    },
    premiumPlus: {
      monthly: {
        name: 'Gói Vàng',
        price: '500.000',
        originalPrice: '650.000',
        features: [
          'Quản lý dịch vụ cung cấp (Tùy chỉnh, sửa chữa)',
          'Quản lý tương thiết kế',
          'Quản lý đơn hàng dịch vụ',
          'Trang cá nhân (Profile) (Giới thiệu, thông tin, hình ảnh)',
          '20 bài đăng trên trang cá nhân/tháng',
          'Có quyền quản lý sản phẩm & bán sản phẩm có sẵn',
          'Ưu tiên cao nhất trong kết quả tìm kiếm',
          'Có chức năng cung cấp dịch vụ cá nhân hóa',
        ],
      },
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
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
        <View style={styles.periodSelection}>
          <TouchableOpacity 
            style={[
              styles.periodButton,
              selectedPeriod === 'monthly' && styles.selectedPeriod
            ]}
            onPress={() => setSelectedPeriod('monthly')}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === 'monthly' && styles.selectedPeriodText
            ]}>Hàng tháng</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.periodButton,
              selectedPeriod === 'annual' && styles.selectedPeriod
            ]}
            onPress={() => setSelectedPeriod('annual')}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === 'annual' && styles.selectedPeriodText
            ]}>Hàng năm</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.periodButton,
              selectedPeriod === 'twoYear' && styles.selectedPeriod
            ]}
            onPress={() => setSelectedPeriod('twoYear')}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === 'twoYear' && styles.selectedPeriodText
            ]}>Hai năm</Text>
          </TouchableOpacity>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {/* Standard Plan */}
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plans.standard.monthly.name}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>TIẾT KIỆM</Text>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{plans.standard.monthly.price}</Text>
              <Text style={styles.period}> đồng/tháng</Text>
            </View>
            
            <Text style={styles.billingInfo}>
              Thanh toán hàng tháng {plans.standard.monthly.price} đồng{' '}
              <Text style={styles.originalPrice}>{plans.standard.monthly.originalPrice} đồng</Text>
            </Text>

            <TouchableOpacity style={styles.getStartedButton}>
              <Text style={styles.getStartedText}>Bắt đầu</Text>
            </TouchableOpacity>

            <View style={styles.featuresList}>
              {plans.standard.monthly.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon 
                    name={plans.standard.monthly.unavailableFeatures.includes(index) ? "close" : "check"} 
                    size={20} 
                    color={plans.standard.monthly.unavailableFeatures.includes(index) ? "#e74c3c" : appColorTheme.brown_1} 
                  />
                  <Text style={[
                    styles.featureText,
                    plans.standard.monthly.unavailableFeatures.includes(index) && styles.unavailableFeatureText
                  ]}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Premium Plan */}
          <View style={[styles.planCard, styles.popularPlan]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>PHỔ BIẾN NHẤT</Text>
            </View>
            
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plans.premium.monthly.name}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>TIẾT KIỆM</Text>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{plans.premium.monthly.price}</Text>
              <Text style={styles.period}> đồng/tháng</Text>
            </View>
            
            <Text style={styles.billingInfo}>
              Thanh toán hàng tháng {plans.premium.monthly.price} đồng{' '}
              <Text style={styles.originalPrice}>{plans.premium.monthly.originalPrice} đồng</Text>
            </Text>

            <TouchableOpacity style={[styles.getStartedButton, styles.popularButton]}>
              <Text style={styles.getStartedText}>Bắt đầu</Text>
            </TouchableOpacity>

            <View style={styles.featuresList}>
              {plans.premium.monthly.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon 
                    name={plans.premium.monthly.unavailableFeatures.includes(index) ? "close" : "check"} 
                    size={20} 
                    color={plans.premium.monthly.unavailableFeatures.includes(index) ? "#e74c3c" : appColorTheme.brown_1} 
                  />
                  <Text style={[
                    styles.featureText,
                    plans.premium.monthly.unavailableFeatures.includes(index) && styles.unavailableFeatureText
                  ]}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Premium Plus Plan */}
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plans.premiumPlus.monthly.name}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>TIẾT KIỆM</Text>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{plans.premiumPlus.monthly.price}</Text>
              <Text style={styles.period}> đồng/tháng</Text>
            </View>
            
            <Text style={styles.billingInfo}>
              Thanh toán hàng tháng {plans.premiumPlus.monthly.price} đồng{' '}
              <Text style={styles.originalPrice}>{plans.premiumPlus.monthly.originalPrice} đồng</Text>
            </Text>

            <TouchableOpacity style={styles.getStartedButton}>
              <Text style={styles.getStartedText}>Bắt đầu</Text>
            </TouchableOpacity>

            <View style={styles.featuresList}>
              {plans.premiumPlus.monthly.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="check" size={20} color={appColorTheme.brown_1} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
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
  periodSelection: {
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
  planCard: {
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
  popularPlan: {
    borderColor: appColorTheme.brown_0,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: appColorTheme.white_0,
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
  },
  discountBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: appColorTheme.white_0,
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  currency: {
    fontSize: 24,
    fontWeight: '500',
    color: appColorTheme.black_0,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
  },
  period: {
    fontSize: 16,
    color: appColorTheme.brown_1,
    marginBottom: 8,
    marginLeft: 4,
  },
  billingInfo: {
    fontSize: 14,
    color: appColorTheme.brown_1,
    marginBottom: 16,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#e74c3c',
  },
  getStartedButton: {
    backgroundColor: appColorTheme.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  popularButton: {
    backgroundColor: '#6c5ce7',
  },
  getStartedText: {
    color: appColorTheme.black_0,
    fontSize: 16,
    fontWeight: '600',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: appColorTheme.black_0,
  },
  unavailableFeatureText: {
    color: '#e74c3c',
  },
});

export default PricingScreen; 