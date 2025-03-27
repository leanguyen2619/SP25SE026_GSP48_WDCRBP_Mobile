import React, { useState } from 'react';
import { SafeAreaView, View, FlatList, Image, StyleSheet, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterSidebar from '../../components/common/FilterSidebar/FilterSidebar';
import Footer from '../../components/common/Footer/footer';


// Get screen dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const products = [
    { id: '1', title: 'Giường 2 tầng', image: require('../../../assets/bed.png'), rating: 4.5, code: '#AB8s4', category: 'Giường', city: 'Hà Nội' },
    { id: '2', title: 'Ghế Sofa', image: require('../../../assets/bed.png'), rating: 3.8, code: '#AB123', category: 'Sofa', city: 'Hồ Chí Minh' },
    { id: '3', title: 'Tủ quần áo', image: require('../../../assets/bed.png'), rating: 4.2, code: '#XYZ88', category: 'Tủ', city: 'Đà Nẵng' },
    { id: '4', title: 'Bàn làm việc', image: require('../../../assets/bed.png'), rating: 2.9, code: '#LMN90', category: 'Bàn', city: 'Hà Nội' },
    { id: '5', title: 'Ghế văn phòng', image: require('../../../assets/bed.png'), rating: 4.0, code: '#AABB22', category: 'Ghế', city: 'Huế' },
    { id: '6', title: 'Tủ bếp gỗ', image: require('../../../assets/bed.png'), rating: 4.7, code: '#BB33CC', category: 'Tủ', city: 'Hải Phòng' },
    { id: '7', title: 'Bàn ăn gia đình', image: require('../../../assets/bed.png'), rating: 3.5, code: '#CCDDEE', category: 'Bàn', city: 'Đà Lạt' },
    { id: '7', title: 'Bàn ăn gia đình', image: require('../../../assets/bed.png'), rating: 3.5, code: '#CCDDEE', category: 'Bàn', city: 'Đà Lạt' },
];

const DesignScreen = () => {
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [rating, setRating] = useState(1.0);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [showFilter, setShowFilter] = useState(false);

    // Animated value for smooth fade-in effect
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Open Filter (Full-Screen Popup)
    const openFilter = () => {
        setShowFilter(true);
        Animated.timing(fadeAnim, {
            toValue: 1, // Fully visible
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Close Filter
    const closeFilter = () => {
        Animated.timing(fadeAnim, {
            toValue: 0, // Fully hidden
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowFilter(false)); // Hide after animation
    };

    // Apply Filters
    const applyFilters = () => {
        let filtered = products.filter((product) => 
            (selectedCategory === '' || product.category === selectedCategory) &&
            (selectedCity === '' || product.city === selectedCity) &&
            (product.rating >= rating) &&
            (keyword === '' || product.title.toLowerCase().includes(keyword.toLowerCase()))
        );
        setFilteredProducts(filtered);
        closeFilter(); // Hide filter after applying
    };

    // Render Product Card
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.code}>{item.code}</Text>
            <View style={styles.rating}>
                <Ionicons name="star" size={16} color="gold" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Toggle Filter Button */}
            {!showFilter && (
                <TouchableOpacity style={styles.toggleButton} onPress={openFilter}>
                    <Ionicons name="filter-outline" size={24} color="black" />
                    <Text style={styles.toggleText}>Filter</Text>
                </TouchableOpacity>
            )}

            {/* Full-Screen Animated Filter Popup */}
            {showFilter && (
                <Animated.View style={[styles.fullScreenFilter, { opacity: fadeAnim }]}>
                    <SafeAreaView style={styles.filterContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeFilter}>
                            <Ionicons name="close-outline" size={30} color="black" />
                        </TouchableOpacity>
                        <View style={styles.filterBox}>
                            <FilterSidebar
                                keyword={keyword}
                                setKeyword={setKeyword}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                selectedCity={selectedCity}
                                setSelectedCity={setSelectedCity}
                                rating={rating}
                                setRating={setRating}
                                applyFilters={applyFilters}
                            />
                        </View>
                    </SafeAreaView>
                </Animated.View>
            )}

            {/* Product List (Hidden When Filter is Open) */}
            {!showFilter && (
               <SafeAreaView style={styles.FlatListContainer}>
                <Text style={{ textAlign: 'center', margin: 10, fontWeight: 'bold' }}>Danh sách sản phẩm</Text>
                <View style={styles.content}>
                    <FlatList
                        data={filteredProducts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.grid}
                    />
                    <Footer />
                </View>
                </SafeAreaView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    toggleButton: {
        position: "absolute", 
        left: 10, 
        top: 50,  
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        zIndex: 10, 
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleText: {
        marginLeft: 5,
        fontWeight: 'bold',
    },
    fullScreenFilter: {
        position: "absolute",
        width: SCREEN_WIDTH, 
        height: SCREEN_HEIGHT, 
        backgroundColor: "#fff",
        zIndex: 10, 
        padding: 20,
    },
    filterContainer: {
        flex: 1,
        gap: 10,
    },
    filterBox: {
        marginTop: 50,
        width: SCREEN_WIDTH * 0.9 , // Make it responsive
        backgroundColor: "#fff",
        borderRadius: 15,
        alignItems: 'center', // Center content
        justifyContent: 'center', // Align vertically
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    closeButton: {
        position: "absolute",
        left: 0,
        top: 10,
    },
    FlatListContainer: {
        marginTop: 50,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        flex: 1,
    },
    content: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '45%',
        margin: 5,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    title: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    code: {
        color: '#666',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingText: {
        marginLeft: 5,
        fontWeight: 'bold',
    },
});

export default DesignScreen;
