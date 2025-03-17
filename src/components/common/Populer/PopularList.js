import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

const products = [
    { id: '1', name: 'Sweden chair', price: 400, image: require('../../../../assets/sweden-chair.jpg') },
    { id: '2', name: 'Nordiken chair', price: 999, image: require('../../../../assets/nordiken-chair.jpg') },
    { id: '3', name: 'Bitopa sofa', price: 599, image: require('../../../../assets/bitopa-sofa.jpg') },
    { id: '4', name: 'Jan sofa', price: 999, image: require('../../../../assets/jan-sofa.jpg') },
];

const PopularList = () => {
    return (
        <FlatList
            style={{ marginTop: 15 }}
            data={products}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Image source={item.image} style={styles.image} />
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.price}>${item.price}</Text>
                </View>
            )}
            showsHorizontalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    card: { width: 160, backgroundColor: '#fff', borderRadius: 10, padding: 10, marginRight: 15 },
    image: { width: '100%', height: 200, borderRadius: 10 },
    title: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
    price: { fontSize: 16, fontWeight: 'bold', color: 'black' },
});

export default PopularList;
