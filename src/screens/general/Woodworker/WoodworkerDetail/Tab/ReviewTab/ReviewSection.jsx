import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StarRating from "../../../../../../components/Utility/StarRating";
import Pagination from "../../../../../../components/Utility/Pagination";
import { useGetWoodworkerReviewsQuery } from "../../../../../../services/reviewApi";
import {
  getServiceTypeLabel,
  appColorTheme,
} from "../../../../../../config/appconfig";

// Tạo component cho FilterPill
const FilterPill = ({ label, isActive, onClick }) => (
  <TouchableOpacity
    style={[styles.filterPill, isActive && styles.filterPillActive]}
    onPress={onClick}
  >
    <Text
      style={[styles.filterPillText, isActive && styles.filterPillTextActive]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// Component to render review items (will be passed to Pagination)
const ReviewList = ({ data }) => {
  if (data.length === 0) {
    return <Text style={styles.noReviewText}>Không có đánh giá phù hợp</Text>;
  }

  return (
    <View>
      {data.map((review) => (
        <View key={review.reviewId} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewUsername}>{review.username}</Text>
            <View style={styles.reviewTimeContainer}>
              <Ionicons name="time-outline" size={12} color="#718096" />
              <Text style={styles.reviewTime}>
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}{" "}
                {new Date(review.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <View style={styles.reviewServiceContainer}>
              <Ionicons name="book-outline" size={12} color="#718096" />
              <Text style={styles.reviewService}>
                {getServiceTypeLabel(review.serviceName)}
              </Text>
            </View>
          </View>

          {/* Số sao */}
          <View style={styles.starsContainer}>
            <StarRating rating={review.rating} />
          </View>

          {/* Nội dung đánh giá */}
          <Text style={styles.reviewComment}>{review.comment}</Text>

          {/* Phản hồi của woodworker nếu có */}
          {review.woodworkerResponseStatus && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseTitle}>Phản hồi của xưởng mộc:</Text>
              <Text style={styles.responseText}>
                {review.woodworkerResponse}
              </Text>
              <Text style={styles.responseTime}>
                {new Date(review.responseAt).toLocaleDateString("vi-VN")}{" "}
                {new Date(review.responseAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default function ReviewSection({ woodworkerId }) {
  const [filterStar, setFilterStar] = useState(null);
  const { data, isLoading, isError } =
    useGetWoodworkerReviewsQuery(woodworkerId);

  const reviews = data?.data || [];

  // Lọc review theo số sao (nếu filterStar=null => hiển thị tất cả)
  const filteredReviews = filterStar
    ? reviews.filter((r) => r.rating === filterStar)
    : reviews;

  const handleFilterAll = () => {
    setFilterStar(null);
  };

  const handleStarFilter = (star) => {
    setFilterStar(star);
  };

  if (isLoading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
        <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
      </View>
    );

  if (isError)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Có lỗi khi tải đánh giá</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Thanh lọc ở trên: Tất cả, rồi 5 sao -> 1 sao */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Lọc theo</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {/* Tất cả */}
          <FilterPill
            label="Tất cả"
            isActive={!filterStar}
            onClick={handleFilterAll}
          />
          {[5, 4, 3, 2, 1].map((star) => (
            <FilterPill
              key={star}
              label={`${star} Sao`}
              isActive={filterStar === star}
              onClick={() => handleStarFilter(star)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Danh sách đánh giá với phân trang */}
      <Pagination
        dataList={filteredReviews}
        DisplayComponent={ReviewList}
        itemsPerPage={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#718096",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  errorText: {
    color: "#B91C1C",
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterPill: {
    backgroundColor: "#EDF2F7",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: appColorTheme.brown_0,
  },
  filterPillText: {
    color: "#4A5568",
  },
  filterPillTextActive: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  reviewItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  reviewUsername: {
    fontWeight: "bold",
    marginRight: 8,
  },
  reviewTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  reviewTime: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
  },
  reviewServiceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewService: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
  },
  starsContainer: {
    marginBottom: 8,
  },
  reviewComment: {
    marginBottom: 8,
  },
  responseContainer: {
    marginTop: 8,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#E2E8F0",
  },
  responseTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  responseText: {
    fontSize: 14,
  },
  responseTime: {
    fontSize: 10,
    color: "#718096",
  },
  noReviewText: {
    textAlign: "center",
    padding: 16,
    color: "#718096",
  },
});
