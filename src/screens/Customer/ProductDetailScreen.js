import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slice/cartSlice';
import { appColorTheme } from '../../theme/colors';
import axios from 'axios';
import WoodworkerInfo from '../../components/common/WoodworkerInfo/WoodworkerInfo';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BASE_URL = 'http://10.0.2.2:8080';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/products/${productId}`);
      console.log('API Response:', response.data);
      if (response.data?.data) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin sản phẩm:', error);
      Alert.alert('Thông báo', 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.productId,
      name: product.productName,
      description: product.description,
      price: product.price,
      img_urls: product.mediaUrls,
      woodworkerName: product.woodworkerName
    };

    dispatch(addToCart(cartItem));
    Alert.alert(
      'Thành công',
      'Đã thêm sản phẩm vào giỏ hàng',
      [
        {
          text: 'Tiếp tục mua sắm',
          style: 'cancel',
        },
        {
          text: 'Xem giỏ hàng',
          onPress: () => navigation.navigate('Cart')
        }
      ]
    );
  };

  const renderRating = () => {
    const rating = product?.totalStar || 0;
    const reviews = product?.totalReviews || 0;
    return (
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              name={star <= rating ? "star" : "star-outline"}
              size={20}
              color="#FFD700"
            />
          ))}
        </View>
        <Text style={styles.ratingText}>
          {rating.toFixed(1)} ({reviews} đánh giá)
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_1} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy thông tin sản phẩm</Text>
      </View>
    );
  }

  console.log('Current product state:', product);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={appColorTheme.black_0} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Icon name="shopping-cart" size={24} color={appColorTheme.black_0} />
          </TouchableOpacity>
        </View>

        {/* Hình ảnh sản phẩm */}
        <View style={styles.imageContainer}>
          {product.mediaUrls ? (
            <Image
              source={{ 
                uri: product.mediaUrls.split(';')[0],
                headers: { 
                  'Cache-Control': 'no-cache',
                  'Accept': 'image/jpeg,image/png,image/*'
                }
              }}
              style={styles.productImage}
              resizeMode="cover"
              onError={(error) => console.log('Image loading error:', error)}
            />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <Icon name="image-not-supported" size={40} color={appColorTheme.grey_1} />
            </View>
          )}
        </View>

        {/* Thông tin sản phẩm */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.productName}</Text>
          <Text style={styles.price}>{Number(product.price).toLocaleString()}đ</Text>
          {renderRating()}

          {/* Thông tin chi tiết */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Loại gỗ:</Text>
              <Text style={styles.detailValue}>{product.woodType || 'Chưa có thông tin'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kích thước:</Text>
              <Text style={styles.detailValue}>
                {`${product.length || 0}cm x ${product.width || 0}cm x ${product.height || 0}cm`}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Màu sắc:</Text>
              <Text style={styles.detailValue}>{product.color || 'Chưa có thông tin'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bảo hành:</Text>
              <Text style={styles.detailValue}>{product.warrantyDuration || 0} tháng</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phong cách:</Text>
              <Text style={styles.detailValue}>{product.style || 'Chưa có thông tin'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Điêu khắc:</Text>
              <Text style={styles.detailValue}>{product.sculpture || 'Không'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mùi gỗ:</Text>
              <Text style={styles.detailValue}>{product.scent || 'Không có mùi'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Đặc điểm:</Text>
              <Text style={styles.detailValue}>{product.specialFeature || 'Chưa có thông tin'}</Text>
            </View>
          </View>

          {/* Mô tả */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
            <Text style={styles.description}>{product.description || 'Chưa có mô tả'}</Text>
          </View>

          {/* Thông tin thợ mộc */}
          <View style={styles.woodworkerSection}>
            <Text style={styles.sectionTitle}>Thông tin thợ mộc</Text>
            <WoodworkerInfo 
              woodworker={{
                woodworkerId: product.woodworkerId,
                woodworkerName: product.woodworkerName,
                woodworkerImgUrl: product.woodworkerImgUrl,
                address: product.address,
                packType: product.packType
              }} 
            />
          </View>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buyNowButton}
          onPress={() => {
            handleAddToCart();
            navigation.navigate('Cart');
          }}
        >
          <Text style={styles.buyNowButtonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: appColorTheme.white_0,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.black_0,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: appColorTheme.grey_0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColorTheme.black_0,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: appColorTheme.brown_0,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.black_0,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: appColorTheme.black_0,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: appColorTheme.black_0,
  },
  woodworkerSection: {
    marginBottom: 24,
  },
  woodworkerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColorTheme.grey_0,
    padding: 12,
    borderRadius: 8,
  },
  woodworkerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  woodworkerDetails: {
    flex: 1,
  },
  woodworkerName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.black_0,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: appColorTheme.white_0,
    borderTopWidth: 1,
    borderTopColor: appColorTheme.grey_1,
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColorTheme.brown_0,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: appColorTheme.brown_0,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: appColorTheme.brown_0,
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packType: {
    fontSize: 14,
    color: appColorTheme.brown_0,
    marginTop: 4,
  },
});

export default ProductDetailScreen; 