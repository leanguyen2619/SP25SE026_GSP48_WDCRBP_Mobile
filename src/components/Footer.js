import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Dùng MaterialIcons từ react-native-vector-icons

const MyFooter = () => {
  return (
    <View style={styles.footer}>
      {/* Trang chủ Icon */}
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="home" size={22} color="#4ECDC4" />
        <Text style={[styles.iconText, styles.activeText]}>Trang chủ</Text>
      </TouchableOpacity>

      {/* Cửa hàng Icon */}
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="store" size={22} color="#666" />
        <Text style={styles.iconText}>Cửa hàng</Text>
      </TouchableOpacity>

      {/* Tư vấn Icon */}
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="chat" size={22} color="#666" />
        <Text style={styles.iconText}>Tư vấn</Text>
      </TouchableOpacity>

      {/* Tài khoản Icon */}
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="person" size={22} color="#666" />
        <Text style={styles.iconText}>Tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  activeText: {
    color: '#4ECDC4',
    fontWeight: '500',
  },
});

export default MyFooter;
