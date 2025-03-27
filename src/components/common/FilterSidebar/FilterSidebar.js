import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appColorTheme } from '../../../theme/colors';

const FilterSidebar = ({ onClose, onApply }) => {
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [rating, setRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    'Bàn ăn',
    'Tủ quần áo',
    'Giường ngủ',
    'Bàn làm việc',
    'Kệ sách',
    'Tủ bếp',
  ];

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bộ lọc</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color={appColorTheme.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khoảng giá</Text>
          <View style={styles.priceInputs}>
            <TextInput
              style={styles.input}
              value={priceRange[0].toString()}
              onChangeText={(text) => setPriceRange([parseInt(text) || 0, priceRange[1]])}
              keyboardType="numeric"
              placeholder="Từ"
            />
            <Text style={styles.separator}>-</Text>
            <TextInput
              style={styles.input}
              value={priceRange[1].toString()}
              onChangeText={(text) => setPriceRange([priceRange[0], parseInt(text) || 0])}
              keyboardType="numeric"
              placeholder="Đến"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Icon
                  name={star <= rating ? "star" : "star-border"}
                  size={24}
                  color={star <= rating ? "#FFD700" : appColorTheme.text.tertiary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category) && styles.selectedCategory,
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(category) && styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setPriceRange([0, 10000000]);
            setRating(0);
            setSelectedCategories([]);
          }}
        >
          <Text style={styles.resetButtonText}>Đặt lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => onApply({
            priceRange,
            rating,
            categories: selectedCategories,
          })}
        >
          <Text style={styles.applyButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColorTheme.border.light,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: appColorTheme.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColorTheme.text.primary,
    marginBottom: 12,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColorTheme.border.light,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
  },
  separator: {
    marginHorizontal: 8,
    color: appColorTheme.text.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: appColorTheme.grey_0,
  },
  selectedCategory: {
    backgroundColor: appColorTheme.primary,
  },
  categoryText: {
    color: appColorTheme.text.secondary,
  },
  selectedCategoryText: {
    color: appColorTheme.text.inverse,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: appColorTheme.border.light,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: appColorTheme.grey_0,
    alignItems: 'center',
  },
  resetButtonText: {
    color: appColorTheme.text.secondary,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: appColorTheme.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    color: appColorTheme.text.inverse,
    fontWeight: '600',
  },
});

export default FilterSidebar;
