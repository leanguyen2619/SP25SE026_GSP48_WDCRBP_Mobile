import React, { useEffect, useState } from 'react';
import {
    StyleSheet, Text, View, ScrollView, SafeAreaView,
    TouchableOpacity, TextInput, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../../redux/slice/productSlice';
import Footer from '../../components/common/footer/footer';
import ServiceBadge from '../../components/common/Badge/ServiceBadge';

const packTypeColors = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
};

const ProductScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { list: products, loading, error } = useSelector((state) => state.product);

    const [filterOpen, setFilterOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 50000000]);

    const [filterValues, setFilterValues] = useState({
        totalStar: '',
        address: '',
        brandName: '',
        packType: '',
    });

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const normalizeText = (text) =>
        text?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    useEffect(() => {
        const [minPrice, maxPrice] = priceRange;
        const normalizedSearch = normalizeText(searchText);

        const result = products.filter((p) => {
            const starInput = parseFloat(filterValues.totalStar);

            const starOk = !filterValues.totalStar || parseFloat(p.totalStar ?? 0) === starInput;
            const addressOk = !filterValues.address ||
                normalizeText(p.address).includes(normalizeText(filterValues.address));
            const brandOk = !filterValues.brandName ||
                normalizeText(p.woodworkerName).includes(normalizeText(filterValues.brandName));
            const packOk = !filterValues.packType ||
                p.packType?.toLowerCase() === filterValues.packType.toLowerCase();
            const priceOk = p.price >= minPrice && p.price <= maxPrice;
            const searchOk = !normalizedSearch ||
                normalizeText(p.productName).includes(normalizedSearch);

            return starOk && addressOk && brandOk && packOk && priceOk && searchOk;
        });

        setFilteredProducts(result);
    }, [products, filterValues, searchText, filtersApplied, priceRange]);

    const applyFilters = () => setFiltersApplied(true);
    const clearFilters = () => {
        setFilterValues({ totalStar: '', address: '', brandName: '', packType: '' });
        setSearchText('');
        setPriceRange([0, 50000000]);
        setFiltersApplied(false);
    };

    const removeFilterChip = (key) => {
        setFilterValues((prev) => ({ ...prev, [key]: '' }));
        setFiltersApplied(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Danh sách sản phẩm</Text>
            </View>

            <View style={styles.topBar}>
                <View style={styles.searchWrapper}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <TouchableOpacity style={styles.searchIcon} onPress={applyFilters}>
                        <Icon name="search" size={22} color="#f97316" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setFilterOpen(true)} style={styles.filterToggle}>
                    <Icon name="filter-list" size={24} color="#f97316" />
                </TouchableOpacity>
            </View>

            <View style={styles.chipContainer}>
                {Object.entries(filterValues).map(([key, val]) =>
                    val ? (
                        <TouchableOpacity key={key} style={styles.chip} onPress={() => removeFilterChip(key)}>
                            <Text style={styles.chipText}>{val}</Text>
                            <Icon name="close" size={16} color="#fff" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    ) : null
                )}
            </View>

            <Modal isVisible={filterOpen} onBackdropPress={() => setFilterOpen(false)} style={styles.modal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Lọc sản phẩm</Text>

                    <TextInput style={styles.filterInput} placeholder="Số sao (ví dụ 4)" keyboardType="numeric"
                        value={filterValues.totalStar} onChangeText={(text) => setFilterValues({ ...filterValues, totalStar: text })} />
                    <TextInput style={styles.filterInput} placeholder="Địa chỉ (TPHCM...)"
                        value={filterValues.address} onChangeText={(text) => setFilterValues({ ...filterValues, address: text })} />
                    <TextInput style={styles.filterInput} placeholder="Tên xưởng"
                        value={filterValues.brandName} onChangeText={(text) => setFilterValues({ ...filterValues, brandName: text })} />

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Lọc theo giá:</Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={50000000}
                            step={500000}
                            value={priceRange[1]}
                            onValueChange={(val) => setPriceRange([priceRange[0], val])}
                        />
                        <Text>{priceRange[0].toLocaleString()} ₫ - {priceRange[1].toLocaleString()} ₫</Text>
                    </View>

                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={filterValues.packType} onValueChange={(itemValue) =>
                            setFilterValues({ ...filterValues, packType: itemValue })}>
                            <Picker.Item label="Chọn gói dịch vụ" value="" />
                            <Picker.Item label="Bronze" value="bronze" />
                            <Picker.Item label="Silver" value="silver" />
                            <Picker.Item label="Gold" value="gold" />
                        </Picker>
                    </View>

                    <View style={styles.filterActions}>
                        <TouchableOpacity style={styles.applyButton} onPress={() => {
                            applyFilters();
                            setFilterOpen(false);
                        }}>
                            <Text style={styles.buttonText}>Áp dụng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                            <Text style={styles.clearButtonText}>Làm mới</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ScrollView style={{ flex: 1 }}>
                <View style={{ padding: 16 }}>
                    <Text style={{ fontSize: 14, color: '#888' }}>
                        {loading ? 'Đang tải...' : `Tìm thấy ${filteredProducts.length} sản phẩm`}
                    </Text>
                    {error && <Text style={{ color: 'red' }}>Lỗi: {error}</Text>}
                </View>

                <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
                    {filteredProducts.map((product) => (
                        <TouchableOpacity 
                            key={product.productId} 
                            style={styles.card}
                            onPress={() => navigation.navigate('ProductDetail', { productId: product.productId })}
                        >
                            <Image source={{ uri: product.mediaUrls }} style={styles.image} />
                            <View style={{ padding: 12 }}>
                                <Text style={styles.name}>{product.productName}</Text>
                                <Text style={styles.address}>{product.address}</Text>
                                <ServiceBadge packType={product.packType} />
                                <Text style={{ color: '#f97316', marginTop: 6 }}>
                                    {product.price.toLocaleString('vi-VN')} ₫
                                </Text>
                                <View style={styles.ratingRow}>
                                    <Icon name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>
                                        {product.totalStar ?? 5} ({product.totalReviews ?? 10} đánh giá)
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <Footer navigation={navigation} />
        </SafeAreaView>
    );
};

export default ProductScreen;

const styles = StyleSheet.create({
    container: { paddingTop: 20, flex: 1, backgroundColor: '#f8f9fa' },
    header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
    headerText: { fontSize: 20, fontWeight: '600', color: '#f97316', textAlign: 'center' },
    topBar: {
        flexDirection: 'row', padding: 12, gap: 8, alignItems: 'center', backgroundColor: '#fff',
    },
    searchWrapper: { flex: 1, position: 'relative', justifyContent: 'center' },
    searchInput: {
        backgroundColor: '#f1f1f1', paddingHorizontal: 12, borderRadius: 8, height: 40, paddingRight: 40,
    },
    searchIcon: { position: 'absolute', right: 10, padding: 4 },
    filterToggle: { padding: 8 },
    chipContainer: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: 16, gap: 8, paddingBottom: 8, backgroundColor: '#f8f9fa',
    },
    chip: {
        backgroundColor: '#f97316', paddingVertical: 4, paddingHorizontal: 10,
        borderRadius: 20, flexDirection: 'row', alignItems: 'center',
    },
    chipText: { color: '#fff', fontSize: 13 },
    modal: { margin: 0, justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    },
    modalTitle: {
        fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#f97316',
    },
    filterInput: {
        backgroundColor: '#f1f1f1', borderRadius: 8,
        paddingHorizontal: 12, marginTop: 10, height: 40,
    },
    pickerWrapper: {
        backgroundColor: '#f1f1f1', marginTop: 10, borderRadius: 8, overflow: 'hidden',
    },
    filterActions: {
        flexDirection: 'row', justifyContent: 'space-between', marginTop: 16,
    },
    applyButton: {
        flex: 1, backgroundColor: '#f97316', padding: 12,
        borderRadius: 8, alignItems: 'center', marginRight: 8,
    },
    clearButton: {
        flex: 1, backgroundColor: '#ddd', padding: 12,
        borderRadius: 8, alignItems: 'center', marginLeft: 8,
    },
    buttonText: { color: '#fff', fontWeight: '600' },
    clearButtonText: { color: '#333', fontWeight: '500' },
    card: {
        backgroundColor: '#fff', marginBottom: 16,
        borderRadius: 8, overflow: 'hidden', elevation: 1,
    },
    image: { width: '100%', height: 200 },
    name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    address: { fontSize: 14, color: '#666' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    ratingText: { marginLeft: 4, color: '#888' },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#cd7f32',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginTop: 6,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
});
