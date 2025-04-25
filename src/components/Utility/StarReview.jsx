import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function StarReview({ totalStar, totalReviews }) {
  // Calculate rating, handle division by zero
  const calculatedRating = totalReviews > 0 ? totalStar / totalReviews : 0;
  // Normalize rating between 0-5
  const rating = !calculatedRating
    ? 0
    : calculatedRating > 5
    ? 5
    : calculatedRating < 0
    ? 0
    : calculatedRating;

  // Số sao đầy đủ
  const fullStars = Math.floor(rating);
  // Nếu phần thập phân >= 0.5 thì hiển thị 1 sao bán, nếu không thì 0
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
  // Số sao rỗng còn lại để đủ 5 sao
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array(fullStars)
          .fill("")
          .map((_, i) => (
            <FontAwesome
              key={`full-${i}`}
              name="star"
              size={10}
              color="#FFD700"
              style={styles.star}
            />
          ))}
        {halfStar === 1 && (
          <FontAwesome
            key="half"
            name="star-half-o"
            size={10}
            color="#FFD700"
            style={styles.star}
          />
        )}
        {Array(emptyStars)
          .fill("")
          .map((_, i) => (
            <FontAwesome
              key={`empty-${i}`}
              name="star-o"
              size={10}
              color="#FFD700"
              style={styles.star}
            />
          ))}
      </View>
      {totalReviews > 0 && (
        <Text style={styles.reviewText}>
          {rating.toFixed(1)} ({totalReviews} đánh giá)
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: 2,
  },
  reviewText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#B7791F", // yellow.700 equivalent
  },
});
