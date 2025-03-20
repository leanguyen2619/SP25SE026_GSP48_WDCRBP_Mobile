import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

const FilterSidebar = ({
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity,
    rating,
    setRating,
    applyFilters
}) => {
    return (
        <View style={styles.sidebar}>
            <Text style={styles.filterTitle}>Bộ lọc</Text>

            {/* Category Filter */}
            <Text style={styles.label}>Danh mục</Text>
            <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
                <Picker.Item label="Chọn loại sản phẩm" value="" />
                <Picker.Item label="Giường" value="Giường" />
                <Picker.Item label="Sofa" value="Sofa" />
                <Picker.Item label="Tủ" value="Tủ" />
                <Picker.Item label="Bàn" value="Bàn" />
            </Picker>

            {/* City Filter */}
            <Text style={styles.label}>Tỉnh thành</Text>
            <Picker
                selectedValue={selectedCity}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedCity(itemValue)}
            >
                <Picker.Item label="Chọn tỉnh, thành" value="" />
                <Picker.Item label="Hà Nội" value="Hà Nội" />
                <Picker.Item label="Hồ Chí Minh" value="Hồ Chí Minh" />
                <Picker.Item label="Đà Nẵng" value="Đà Nẵng" />
            </Picker>

            {/* Star Rating Filter */}
            <Text style={styles.label}>Lọc theo số sao</Text>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={0.5}
                value={rating}
                onValueChange={(value) => setRating(value)}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#007AFF"
            />
            <Text style={styles.ratingLabel}>⭐ {rating.toFixed(1)} - 5.0</Text>

            {/* Keyword Input */}
            <Text style={styles.label}>Từ khóa</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập từ khóa..."
                value={keyword}
                onChangeText={setKeyword}
            />

            {/* Apply Filters Button */}
            <TouchableOpacity style={styles.filterButton} onPress={applyFilters}>
                <Text style={styles.filterText}>Lọc</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginRight: 10,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    ratingLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        borderRadius: 5,
        marginBottom: 10,
    },
    filterButton: {
        backgroundColor: '#E27D60',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    filterText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default FilterSidebar;
