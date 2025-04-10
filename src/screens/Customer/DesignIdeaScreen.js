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
import Footer from '../../components/common/footer/footer';
import axios from 'axios';
import { getServicePackageInfo } from '../../utils/servicePackageUtils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BASE_URL = 'http://10.0.2.2:8080'; // URL cho Android Emulator
// const BASE_URL = 'http://localhost:8080'; // URL cho iOS Simulator

const DesignIdeaScreen = ({ navigation }) => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDesigns();
    }, []);

    const fetchDesigns = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${BASE_URL}/api/v1/designIdea/getAllDesignIdea`);
            if (response.data && response.data.data) {
                setDesigns(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching designs:', error);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const renderServicePackageBadge = (packageName) => {
        const { label, badgeStyle, textStyle } = getServicePackageInfo(packageName);
        return (
            <View style={[styles.servicePackBadge, badgeStyle]}>
                <Text style={[styles.servicePackText, textStyle]}>{label}</Text>
            </View>
        );
    };

    const renderDesignCard = (item) => (
        <TouchableOpacity 
            key={item.designIdeaId} 
            style={styles.card}
            onPress={() => navigation.navigate('DesignDetail', { designId: item.designIdeaId })}
        >
            <Image 
                source={{ uri: item.img_urls }} 
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={styles.address} numberOfLines={1}>
                    {item.woodworkerProfile?.address}
                </Text>
                {item.woodworkerProfile?.servicePack?.name && 
                    renderServicePackageBadge(item.woodworkerProfile.servicePack.name)
                }
                <View style={styles.ratingContainer}>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name={star <= (item.totalStar / item.totalReviews) ? "star" : "star-outline"}
                                size={16}
                                color="#FFD700"
                            />
                        ))}
                    </View>
                    <Text style={styles.ratingText}>
                        {item.totalReviews > 0 ? `${(item.totalStar / item.totalReviews).toFixed(1)} (${item.totalReviews} đánh giá)` : 'Chưa có đánh giá'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A0522D" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Danh sách thiết kế</Text>
            </View>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.designList}>
                    {designs.map(renderDesignCard)}
                </View>
            </ScrollView>
            <Footer navigation={navigation} activeScreen="design" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        elevation: 2,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 80,
    },
    designList: {
        padding: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    image: {
        width: '100%',
        height: 200,
    },
    cardContent: {
        padding: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#212529',
        marginBottom: 8,
        lineHeight: 22,
    },
    address: {
        fontSize: 14,
        color: '#6C757D',
        marginBottom: 8,
        lineHeight: 20,
    },
    servicePackBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 8,
        borderWidth: 1,
    },
    servicePackText: {
        fontSize: 13,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 10,
    },
    ratingText: {
        fontSize: 14,
        color: '#495057',
        fontWeight: '500',
    },
});

export default DesignIdeaScreen; 