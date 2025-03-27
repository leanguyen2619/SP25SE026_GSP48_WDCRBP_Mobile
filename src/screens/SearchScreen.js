import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { appColorTheme } from '../theme/colors';
// import Footer from '../components/common/footer/Footer';
// import FilterSidebar from '../components/common/FilterSidebar/FilterSidebar';

const SearchScreen = () => {
  const navigation = useNavigation();
  const labels = Array(10).fill('Label'); // Tạo mảng 10 phần tử "Label"

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView style={styles.scrollView}>
          {/* Search Header */}
          <View style={styles.searchHeader}>
            <View style={styles.searchTopContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm..."
                  placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.searchButton}>
                  <Text style={styles.searchButtonText}>TÌM KIẾM</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.searchTitle}>Tìm kiếm phổ biến</Text>
          </View>

          {/* Labels List */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {labels.map((label, index) => (
              <TouchableOpacity key={index} style={styles.labelItem}>
                <Text style={styles.labelText}>{label}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.footerSpace} />
          </ScrollView>
        </ScrollView>
        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.background,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 70, // Space for footer
  },
  searchHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  },
  labelItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  labelText: {
    fontSize: 14,
    color: '#333',
  },
  footerSpace: {
    height: Platform.OS === 'ios' ? 90 : 70,
  },
});

export default SearchScreen; 