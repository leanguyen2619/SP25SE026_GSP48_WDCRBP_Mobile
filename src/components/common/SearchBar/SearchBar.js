import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = () => {
    return (
        <View style={styles.container}>
            <Feather name="search" size={20} color="gray" />
            <TextInput
                placeholder="Chair, desk, lamp, etc"
                style={styles.input}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 45,
        marginTop: 15,
    },
    input: {
        flex: 1,
        marginLeft: 10,
    },
});

export default SearchBar;
