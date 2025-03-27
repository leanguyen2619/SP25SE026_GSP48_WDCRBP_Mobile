import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appColorTheme } from '../../../theme/colors';

const Footer = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.footerItem} 
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={24} color={appColorTheme.primary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.footerItem} 
        onPress={() => navigation.navigate('Design')}
      >
        <Icon name="design-services" size={24} color={appColorTheme.text.secondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.footerItem} 
        onPress={() => navigation.navigate('Woodworker')}
      >
        <Icon name="build" size={24} color={appColorTheme.text.secondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.footerItem} 
        onPress={() => navigation.navigate('Cart')}
      >
        <Icon name="shopping-cart" size={24} color={appColorTheme.text.secondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.footerItem} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon name="person" size={24} color={appColorTheme.text.secondary} />
      </TouchableOpacity>
    </View>
  );
};

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
});

export default Footer;
