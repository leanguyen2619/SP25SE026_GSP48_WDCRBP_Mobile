import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { appColorTheme } from '../../theme/colors';

const { width } = Dimensions.get('window');

const WoodworkerDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('profile');

  const workshopData = {
    id: route.params?.workshopId,
    name: 'Xưởng mộc Hòa Bình Quận 5',
    type: 'Xưởng Đồng',
    address: 'Chưa cập nhật',
    businessType: 'Chưa cập nhật',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis harum, voluptates quas, laudantium inventore debitis aspernatur aperiam voluptate distinctio perspiciatis doloremque cupiditate cum facere iste reprehenderit totam tempora impedit non.',
    rating: 3.5,
    reviews: 13,
    image: 'https://example.com/workshop1.jpg'
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={{ uri: workshopData.image }}
        style={styles.coverImage}
      />
      <View style={styles.workshopBadge}>
        <Text style={[
          styles.badgeText,
          { color: workshopData.type === 'Xưởng Vàng' ? '#FFD700' : workshopData.type === 'Xưởng Đồng' ? '#CD7F32' : '#C0C0C0' }
        ]}>
          {workshopData.type}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={appColorTheme.white_0} />
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {['profile', 'services', 'designs', 'products', 'reviews'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab === 'profile' ? 'Trang cá nhân' :
             tab === 'services' ? 'Dịch vụ' :
             tab === 'designs' ? 'Thiết kế' :
             tab === 'products' ? 'Sản phẩm' : 'Đánh giá'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderProfile = () => (
    <View style={styles.profileContainer}>
      <Text style={styles.workshopName}>{workshopData.name}</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= Math.floor(workshopData.rating) ? 'star' : star === Math.ceil(workshopData.rating) && workshopData.rating % 1 !== 0 ? 'star-half' : 'star-border'}
            size={20}
            color="#FFD700"
          />
        ))}
        <Text style={styles.ratingText}>{workshopData.reviews} đánh giá</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Địa chỉ xưởng:</Text>
        <Text style={styles.infoText}>{workshopData.address}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Loại hình kinh doanh:</Text>
        <Text style={styles.infoText}>{workshopData.businessType}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Giới thiệu:</Text>
        <Text style={styles.infoText}>{workshopData.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {renderHeader()}
        {renderTabs()}
        {activeTab === 'profile' && renderProfile()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  content: {
    flex: 1,
  },
  header: {
    height: 250,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  workshopBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: appColorTheme.white_0,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: appColorTheme.brown_0,
  },
  tabText: {
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  activeTabText: {
    color: appColorTheme.brown_0,
    fontWeight: '600',
  },
  profileContainer: {
    padding: 16,
  },
  workshopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.brown_0,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: appColorTheme.grey_1,
    lineHeight: 20,
  },
});

export default WoodworkerDetailScreen; 