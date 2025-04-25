import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../config/appconfig";

export default function StarRating({ rating }) {
  rating = !rating ? 0 : rating > 5 ? 5 : rating < 0 ? 0 : rating;

  // Số sao đầy đủ
  const fullStars = Math.floor(rating);
  // Nếu phần thập phân >= 0.5 thì hiển thị 1 sao bán, nếu không thì 0
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
  // Số sao rỗng còn lại để đủ 5 sao
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <View style={styles.container}>
      {Array(fullStars)
        .fill("")
        .map((_, i) => (
          <View key={`full-${i}`} style={styles.starContainer}>
            <Ionicons name="star" size={16} color="#F6E05E" />
          </View>
        ))}
      {halfStar === 1 && (
        <View key="half" style={styles.starContainer}>
          <Ionicons name="star-half" size={16} color="#F6E05E" />
        </View>
      )}
      {Array(emptyStars)
        .fill("")
        .map((_, i) => (
          <View key={`empty-${i}`} style={styles.starContainer}>
            <Ionicons name="star-outline" size={16} color="#F6E05E" />
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starContainer: {
    marginRight: 2,
  },
});
