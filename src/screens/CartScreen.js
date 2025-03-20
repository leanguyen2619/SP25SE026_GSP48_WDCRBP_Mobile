import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appColorTheme } from '../theme/colors';

const CartScreen = () => {
  const navigation = useNavigation();
  const [customProducts, setCustomProducts] = useState([
    {
      id: 1,
      name: 'Giường ngủ tùy chỉnh',
      description: 'Gỗ sồi, 1m8 x 2m, Đầu giường bọc da',
      price: 15000000,
      quantity: 1,
      image: 'https://via.placeholder.com/100x100',
    },
    {
      id: 2,
      name: 'Tủ quần áo tùy chỉnh',
      description: 'Gỗ óc chó, 4 cánh, Có gương, Kích thước 2m x 2.4m',
      price: 12000000,
      quantity: 1,
      image: 'https://via.placeholder.com/100x100',
    },
  ]);

  const [readyProducts, setReadyProducts] = useState([
    {
      id: 3,
      name: 'Tủ đầu giường',
      description: 'Gỗ cao su, 2 ngăn kéo, 50cm x 40cm',
      price: 2500000,
      quantity: 2,
      image: 'https://via.placeholder.com/100x100',
    },
    {
      id: 4,
      name: 'Kệ tivi',
      description: 'Gỗ MDF, 1m6 x 40cm, Màu nâu gỗ tự nhiên',
      price: 3500000,
      quantity: 1,
      image: 'https://via.placeholder.com/100x100',
    },
  ]);

  const handleQuantityChange = (id, type, isCustom) => {
    const products = isCustom ? customProducts : readyProducts;
    const setProducts = isCustom ? setCustomProducts : setReadyProducts;

    const updatedProducts = products.map(product => {
      if (product.id === id) {
        return {
          ...product,
          quantity: type === 'increase' 
            ? product.quantity + 1 
            : Math.max(1, product.quantity - 1),
        };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const handleRemoveProduct = (id, isCustom) => {
    const products = isCustom ? customProducts : readyProducts;
    const setProducts = isCustom ? setCustomProducts : setReadyProducts;
    
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };

  const renderProduct = (product, isCustom) => (
    <View key={product.id} style={styles.productCard}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productPrice}>
          {product.price.toLocaleString('vi-VN')}đ
        </Text>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveProduct(product.id, isCustom)}
        >
          <Icon name="delete" size={24} color="#e74c3c" />
        </TouchableOpacity>

        <View style={styles.quantityControl}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(product.id, 'decrease', isCustom)}
          >
            <Icon name="remove" size={20} color={appColorTheme.brown_1} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{product.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(product.id, 'increase', isCustom)}
          >
            <Icon name="add" size={20} color={appColorTheme.brown_1} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const calculateTotal = (products) => {
    return products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
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
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Custom Products Section */}
        {customProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sản phẩm tùy chỉnh</Text>
            {customProducts.map(product => renderProduct(product, true))}
            <View style={styles.sectionTotal}>
              <Text style={styles.sectionTotalText}>Tổng tiền:</Text>
              <Text style={styles.sectionTotalAmount}>
                {calculateTotal(customProducts).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </View>
        )}

        {/* Ready Products Section */}
        {readyProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sản phẩm có sẵn</Text>
            {readyProducts.map(product => renderProduct(product, false))}
            <View style={styles.sectionTotal}>
              <Text style={styles.sectionTotalText}>Tổng tiền:</Text>
              <Text style={styles.sectionTotalAmount}>
                {calculateTotal(readyProducts).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      {(customProducts.length > 0 || readyProducts.length > 0) && (
        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Tổng thanh toán:</Text>
            <Text style={styles.totalAmount}>
              {(calculateTotal(customProducts) + calculateTotal(readyProducts)).toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => {
              // Xử lý thanh toán
            }}
          >
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.grey_1,
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
  section: {
    marginTop: 16,
    backgroundColor: appColorTheme.white_0,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.black_0,
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9ff',
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: appColorTheme.grey_1,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: appColorTheme.black_0,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: appColorTheme.brown_1,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.brown_0,
  },
  productActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  removeButton: {
    padding: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColorTheme.grey_1,
    marginTop: 8,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: appColorTheme.black_0,
    paddingHorizontal: 12,
  },
  sectionTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColorTheme.grey_1,
  },
  sectionTotalText: {
    fontSize: 16,
    color: appColorTheme.brown_1,
  },
  sectionTotalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.brown_0,
  },
  footer: {
    backgroundColor: appColorTheme.white_0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: appColorTheme.grey_1,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 16,
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
  },
  checkoutButtonText: {
    color: appColorTheme.black_0,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen; 