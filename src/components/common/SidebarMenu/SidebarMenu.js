import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const MenuItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        {icon}
        <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
);

const SidebarMenu = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.menuTitle}>Menu thợ mộc</Text>
            <ScrollView style={styles.menuContainer}>
                <MenuItem 
                    icon={<MaterialIcons name="dashboard" size={24} color="#666" />}
                    label="Tổng quan"
                    onPress={() => navigation.navigate('WoodworkerDashboard')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="shopping-cart" size={24} color="#666" />}
                    label="Đơn hàng"
                    onPress={() => navigation.navigate('Orders')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="build" size={24} color="#666" />}
                    label="BH & Sửa chữa"
                    onPress={() => navigation.navigate('Maintenance')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="miscellaneous-services" size={24} color="#666" />}
                    label="Dịch vụ"
                    onPress={() => navigation.navigate('Services')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="design-services" size={24} color="#666" />}
                    label="Thiết kế"
                    onPress={() => navigation.navigate('Designs')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="inventory" size={24} color="#666" />}
                    label="Sản phẩm"
                    onPress={() => navigation.navigate('Products')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="post-add" size={24} color="#666" />}
                    label="Bài đăng"
                    onPress={() => navigation.navigate('Posts')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="report-problem" size={24} color="#666" />}
                    label="Khiếu nại"
                    onPress={() => navigation.navigate('Complaints')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="star" size={24} color="#666" />}
                    label="Đánh giá"
                    onPress={() => navigation.navigate('Ratings')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="account-balance-wallet" size={24} color="#666" />}
                    label="Ví"
                    onPress={() => navigation.navigate('Wallet')}
                />
                <MenuItem 
                    icon={<MaterialIcons name="person" size={24} color="#666" />}
                    label="Hồ sơ"
                    onPress={() => navigation.navigate('WoodworkerProfile')}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuContainer: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    menuLabel: {
        marginLeft: 16,
        fontSize: 16,
        color: '#333',
    },
});

export default SidebarMenu; 