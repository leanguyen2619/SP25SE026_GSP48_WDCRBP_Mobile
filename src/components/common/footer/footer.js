import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
<<<<<<< Updated upstream
=======
import FooterBar from "../footerBar/footerBar"; // Import the common footer component
>>>>>>> Stashed changes

const Footer = () => {
  const navigation = useNavigation();

  return (
<<<<<<< Updated upstream
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerItem}>
        <Ionicons name="home" size={24} color="orange" />
        <Text style={styles.footerText}>Trang chủ</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.footerItem}>
        <Ionicons name="search" size={24} color="gray" />
        <Text style={[styles.footerText, { color: 'gray' }]}>Tìm kiếm</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.footerItem}
        onPress={() => navigation.navigate('Cart')}
      >
        <Ionicons name="cart" size={24} color="gray" />
        <Text style={[styles.footerText, { color: 'gray' }]}>Giỏ hàng</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.footerItem}>
        <Ionicons name="person" size={24} color="gray" />
        <Text style={[styles.footerText, { color: 'gray' }]}>Tài khoản</Text>
      </TouchableOpacity>
=======
    <View style={styles.container}>
     <FooterBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDesign={() => navigation.navigate("Design")}
        onPressWoodworker={() => navigation.navigate("Woodworker")}
        onPressCart={() => navigation.navigate("Cart")}
        onPressProfile={() => navigation.navigate("Profile")}
      />
>>>>>>> Stashed changes
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
    color: 'orange',
  },
});

export default Footer;
