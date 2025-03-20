import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const WoodworkerScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text>WoodworkerScreen</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    content: {
        flex: 1,
    },
});

export default WoodworkerScreen;
