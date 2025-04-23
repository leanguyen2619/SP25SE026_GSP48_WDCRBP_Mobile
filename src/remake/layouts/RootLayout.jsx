import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";

export default function RootLayout({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.container}>{children}</View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5", // app_grey.1 equivalent
    fontFamily: "Nunito Sans",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
    paddingTop: 40,
    minHeight: "70%",
  },
  container: {
    width: "90%",
    maxWidth: 1400,
    alignSelf: "center",
  },
});
