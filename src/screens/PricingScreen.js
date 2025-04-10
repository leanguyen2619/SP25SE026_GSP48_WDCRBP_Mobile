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
    <Icon name="check" size={20} color={appColorTheme.brown_0} />
  );

  const renderCrossIcon = () => (
    <Icon name="close" size={20} color={appColorTheme.red_0} />
  );

  const renderPackageFeatures = (features, type) => {
    return features.map((feature, index) => (
      <View key={index} style={styles.featureRow}>
        {feature.available ? 
          <Icon name="check" size={20} color={styles[`${type}Card`].accentColor} /> : 
          <Icon name="close" size={20} color={appColorTheme.red_0} />
        }
        <Text style={[
          styles.featureText, 
          !feature.available && styles.unavailableFeature,
          styles[`${type}FeatureText`]
        ]}>
          {feature.text}
        </Text>
      </View>
    ));
  };

  const renderPricingCard = (title, price, features, type) => (
    <View style={[styles.card, styles[`${type}Card`]]}>
      <Text style={[styles.packageTitle, styles[`${type}Title`]]}>{title}</Text>
      <Text style={[styles.price, styles[`${type}Price`]]}>
        {price.toLocaleString()}
        <Text style={[styles.period, styles[`${type}Period`]]}> đồng/{
          selectedPeriod === 'month' ? 'tháng' : 
          selectedPeriod === 'quarter' ? 'quý' : 'năm'
        }</Text>
      </Text>
      <TouchableOpacity 
        style={[styles.registerButton, styles[`${type}Button`]]}
        onPress={() => navigation.navigate('WoodworkerRegistration')}
      >
        <Text style={styles.registerButtonText}>Đăng ký trở thành thợ mộc</Text>
      </TouchableOpacity>
      {renderPackageFeatures(features, type)}
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
            ],
            'bronze'
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
            ],
            'silver'
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
            ],
            'gold'
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.brown_0,
    textAlign: 'center',
    marginRight: 40,
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
    color: appColorTheme.brown_0,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: appColorTheme.brown_1,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  periodToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: '#E8E0D8',
    marginHorizontal: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  selectedPeriod: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  periodText: {
    color: appColorTheme.brown_1,
    fontSize: 14,
  },
  selectedPeriodText: {
    color: appColorTheme.brown_0,
    fontWeight: '600',
  },
  plansContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  packageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
    marginBottom: 4,
  },
  period: {
    fontSize: 16,
    color: appColorTheme.brown_1,
    marginBottom: 8,
  },
  registerButton: {
    backgroundColor: appColorTheme.brown_0,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: appColorTheme.brown_1,
  },
  unavailableFeature: {
    color: appColorTheme.red_0,
    opacity: 0.8,
  },
  // Bronze Package Styles
  bronzeCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CD7F32',
    accentColor: '#CD7F32',
  },
  bronzeTitle: {
    color: '#CD7F32',
  },
  bronzePrice: {
    color: '#CD7F32',
  },
  bronzePeriod: {
    color: '#CD7F32',
    opacity: 0.8,
  },
  bronzeButton: {
    backgroundColor: '#CD7F32',
  },
  bronzeFeatureText: {
    color: '#666',
  },

  // Silver Package Styles
  silverCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    accentColor: '#808080',
  },
  silverTitle: {
    color: '#808080',
  },
  silverPrice: {
    color: '#808080',
  },
  silverPeriod: {
    color: '#808080',
    opacity: 0.8,
  },
  silverButton: {
    backgroundColor: '#808080',
  },
  silverFeatureText: {
    color: '#666',
  },

  // Gold Package Styles
  goldCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FFD700',
    accentColor: '#DAA520',
  },
  goldTitle: {
    color: '#DAA520',
  },
  goldPrice: {
    color: '#DAA520',
  },
  goldPeriod: {
    color: '#DAA520',
    opacity: 0.8,
  },
  goldButton: {
    backgroundColor: '#DAA520',
  },
  goldFeatureText: {
    color: '#666',
  },
});

export default PricingScreen; 