import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';

const categories = [
    { id: '1', title: 'Chair', icon: require('../../../../assets/ban-lam-viec-go xoan.jpg') },
    { id: '2', title: 'Sofa', icon: require('../../../../assets/giuong-go-tu nhien.jpg') },
    { id: '3', title: 'Desk', icon: require('../../../../assets/ghe-go-soi-3-nan-mat-go-ghc-710-1.jpg') },
];

const CategoryList = () => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {categories.map((item) => (
                <TouchableOpacity key={item.id} style={styles.category}>
                    <Image source={item.icon} style={styles.icon} />
                    <Text>{item.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', marginTop: 15 },
    category: { alignItems: 'center', padding: 10, marginRight: 15, backgroundColor: '#fff', borderRadius: 10 },
    icon: { width: 100, height: 100, marginBottom: 5 },
});

export default CategoryList;
