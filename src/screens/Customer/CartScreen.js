import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/slice/cartSlice';
import { appColorTheme } from '../../theme/colors';

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const handleUpdateQuantity = (cartItemKey, change) => {
    dispatch(updateQuantity({ cartItemKey, change }));
  };

  const handleRemoveItem = (cartItemKey) => {
    dispatch(removeFromCart(cartItemKey));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price || 0;
      return total + (itemPrice * (item.quantity || 1));
    }, 0);
  };

  const renderCartItem = (item) => (
    <View key={item.cartItemKey} style={styles.cartItem}>
      <View style={styles.imageContainer}>
        {item.img_urls ? (
          <Image
            source={{ 
              uri: Array.isArray(item.img_urls) ? item.img_urls[0] : item.img_urls,
              headers: {
                'Cache-Control': 'no-cache'
              }
            }}
            style={styles.itemImage}
            onError={() => console.log('Lỗi tải hình ảnh:', item.id)}
          />
        ) : (
          <View style={[styles.itemImage, styles.placeholderImage]}>
            <Icon name="image-not-supported" size={40} color={appColorTheme.grey_1} />
          </View>
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name || 'Sản phẩm không tên'}</Text>
        
        {/* Hiển thị thông tin cấu hình */}
        {item.configuration && (
          <View style={styles.configContainer}>
            {item.configuration.woodType && (
              <Text style={styles.configText}>
                Loại gỗ: {item.configuration.woodType}
              </Text>
            )}
            {item.configuration.size && (
              <Text style={styles.configText}>
                Kích thước: {item.configuration.size}
              </Text>
            )}
          </View>
        )}

        <Text style={styles.itemPrice}>
          {(item.price || 0).toLocaleString()}đ
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => handleUpdateQuantity(item.cartItemKey, -1)}
            disabled={item.quantity <= 1}
          >
            <Icon 
              name="remove-circle-outline" 
              size={24} 
              color={item.quantity <= 1 ? appColorTheme.grey_1 : appColorTheme.brown_1} 
            />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity || 1}</Text>
          <TouchableOpacity onPress={() => handleUpdateQuantity(item.cartItemKey, 1)}>
            <Icon name="add-circle-outline" size={24} color={appColorTheme.brown_1} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.cartItemKey)}
          >
            <Icon name="delete-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={appColorTheme.black_0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map(renderCartItem)}
            <View style={styles.totalSection}>
              <Text style={styles.totalText}>Tổng tiền:</Text>
              <Text style={styles.totalAmount}>
                {calculateTotal().toLocaleString()}đ
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyCart}>
            <Icon name="shopping-cart" size={64} color={appColorTheme.grey_1} />
            <Text style={styles.emptyCartText}>Giỏ hàng của bạn đang trống</Text>
            <TouchableOpacity 
              style={styles.continueShopping}
              onPress={() => navigation.navigate('Product')}
            >
              <Text style={styles.continueShoppingText}>Tiếp tục mua sắm</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.white_0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.black_0,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: appColorTheme.white_0,
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
  imageContainer: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: appColorTheme.grey_0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.black_0,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: appColorTheme.brown_1,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.brown_0,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 'auto',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: appColorTheme.grey_1,
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.black_0,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
  },
  checkoutButton: {
    backgroundColor: appColorTheme.brown_0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  checkoutButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyCartText: {
    fontSize: 16,
    color: appColorTheme.brown_1,
    marginTop: 16,
    marginBottom: 24,
  },
  continueShopping: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: appColorTheme.brown_0,
  },
  continueShoppingText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '500',
  },
  configContainer: {
    marginBottom: 8,
  },
  configText: {
    fontSize: 14,
    color: appColorTheme.grey_1,
    marginBottom: 4,
  },
});

export default CartScreen;
