import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { formatDateTimeString } from "../../../../utils/utils";
import ReviewDetailModal from "../ActionModal/ReviewDetailModal";
import { useGetWoodworkerResponseReviewsQuery } from "../../../../services/reviewApi";
import useAuth from "../../../../hooks/useAuth";
import { appColorTheme } from "../../../../config/appconfig";
import WoodworkerLayout from "../../../../layouts/WoodworkerLayout";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Pagination from "../../../../components/Utility/Pagination";

// Component để hiển thị các mục đánh giá (được truyền vào Pagination)
const ReviewListItems = ({ data, refetch }) => {
  const navigation = useNavigation();

  const handleViewOrderDetail = (item) => {
    if (item.serviceOrderId) {
      navigation.navigate("WWServiceOrderDetail", {
        orderId: item.serviceOrderId,
      });
    } else if (item.guaranteeOrderId) {
      navigation.navigate("WWGuaranteeOrderDetail", {
        id: item.guaranteeOrderId,
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <AntDesign
            key={index}
            name="star"
            size={16}
            color={index < rating ? appColorTheme.brown_2 : "#CBD5E0"}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.listContainer}>
      {data.length > 0 ? (
        data.map((item) => {
          let orderType = "Không xác định";
          if (item.serviceOrderId) orderType = "Đơn dịch vụ";
          if (item.guaranteeOrderId) orderType = "Đơn BH / sửa";

          const orderId = item.serviceOrderId || item.guaranteeOrderId || "N/A";

          return (
            <View key={item.reviewId} style={styles.reviewItem}>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Mã đánh giá:</Text>
                <Text style={styles.value}>{item.reviewId}</Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.label}>Loại đơn:</Text>
                <Text style={styles.value}>{orderType}</Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.label}>Mã đơn hàng:</Text>
                <View style={styles.orderIdContainer}>
                  <Text style={styles.value}>{orderId}</Text>
                  {(item.serviceOrderId || item.guaranteeOrderId) && (
                    <TouchableOpacity
                      style={styles.viewDetailButton}
                      onPress={() => handleViewOrderDetail(item)}
                    >
                      <Text style={styles.viewDetailText}>Xem chi tiết</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.label}>Khách hàng:</Text>
                <Text style={styles.value}>
                  {item.username || "Không có thông tin"}
                </Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.label}>Đánh giá:</Text>
                {renderStars(item.rating)}
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.label}>Ngày tạo:</Text>
                <Text style={styles.value}>
                  {formatDateTimeString(item.createdAt)}
                </Text>
              </View>

              <View style={styles.actionContainer}>
                <ReviewDetailModal review={item} refetch={refetch} />
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không có đánh giá nào cần phản hồi
          </Text>
        </View>
      )}
    </View>
  );
};

export default function ReviewManagementListPage() {
  const { auth } = useAuth();
  const woodworkerId = auth?.wwId;

  // Fetch reviews that need woodworker response using the new endpoint
  const {
    data: reviewsResponse,
    refetch,
    isLoading,
    isError,
  } = useGetWoodworkerResponseReviewsQuery(woodworkerId, {
    skip: !woodworkerId,
  });

  // Transform data directly without useState and useEffect
  const reviews = reviewsResponse?.data?.map((el) => ({
    ...el,
  }));

  // Show loading state
  if (isLoading) {
    return (
      <WoodworkerLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={appColorTheme.brown_2} />
        </View>
      </WoodworkerLayout>
    );
  }

  // Show error state
  if (isError) {
    return (
      <WoodworkerLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Đã xảy ra lỗi khi tải dữ liệu.</Text>
        </View>
      </WoodworkerLayout>
    );
  }

  return (
    <WoodworkerLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Quản lý Đánh giá</Text>
        </View>

        <ScrollView style={styles.contentContainer}>
          {reviews && reviews.length > 0 ? (
            <Pagination
              dataList={reviews || []}
              DisplayComponent={(props) => (
                <ReviewListItems {...props} refetch={refetch} />
              )}
              itemsPerPage={5}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Không có đánh giá nào cần phản hồi
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
  },
  header: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    marginTop: 8,
  },
  reviewItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  value: {
    fontSize: 14,
    flex: 2,
    textAlign: "right",
  },
  starsContainer: {
    flexDirection: "row",
    flex: 2,
    justifyContent: "flex-end",
  },
  actionContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  orderIdContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  viewDetailButton: {
    marginLeft: 10,
    padding: 4,
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 4,
  },
  viewDetailText: {
    color: "white",
    fontSize: 12,
  },
});
