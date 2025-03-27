import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appColorTheme } from '../../theme/colors';

const { width } = Dimensions.get('window');

const WoodworkerScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('list');
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchText, setSearchText] = useState('');
  const [starRating, setStarRating] = useState(1);

  const workshops = [
    {
      id: 1,
      name: 'Xưởng mộc Hòa Bình',
      address: '1775 Lê Văn Lương, ấp 3, Nhơn Đức, Nhà Bè, TP.HCM',
      rating: 4.0,
      reviews: 10,
      type: 'Xưởng Đồng',
      image: 'https://example.com/workshop1.jpg',
      businessType: 'Xưởng sản xuất đồ gỗ',
      description: 'Chuyên sản xuất đồ gỗ nội thất cao cấp với hơn 10 năm kinh nghiệm.'
    },
    {
      id: 2,
      name: 'Xưởng mộc Sài Gòn',
      address: '1775 Lê Văn Lương, ấp 3, Nhơn Đức, Nhà Bè, TP.HCM',
      rating: 5.0,
      reviews: 10,
      type: 'Xưởng Vàng',
      image: 'https://example.com/workshop2.jpg',
      businessType: 'Xưởng thiết kế và sản xuất',
      description: 'Đơn vị hàng đầu trong lĩnh vực thiết kế và sản xuất đồ gỗ theo yêu cầu.'
    },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="arrow-back" size={24} color={appColorTheme.brown_0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xưởng mộc</Text>
        <View style={styles.placeholder} />
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'list' && styles.activeTab]}
        onPress={() => {
          setActiveTab('list');
          setSelectedWorkshop(null);
        }}
      >
        <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
          Danh sách xưởng
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'myWorkshop' && styles.activeTab]}
        onPress={() => setActiveTab('myWorkshop')}
      >
        <Text style={[styles.tabText, activeTab === 'myWorkshop' && styles.activeTabText]}>
          Xưởng của tôi
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStarRating = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setStarRating(star)}
          >
            <Icon
              name={star <= starRating ? "star" : "star-border"}
              size={24}
              color={star <= starRating ? "#FFD700" : "#C0C0C0"}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Bộ lọc</Text>
      
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Tỉnh thành</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Chọn tỉnh, thành</Text>
          <Icon name="arrow-drop-down" size={24} color={appColorTheme.grey_1} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Lọc theo số sao</Text>
        {renderStarRating()}
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Sắp xếp theo</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Chọn tiêu chí</Text>
          <Icon name="arrow-drop-down" size={24} color={appColorTheme.grey_1} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Tên xưởng"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterButton}>
        <Text style={styles.filterButtonText}>Lọc</Text>
      </View>
    </View>
  );

  const renderWorkshopCard = (workshop) => (
    <TouchableOpacity
      key={workshop.id}
      style={styles.workshopCard}
      onPress={() => {
        setSelectedWorkshop(workshop);
        setActiveTab('detail');
      }}
    >
      <View style={styles.workshopBadge}>
        <Text style={[
          styles.badgeText,
          { color: workshop.type === 'Xưởng Vàng' ? '#FFD700' : workshop.type === 'Xưởng Đồng' ? '#CD7F32' : '#C0C0C0' }
        ]}>
          {workshop.type}
        </Text>
      </View>
      
      <Image
        source={{ uri: workshop.image }}
        style={styles.workshopImage}
      />
      
      <View style={styles.workshopInfo}>
        <Text style={styles.workshopName}>{workshop.name}</Text>
        <Text style={styles.workshopAddress}>{workshop.address}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>
            {workshop.rating} ({workshop.reviews} lượt đánh giá)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderWorkshopList = () => (
    <ScrollView style={styles.content}>
      <View style={styles.listHeader}>
        <Text style={styles.resultCount}>Tìm thấy {workshops.length} kết quả</Text>
      </View>
      {renderFilters()}
      <View style={styles.workshopList}>
        {workshops.map(renderWorkshopCard)}
      </View>
    </ScrollView>
  );

  const renderWorkshopDetail = () => {
    if (!selectedWorkshop) return null;

    return (
      <ScrollView style={styles.content}>
        <View style={styles.detailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setSelectedWorkshop(null);
              setActiveTab('list');
            }}
          >
            <Icon name="arrow-back" size={24} color={appColorTheme.brown_0} />
          </TouchableOpacity>
          <Text style={styles.detailTitle}>Chi tiết xưởng</Text>
        </View>

        <Image
          source={{ uri: selectedWorkshop.image }}
          style={styles.detailImage}
        />

        <View style={styles.detailContent}>
          <Text style={styles.detailName}>{selectedWorkshop.name}</Text>
          
          <View style={styles.detailRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name={star <= Math.floor(selectedWorkshop.rating) ? 'star' : star === Math.ceil(selectedWorkshop.rating) && selectedWorkshop.rating % 1 !== 0 ? 'star-half' : 'star-border'}
                size={20}
                color="#FFD700"
              />
            ))}
            <Text style={styles.detailReviews}>
              {selectedWorkshop.reviews} đánh giá
            </Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Địa chỉ:</Text>
            <Text style={styles.sectionText}>{selectedWorkshop.address}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Loại hình kinh doanh:</Text>
            <Text style={styles.sectionText}>{selectedWorkshop.businessType}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Giới thiệu:</Text>
            <Text style={styles.sectionText}>{selectedWorkshop.description}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="phone" size={20} color={appColorTheme.white_0} />
              <Text style={styles.buttonText}>Liên hệ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <Icon name="message" size={20} color={appColorTheme.white_0} />
              <Text style={styles.buttonText}>Nhắn tin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderMyWorkshop = () => (
    <View style={styles.myWorkshopContainer}>
      <Text style={styles.myWorkshopText}>
        Bạn chưa đăng ký xưởng mộc. Hãy đăng ký để bắt đầu kinh doanh!
      </Text>
      <TouchableOpacity 
        style={styles.registerButton}
        onPress={() => navigation.navigate('WoodworkerRegistration')}
      >
        <Text style={styles.registerButtonText}>Đăng ký xưởng mộc</Text>
      </TouchableOpacity>
    </View>
  );

  const renderServiceInfo = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Thông tin gói dịch vụ</Text>
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={() => navigation.navigate('Pricing')}
        >
          <Text style={styles.upgradeButtonText}>Mua gói mới</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.serviceDetails}>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Loại gói:</Text>
          <Text style={[styles.serviceValue, { color: '#FFD700' }]}>VÀNG</Text>
        </View>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Ngày bắt đầu:</Text>
          <Text style={styles.serviceValue}>2024-03-01 12:00</Text>
        </View>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceLabel}>Ngày kết thúc:</Text>
          <Text style={styles.serviceValue}>2024-06-01 12:00</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      {activeTab === 'list' && renderWorkshopList()}
      {activeTab === 'detail' && renderWorkshopDetail()}
      {activeTab === 'myWorkshop' && renderMyWorkshop()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#F97316',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  activeTab: {
    borderBottomColor: '#F97316',
  },
  activeTabText: {
    color: '#F97316',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listHeader: {
    padding: 16,
  },
  resultCount: {
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  filterContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F97316',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    color: '#6B7280',
  },
  input: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    color: '#1F2937',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 8,
  },
  filterButton: {
    margin: 16,
    backgroundColor: '#F97316',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  workshopList: {
    padding: 16,
  },
  workshopCard: {
    backgroundColor: appColorTheme.white_0,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workshopBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  workshopImage: {
    width: '100%',
    height: 200,
  },
  workshopInfo: {
    padding: 16,
  },
  workshopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: appColorTheme.black_0,
  },
  workshopAddress: {
    fontSize: 14,
    color: appColorTheme.grey_1,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
  },
  detailImage: {
    width: '100%',
    height: 250,
  },
  detailContent: {
    padding: 16,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    marginBottom: 8,
  },
  detailRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailReviews: {
    marginLeft: 8,
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.brown_0,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: appColorTheme.grey_1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: appColorTheme.brown_0,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: appColorTheme.brown_0,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: appColorTheme.white_0,
    marginLeft: 8,
    fontWeight: '600',
  },
  myWorkshopContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myWorkshopText: {
    fontSize: 16,
    color: appColorTheme.grey_1,
    textAlign: 'center',
    marginBottom: 24,
  },
  registerButton: {
    backgroundColor: appColorTheme.brown_0,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  registerButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  upgradeButton: {
    backgroundColor: appColorTheme.brown_0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  serviceDetails: {
    padding: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  serviceValue: {
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
});

export default WoodworkerScreen;
