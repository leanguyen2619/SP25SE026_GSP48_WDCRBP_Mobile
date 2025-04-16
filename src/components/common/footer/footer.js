import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appColorTheme } from '../../../theme/colors';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const packTypeColors = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
};

const Footer = ({ navigation }) => {
  const route = useRoute();
  const { user } = useSelector((state) => state.auth);
  const packType = user?.packType?.toLowerCase() || 'bronze';
  const activeColor = packTypeColors[packType] || appColorTheme.primary;

  const getColor = (screen) =>
    route.name === screen ? activeColor : appColorTheme.text.secondary;

  return (
    <View style={styles.footer}>
      <TouchableFooterItem
        icon="shopping-bag"
        label="Sản phẩm"
        onPress={() => navigation.navigate('Product')}
        color={getColor('Product')}
      />
       <TouchableFooterItem
        icon="design-services"
        label="Thiết kế"
        onPress={() => navigation.navigate('Design')}
        color={getColor('Design')}
      />
      <TouchableFooterItem
        icon="carpenter"
        label="Xưởng gỗ"
        onPress={() => navigation.navigate('Woodworker')}
        color={getColor('Woodworker')}
      />
      <TouchableFooterItem
        icon="shopping-cart"
        label="Giỏ hàng"
        onPress={() => navigation.navigate('Cart')}
        color={getColor('Cart')}
      />
      <TouchableFooterItem
        icon="account-balance-wallet"
        label="Ví"
        onPress={() => navigation.navigate('Wallet')}
        color={getColor('Wallet')}
      />
      <TouchableFooterItem
        icon="person"
        label="Tài khoản"
        onPress={() => navigation.navigate('Profile')}
        color={getColor('Profile')}
      />
    </View>
  );
};

const TouchableFooterItem = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.footerItem} onPress={onPress}>
    <Icon name={icon} size={24} color={color} />
    <Text style={[styles.footerLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: appColorTheme.surface,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: appColorTheme.border.light,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: 'center',
    padding: 6,
  },
  footerLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '500',
  },
});

export default Footer;
