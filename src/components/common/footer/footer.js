import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appColorTheme } from '../../../theme/colors';
import { useRoute } from '@react-navigation/native';

const Footer = ({ navigation }) => {
  const route = useRoute();

  const getColor = (screen) =>
    route.name === screen ? appColorTheme.primary : appColorTheme.text.secondary;

  return (
    <View style={styles.footer}>
      <TouchableFooterItem
        icon="home"
        label="Trang chủ"
        onPress={() => navigation.navigate('Home')}
        color={getColor('Home')}
      />
      <TouchableFooterItem
        icon="shopping-bag"
        label="Sản phẩm"
        onPress={() => navigation.navigate('Product')}
        color={getColor('Design')}
      />
      <TouchableFooterItem
        icon="carpenter"
        label="Xưởng gỗ"
        onPress={() => navigation.navigate('Woodworker')}
        color={getColor('Woodworker')}
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
    <Icon name={icon} size={30} color={color} />
    <Text style={[styles.footerLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: appColorTheme.surface,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: appColorTheme.border.light,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: 'center',
    padding: 8,
  },
  footerLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default Footer;
