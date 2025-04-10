import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    SafeAreaView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { getServicePackageInfo } from '../../utils/servicePackageUtils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BASE_URL = 'http://10.0.2.2:8080';

const renderServicePackageBadge = (packageName) => {
    const { label, badgeStyle, textStyle } = getServicePackageInfo(packageName);
    return (
        <View style={[styles.servicePackBadge, badgeStyle]}>
            <Text style={[styles.servicePackText, textStyle]}>{label}</Text>
        </View>
    );
};

const DesignIdeaDetailScreen = ({ route, navigation }) => {
    const { designId } = route.params;
    const [design, setDesign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDesignDetail();
    }, [designId]);

    const fetchDesignDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${BASE_URL}/api/v1/designIdea/getDesignById/${designId}`);
            if (response.data && response.data.data) {
                setDesign(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching design detail:', error);
            setError('Không thể tải thông tin chi tiết. Vui lòng thử lại sau.');
            Alert.alert('Thông báo', 'Không thể tải thông tin chi tiết. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const renderRating = (totalStar, totalReviews) => {
        const rating = totalReviews > 0 ? totalStar / totalReviews : 0;
        return (
            <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                            key={star}
                            name={star <= rating ? "star" : "star-outline"}
                            size={20}
                            color="#FFD700"
                        />
                    ))}
                </View>
                <Text style={styles.ratingText}>
                    {rating.toFixed(1)} ({totalReviews} đánh giá)
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A0522D" />
            </View>
        );
    }

    if (!design) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Không tìm thấy thông tin thiết kế</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header với nút back */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết thiết kế</Text>
                </View>

                {/* Hình ảnh chính */}
                <Image
                    source={{ uri: design.img_urls }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />

                {/* Thông tin cơ bản */}
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{design.name}</Text>
                    {renderRating(design.totalStar, design.totalReviews)}
                    
                    {/* Thông tin thợ mộc */}
                    <View style={styles.woodworkerContainer}>
                        <Image
                            source={{ uri: design.woodworkerProfile.imgUrl }}
                            style={styles.woodworkerImage}
                        />
                        <View style={styles.woodworkerInfo}>
                            <Text style={styles.woodworkerName}>
                                {design.woodworkerProfile.brandName}
                            </Text>
                            {design.woodworkerProfile.servicePack?.name && 
                                renderServicePackageBadge(design.woodworkerProfile.servicePack.name)
                            }
                            <Text style={styles.address}>
                                {design.woodworkerProfile.address}
                            </Text>
                        </View>
                    </View>

                    {/* Danh mục */}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.sectionTitle}>Danh mục:</Text>
                        <Text style={styles.categoryText}>
                            {design.category.categoryName}
                        </Text>
                    </View>

                    {/* Mô tả */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Mô tả chi tiết:</Text>
                        <Text style={styles.description}>
                            {design.description}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Nút liên hệ */}
            <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => {
                    // Xử lý logic liên hệ ở đây
                    Alert.alert('Thông báo', 'Tính năng đang được phát triển');
                }}
            >
                <Text style={styles.contactButtonText}>Liên hệ thợ mộc</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    mainImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.75,
    },
    infoContainer: {
        padding: 15,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 10,
    },
    ratingText: {
        fontSize: 16,
        color: '#666',
    },
    woodworkerContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 15,
    },
    woodworkerImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    woodworkerInfo: {
        flex: 1,
    },
    woodworkerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    servicePackBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginVertical: 8,
        borderWidth: 1,
    },
    servicePackText: {
        fontSize: 14,
        fontWeight: '600',
    },
    address: {
        fontSize: 14,
        color: '#666',
    },
    categoryContainer: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    description: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    contactButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#A0522D',
        padding: 15,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
        color: '#FF0000',
        textAlign: 'center',
    },
});

export default DesignIdeaDetailScreen; 