import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import StarRating from "../../../../components/Utility/StarRating.jsx";
import Pagination from "../../../../components/Utility/Pagination.jsx";
import { Ionicons } from "@expo/vector-icons";
import { useGetProductReviewsQuery } from "../../../../services/reviewApi.js";
import { useRoute } from "@react-navigation/native";
import { appColorTheme } from "../../../../config/appconfig.js";
import { formatDateTimeString } from "../../../../utils/utils.js";

// Component to render review items (will be passed to Pagination)
const ReviewList = ({ data }) => {
  return (
    <>
      {data.length > 0 ? (
        data.map((review) => (
          <View key={review.reviewId} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.username}</Text>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={14} color="#718096" />
                <Text style={styles.timeText}>
                  {formatDateTimeString(review.createdAt)}
                </Text>
              </View>
            </View>

            {/* Số sao */}
            <View style={styles.ratingContainer}>
              <StarRating rating={review.rating} />
            </View>

            {/* Nội dung đánh giá */}
            <Text style={styles.reviewComment}>{review.comment}</Text>

            {/* Phản hồi của woodworker nếu có */}
            {review.woodworkerResponseStatus && (
              <View style={styles.responseContainer}>
                <Text style={styles.responseTitle}>
                  Phản hồi của xưởng mộc:
                </Text>
                <Text style={styles.responseText}>
                  {review.woodworkerResponse}
                </Text>
                <Text style={styles.responseTime}>
                  {formatDateTimeString(review?.responseAt)}
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noReviewsText}>Không có đánh giá phù hợp</Text>
      )}
    </>
  );
};

// Filter pill component
const FilterPill = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.filterPill, isActive && styles.activeFilterPill]}
    onPress={onPress}
  >
    <Text
      style={[styles.filterPillText, isActive && styles.activeFilterPillText]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function ReviewSection() {
  const [filterStar, setFilterStar] = useState(null);
  const route = useRoute();
  const productId = route.params?.id;
  const { data, isLoading, isError } = useGetProductReviewsQuery(productId);

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
      <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>

      {/* Thanh lọc ở trên: Tất cả, rồi 5 sao -> 1 sao */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Lọc theo</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          {/* Tất cả */}
          <FilterPill
            label="Tất cả"
            isActive={!filterStar}
            onPress={handleFilterAll}
          />
          {[5, 4, 3, 2, 1].map((star) => (
            <FilterPill
              key={star}
              label={`${star} Sao`}
              isActive={filterStar === star}
              onPress={() => handleStarFilter(star)}
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
    marginTop: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  filterScrollView: {
    flexDirection: "row",
    marginBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#EDF2F7",
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterPill: {
    backgroundColor: appColorTheme.brown_2,
  },
  filterPillText: {
    color: "#4A5568",
  },
  activeFilterPillText: {
    color: "white",
    fontWeight: "bold",
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  reviewerName: {
    fontWeight: "bold",
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
  },
  ratingContainer: {
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
    fontSize: 12,
    color: "#718096",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
  },
  errorText: {
    color: "red",
  },
  noReviewsText: {
    padding: 16,
    textAlign: "center",
  },
});
