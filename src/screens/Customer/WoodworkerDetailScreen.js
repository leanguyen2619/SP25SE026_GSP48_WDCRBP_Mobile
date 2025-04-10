import React, { useState, useEffect } from 'react';
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
    Linking,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import ServiceBadge from '../../components/common/Badge/ServiceBadge';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BASE_URL = 'http://10.0.2.2:8080';

const WoodworkerDetailScreen = ({ route, navigation }) => {
    const { woodworkerId } = route.params;
    const [woodworker, setWoodworker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWoodworkerDetail();
    }, [woodworkerId]);

    const fetchWoodworkerDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${BASE_URL}/api/v1/ww/${woodworkerId}`);
            console.log('API Response:', response.data);
            if (response.data && response.data.data) {
                setWoodworker(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching woodworker detail:', error);
            setError('Không thể tải thông tin chi tiết. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleContactPress = () => {
        if (woodworker?.user?.phone) {
            Linking.openURL(`tel:${woodworker.user.phone}`);
        } else {
            Alert.alert('Thông báo', 'Không thể kết nối cuộc gọi vào lúc này');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f97316" />
            </View>
        );
    }

    if (error || !woodworker) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error || 'Không tìm thấy thông tin xưởng mộc'}
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
                <Text style={styles.headerTitle}>Chi tiết xưởng mộc</Text>
                <View style={{width: 24}} />
            </View>

            <ScrollView style={styles.scrollView}>
                <Image
                    source={{ uri: woodworker.imgUrl || 'https://via.placeholder.com/400x200' }}
                    style={styles.coverImage}
                    resizeMode="cover"
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.brandName}>{woodworker.brandName}</Text>
                    
                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons
                                    key={star}
                                    name={star <= (woodworker.totalStar || 0) ? "star" : "star-outline"}
                                    size={20}
                                    color="#FFD700"
                                />
                            ))}
                        </View>
                        <Text style={styles.ratingText}>
                            {woodworker.totalReviews} đánh giá
                        </Text>
                    </View>

                    {/* Service Package Badge */}
                    {woodworker.servicePack && (
                        <View style={styles.badgeContainer}>
                            <ServiceBadge packType={woodworker.servicePack.name} />
                        </View>
                    )}

                    {/* Contact Info */}
                    <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
                    <View style={styles.contactInfo}>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={20} color="#666" />
                            <Text style={styles.infoText}>{woodworker.address}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={20} color="#666" />
                            <Text style={styles.infoText}>{woodworker.user?.phone || 'Chưa cập nhật'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="mail-outline" size={20} color="#666" />
                            <Text style={styles.infoText}>{woodworker.user?.email || 'Chưa cập nhật'}</Text>
                        </View>
                    </View>

                    {/* Business Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin kinh doanh</Text>
                        <View style={styles.businessInfo}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Loại hình:</Text>
                                <Text style={styles.value}>{woodworker.businessType}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Mã số thuế:</Text>
                                <Text style={styles.value}>{woodworker.taxCode}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Service Package Info */}
                    {woodworker.servicePack && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Gói dịch vụ</Text>
                            <View style={styles.packageInfo}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Tên gói:</Text>
                                    <Text style={styles.value}>{woodworker.servicePack.name}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Thời hạn:</Text>
                                    <Text style={styles.value}>{woodworker.servicePack.duration} tháng</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Bài đăng/tháng:</Text>
                                    <Text style={styles.value}>{woodworker.servicePack.postLimitPerMonth}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Thời gian:</Text>
                                    <Text style={styles.value}>
                                        {format(new Date(woodworker.servicePackStartDate), 'dd/MM/yyyy')} - 
                                        {format(new Date(woodworker.servicePackEndDate), 'dd/MM/yyyy')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Bio */}
                    {woodworker.bio && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Giới thiệu</Text>
                            <Text style={styles.bioText}>{woodworker.bio}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={handleContactPress}
                >
                    <Ionicons name="call" size={24} color="#fff" />
                    <Text style={styles.contactButtonText}>Liên hệ xưởng mộc</Text>
                </TouchableOpacity>
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
    coverImage: {
        width: SCREEN_WIDTH,
        height: 200,
    },
    infoContainer: {
        padding: 16,
    },
    brandName: {
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
    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
    },
    badgeContainer: {
        marginBottom: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    contactInfo: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
    },
    businessInfo: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
    },
    packageInfo: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    label: {
        width: 120,
        fontSize: 14,
        color: '#666',
    },
    value: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    bioText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f97316',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        marginBottom: 32,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
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

export default WoodworkerDetailScreen; 