import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SaleBanner = () => {
    return (
        <View style={styles.banner}>
        <View style={styles.textContainer}>
            <Text style={styles.saleText}>Sale</Text>
            <Text>All chair up to <Text style={styles.discount}>70% off</Text></Text>
        </View>
        <Image source={require('../../../../assets/ghe-go-soi-3-nan-mat-go-ghc-710-1.jpg')} style={styles.image} />
    </View>
    );
};

const styles = StyleSheet.create({
    banner: { flexDirection: 'row', padding: 15, backgroundColor: '#fdebd0', borderRadius: 10, marginTop: 15 },
    textContainer: { flex: 1 },
    saleText: { fontSize: 18, fontWeight: 'bold', color: 'orange' },
    discount: { fontSize: 22, fontWeight: 'bold', color: 'red'},
    image: { width: 100, height: 60, resizeMode: 'contain' },
});

export default SaleBanner;
