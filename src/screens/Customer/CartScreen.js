import React, { useState } from 'react';
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
import { appColorTheme } from '../../theme/colors';

const CartScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Giường Ngủ Gỗ Sồi',
      description: 'Gỗ sồi tự nhiên, 1m8 x 2m, Màu nâu đậm',
      price: 15000000,
      quantity: 1,
      image: 'https://product.hstatic.net/1000360516/product/giuong_ngu_go_soi_4_d8661c2040f44d49a5983658f560fbce_master.jpg'
    },
    {
      id: 2,
      name: 'Tủ Quần Áo 4 Cánh',
      description: 'Gỗ óc chó, 2m x 2.4m, Có gương',
      price: 12000000,
      quantity: 1,
      image: 'https://product.hstatic.net/1000360516/product/tu_quan_ao_go_soi_4_canh_3_d9529c71d84d4f0aa1dc31502f4c2a0f_master.jpg'
    },
    {
      id: 3,
      name: 'Bàn Ăn 6 Ghế',
      description: 'Gỗ cao su, 1.6m x 0.8m, Màu nâu nhạt',
      price: 8500000,
      quantity: 1,
      image: 'https://product.hstatic.net/1000360516/product/ban_an_go_soi_6_ghe_3_c3acf3a0c4434d359c9cf96943619fc2_master.jpg'
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return {
          ...item,
          quantity: newQuantity > 0 ? newQuantity : 1
        };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()}đ</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
            <Icon name="remove-circle-outline" size={24} color={appColorTheme.brown_1} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
            <Icon name="add-circle-outline" size={24} color={appColorTheme.brown_1} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
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
              <Text style={styles.totalAmount}>{calculateTotal().toLocaleString()}đ</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyCart}>
            <Icon name="shopping-cart" size={64} color={appColorTheme.grey_1} />
            <Text style={styles.emptyCartText}>Giỏ hàng của bạn đang trống</Text>
            <TouchableOpacity 
              style={styles.continueShopping}
              onPress={() => navigation.navigate('Home')}
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
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
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
});

export default CartScreen;
