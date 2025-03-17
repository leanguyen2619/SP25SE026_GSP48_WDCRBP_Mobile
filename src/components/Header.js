import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const MyAppBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <StatusBar 
        backgroundColor="#ffffff"
        barStyle="dark-content"
        translucent={true}
      />
      <View style={styles.appBar}>
        {/* Menu Icon */}
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>

        {/* Tiêu đề */}
        <Text style={styles.title}>GSP48 Store</Text>

        {/* Right Icons Container */}
        <View style={styles.rightIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Icon name="search" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-none" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="shopping-cart" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 48,
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  title: {    
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MyAppBar;
