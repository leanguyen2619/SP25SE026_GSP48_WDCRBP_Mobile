import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/common/SearchBar/SearchBar';
import CategoryList from '../components/common/Category/CategoryList';
import OfferBanner from '../components/common/Banner/OfferBanner';
import SaleBanner from '../components/common/Banner/SaleBanner';
import PopularList from '../components/common/Populer/PopularList';
import Footer from '../components/common/footer/footer';

const HomeScreen = () => {
    const [isNotified, setIsNotified] = useState(false);

    const handleNotificationPress = () => {
        setIsNotified(!isNotified); 
    };

    return (
        <SafeAreaView style={styles.container}>
         <View style={styles.content}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <ScrollView 
                style={styles.scrollContainer} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }} // Ensure footer doesn't hide content
            >
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Explore What{"\n"}Your Home Needs</Text>
                    <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
                        <Ionicons 
                            name={isNotified ? "notifications" : "notifications-outline"} 
                            size={28} 
                            color="orange" 
                        />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <SearchBar />

                {/* Categories Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all →</Text>
                    </TouchableOpacity>
                </View>
                <CategoryList />

                {/* Offer Banner */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Offer Banner</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all →</Text>
                    </TouchableOpacity>
                </View>
                <OfferBanner />

                {/* Popular Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all →</Text>
                    </TouchableOpacity>
                </View>
                <PopularList />

                {/* Sale Banner */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Sale Banner</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all →</Text>
                    </TouchableOpacity>
                </View>
                <SaleBanner />
            </ScrollView>
        </KeyboardAvoidingView>
        <Footer />
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
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#000',
        flexWrap: 'wrap', 
        flex: 1, 
    },
    notificationButton: {
        padding: 8, 
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAll: {
        color: 'orange',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
