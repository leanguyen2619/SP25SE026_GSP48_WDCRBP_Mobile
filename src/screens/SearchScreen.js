import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/common/Footer/footer';

const SearchScreen = () => {
  const navigation = useNavigation();
  const labels = Array(10).fill('Label'); // Tạo mảng 10 phần tử "Label"

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <View style={styles.searchTopContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('Home')}
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
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainContainer: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerSpace: {
    height: 80,
  },
});

export default SearchScreen; 