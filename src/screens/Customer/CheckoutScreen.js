import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../redux/slice/cartSlice';
import { appColorTheme } from '../../theme/colors';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const BASE_URL = 'http://10.0.2.2:8080';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const user = useSelector(state => state.auth.user);

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [isInstall, setIsInstall] = useState(true);

  useEffect(() => {
    // Fetch districts
    const fetchDistricts = async () => {
      try {
        const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
          headers: {
            'Token': 'your-ghn-token'
          }
        });
        setDistricts(response.data.data || []);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };

    fetchDistricts();
  }, []);

  useEffect(() => {
    // Fetch wards when district is selected
    const fetchWards = async () => {
      if (!selectedDistrict) return;
      try {
        const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedDistrict}`, {
          headers: {
            'Token': 'your-ghn-token'
          }
        });
        setWards(response.data.data || []);
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    };

    fetchWards();
  }, [selectedDistrict]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    if (!selectedDistrict || !selectedWard) {
      Alert.alert('Thông báo', 'Vui lòng chọn quận/huyện và phường/xã');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        availableServiceId: 0, // Cần cập nhật theo API GHN
        toDistrictId: selectedDistrict,
        toWardCode: selectedWard,
        ghnServiceId: 0, // Cần cập nhật theo API GHN
        ghnServiceTypeId: 0, // Cần cập nhật theo API GHN
        userId: user?.id,
        designIdeaVariantIds: cartItems.map(item => ({
          designIdeaVariantId: item.id,
          quantity: item.quantity
        })),
        address: deliveryAddress,
        description: note,
        isInstall: isInstall,
        priceShipping: shippingFee
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/service-orders/createCustomizeOrder`,
        orderData
      );

      if (response.status === 200) {
        dispatch(clearCart());
        Alert.alert(
          'Thành công',
          'Đơn hàng của bạn đã được đặt thành công',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Product')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert(
        'Lỗi',
        'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + shippingFee;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={appColorTheme.black_0} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin đặt hàng</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Thông tin xưởng mộc */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin xưởng mộc</Text>
          <View style={styles.infoRow}>
            <Icon name="store" size={20} color={appColorTheme.grey_1} />
            <Text style={styles.infoText}>Hoa Nam</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={20} color={appColorTheme.grey_1} />
            <Text style={styles.infoText}>
              12/12 đường Đống Khởi, Xã Hòa Khương, Huyện Hòa Vang, Đà Nẵng
            </Text>
          </View>
        </View>

        {/* Địa chỉ giao hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Quận/Huyện:</Text>
            <Picker
              selectedValue={selectedDistrict}
              onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn quận/huyện" value="" />
              {districts.map((district) => (
                <Picker.Item 
                  key={district.DistrictID} 
                  label={district.DistrictName} 
                  value={district.DistrictID} 
                />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Phường/Xã:</Text>
            <Picker
              selectedValue={selectedWard}
              onValueChange={(itemValue) => setSelectedWard(itemValue)}
              style={styles.picker}
              enabled={!!selectedDistrict}
            >
              <Picker.Item label="Chọn phường/xã" value="" />
              {wards.map((ward) => (
                <Picker.Item 
                  key={ward.WardCode} 
                  label={ward.WardName} 
                  value={ward.WardCode} 
                />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nhập địa chỉ chi tiết"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
          />
        </View>

        {/* Ghi chú */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú đơn hàng</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt cho đơn hàng này"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Dịch vụ lắp đặt */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch vụ lắp đặt</Text>
          <TouchableOpacity 
            style={styles.installToggle}
            onPress={() => setIsInstall(!isInstall)}
          >
            <Icon 
              name={isInstall ? "check-box" : "check-box-outline-blank"} 
              size={24} 
              color={appColorTheme.brown_0} 
            />
            <Text style={styles.installText}>Yêu cầu lắp đặt tại nhà</Text>
          </TouchableOpacity>
        </View>

        {/* Chi tiết thanh toán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tiền sản phẩm:</Text>
            <Text style={styles.priceValue}>{subtotal.toLocaleString()}đ</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí vận chuyển:</Text>
            <Text style={styles.priceValue}>{shippingFee.toLocaleString()}đ</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút đặt hàng */}
      <TouchableOpacity 
        style={styles.checkoutButton}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={appColorTheme.white_0} />
        ) : (
          <Text style={styles.checkoutButtonText}>Tiến hành đặt hàng</Text>
        )}
      </TouchableOpacity>
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
  section: {
    marginBottom: 24,
    backgroundColor: appColorTheme.white_0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.brown_0,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  input: {
    borderWidth: 1,
    borderColor: appColorTheme.grey_1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: appColorTheme.black_0,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: appColorTheme.grey_1,
    marginBottom: 8,
  },
  picker: {
    backgroundColor: appColorTheme.grey_0,
    borderRadius: 8,
    marginBottom: 8,
  },
  installToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  installText: {
    fontSize: 14,
    color: appColorTheme.black_0,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: appColorTheme.grey_1,
  },
  priceValue: {
    fontSize: 14,
    color: appColorTheme.black_0,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColorTheme.grey_1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.black_0,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColorTheme.brown_0,
  },
  checkoutButton: {
    backgroundColor: appColorTheme.brown_0,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: appColorTheme.white_0,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen; 