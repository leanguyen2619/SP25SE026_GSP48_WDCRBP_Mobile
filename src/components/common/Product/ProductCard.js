import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product }) => {
    return (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { width: 160, backgroundColor: '#fff', borderRadius: 10, padding: 10, marginRight: 15 },
    image: { width: '100%', height: 100, borderRadius: 10 },
    title: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
    price: { fontSize: 16, fontWeight: 'bold', color: 'black' },
});

export default ProductCard;
