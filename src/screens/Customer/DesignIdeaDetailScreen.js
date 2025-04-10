import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesignDetail, clearDesign } from '../../redux/slice/designSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;

const DesignIdeaDetailScreen = ({ route, navigation }) => {
    const { designId } = route.params;
    const dispatch = useDispatch();
    const { currentDesign: design, loading, error } = useSelector((state) => state.design);
    const [imageToken, setImageToken] = React.useState(null);

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            setImageToken(token);
        };
        getToken();
        dispatch(fetchDesignDetail(designId));
        console.log('Design Detail Data:', design);
        return () => {
            dispatch(clearDesign());
        };
    }, [dispatch, designId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f97316" />
            </View>
        );
    }

    if (error || !design) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error || 'Không tìm thấy thông tin thiết kế'}
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết thiết kế</Text>
                <View style={{width: 24}} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.imageContainer}>
                    {design.img_urls?.[0] ? (
                        <>
                            <Image
                                source={{ 
                                    uri: design.img_urls[0],
                                    headers: {
                                        'Authorization': `Bearer ${imageToken}`
                                    },
                                    cache: 'reload'
                                }}
                                style={styles.mainImage}
                                resizeMode="cover"
                                onLoadStart={() => {
                                    console.log('Đang tải ảnh từ URL:', design.img_urls[0]);
                                }}
                                onError={(error) => {
                                    console.log('Lỗi tải ảnh từ URL:', design.img_urls[0]);
                                    console.log('Chi tiết lỗi:', error.nativeEvent);
                                }}
                            />
                        </>
                    ) : (
                        <View style={[styles.mainImage, styles.placeholderContainer]}>
                            <Ionicons name="image-outline" size={48} color="#666" />
                            <Text style={styles.placeholderText}>Chưa có hình ảnh</Text>
                        </View>
                    )}
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.designName}>{design.name || ''}</Text>
                    
                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name={star <= (design.totalStar || 0) ? "star" : "star-outline"}
                                size={20}
                                color="#FFD700"
                            />
                        ))}
                        <Text style={styles.ratingText}>
                            {design.totalReviews ? `${design.totalReviews} đánh giá` : 'Chưa có đánh giá'}
                        </Text>
                    </View>

                    {/* Product Info */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Loại sản phẩm:</Text>
                            <Text style={styles.value}>
                                {design.category?.categoryName || 'Tủ đứng độc lập'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Lắp đặt:</Text>
                            <Text style={styles.value}>Không cần lắp đặt</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.descriptionTitle}>Mô tả:</Text>
                        <Text style={styles.descriptionText}>
                            {design.description || `Tủ quần áo đứng độc lập là lựa chọn hoàn hảo cho những ai mong muốn sự linh hoạt và tiện dụng trong không gian sống. Với thiết kế sang trọng, đường nét tinh tế, sản phẩm này không chỉ giúp lưu trữ quần áo gọn gàng mà còn tạo điểm nhấn thẩm mỹ cho phòng ngủ.\n\nĐặc điểm nổi bật:\n- Thiết kế đa dạng: Nhiều kích thước, kiểu dáng phù hợp với mọi phong cách nội thất.`}
                        </Text>
                    </View>

                    {/* Product Configuration */}
                    <View style={styles.configSection}>
                        <Text style={styles.configTitle}>Cấu hình sản phẩm</Text>
                        
                        <View style={styles.configGroup}>
                            <Text style={styles.configLabel}>Loại gỗ</Text>
                            <View style={styles.optionsContainer}>
                                <TouchableOpacity 
                                    style={[styles.optionButton, styles.optionSelected]}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.optionText, styles.optionTextSelected]}>
                                        {design.woodType || 'Xoan đào'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.optionButton}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.optionText}>Sồi</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.configGroup}>
                            <Text style={styles.configLabel}>Kích thước (dài x rộng x cao - cm)</Text>
                            <View style={styles.optionsContainer}>
                                <TouchableOpacity 
                                    style={[styles.optionButton, styles.optionSelected]}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.optionText, styles.optionTextSelected]}>
                                        {design.dimensions || '2000 x 1500 x 300'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.optionButton}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.optionText}>1500 x 1000 x 300</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Price */}
                    <View style={styles.priceSection}>
                        <Text style={styles.price}>
                            {design?.price !== null && design?.price !== undefined && design?.price !== 0
                                ? `${design.price.toLocaleString('vi-VN')} đ`
                                : `${(5000000).toLocaleString('vi-VN')} đ`}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.orderButton}>
                            <Text style={styles.orderButtonText}>ĐẶT NGAY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cartButton}>
                            <Text style={styles.cartButtonText}>Thêm vào giỏ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    backButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#f5f5f5',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    placeholderText: {
        marginTop: 8,
        color: '#666',
        fontSize: 14,
    },
    contentContainer: {
        padding: 16,
    },
    designName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    infoSection: {
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 120,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    value: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    descriptionSection: {
        marginBottom: 20,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    configSection: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    configTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    configGroup: {
        marginBottom: 20,
    },
    configLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
        fontWeight: '500',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#e5e5e5',
        backgroundColor: '#fff',
        minWidth: '45%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    optionSelected: {
        backgroundColor: '#f97316',
        borderColor: '#f97316',
    },
    optionText: {
        color: '#333',
        fontSize: 15,
        fontWeight: '500',
    },
    optionTextSelected: {
        color: '#fff',
    },
    priceSection: {
        marginBottom: 20,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f97316',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    orderButton: {
        flex: 1,
        backgroundColor: '#f97316',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cartButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f97316',
    },
    cartButtonText: {
        color: '#f97316',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#dc3545',
        textAlign: 'center',
    },
});

export default DesignIdeaDetailScreen; 