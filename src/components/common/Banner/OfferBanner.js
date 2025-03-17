import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const OfferBanner = () => {
    return (
        <View style={styles.banner}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>High quality sofa</Text>
                <Text style={styles.discount}>70% off</Text>
                <Text style={styles.subtitle}>Good for home</Text>
            </View>
            <Image source={require('../../../../assets/ghe-go-soi-3-nan-mat-go-ghc-710-1.jpg')} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    banner: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderRadius: 10, marginTop: 15 },
    textContainer: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold' },
    discount: { fontSize: 22, fontWeight: 'bold', color: 'orange' },
    subtitle: { fontSize: 14, color: 'gray' },
    image: { width: 100, height: 60, resizeMode: 'contain' },
});

export default OfferBanner;
