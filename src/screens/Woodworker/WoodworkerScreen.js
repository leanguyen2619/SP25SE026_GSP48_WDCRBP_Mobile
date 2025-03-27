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
        <Text style={styles.headerTitle}>Quản lý xưởng mộc</Text>
        <View style={styles.placeholder} />
      </View>
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
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
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
        <View style={styles.ratingSlider}>
          <Text>1.0 - 5.0</Text>
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Sắp xếp theo</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Chọn tiêu chí</Text>
          <Icon name="arrow-drop-down" size={24} color={appColorTheme.grey_1} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Tên xưởng"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterActions}>
        <TouchableOpacity style={styles.applyFilterButton}>
          <Icon name="filter-list" size={20} color={appColorTheme.white_0} />
          <Text style={styles.applyFilterText}>Lọc</Text>
        </TouchableOpacity>
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

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {activeTab === 'list' && renderWorkshopList()}
      {activeTab === 'detail' && renderWorkshopDetail()}
      {activeTab === 'myWorkshop' && renderMyWorkshop()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  header: {
    backgroundColor: appColorTheme.white_0,
    paddingTop: 48,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: appColorTheme.brown_0,
  },
  tabText: {
    fontSize: 16,
    color: appColorTheme.grey_1,
  },
  activeTabText: {
    color: appColorTheme.brown_0,
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
  filtersContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#F4A261',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666666',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F4A261',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    color: '#666666',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#F4A261',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  filterActions: {
    alignItems: 'center',
  },
  applyFilterButton: {
    flexDirection: 'row',
    backgroundColor: '#F4A261',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  applyFilterText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  ratingSlider: {
    borderWidth: 1,
    borderColor: '#F4A261',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
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
});

export default WoodworkerScreen;
