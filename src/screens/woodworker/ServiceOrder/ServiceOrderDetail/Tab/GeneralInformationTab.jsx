import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  appColorTheme,
  getServiceTypeLabel,
} from "../../../../../config/appconfig.js";
import {
  formatDateTimeString,
  formatDateTimeToVietnamese,
} from "../../../../../utils/utils.js";
import CustomizationProductList from "./CustomizationProductList.jsx";
import StarRating from "../../../../../components/Utility/StarRating.jsx";
import PersonalizationProductList from "./PersonalizationProductList.jsx";
import SaleProductList from "./SaleProductList.jsx";
import { useGetShipmentsByServiceOrderIdQuery } from "../../../../../services/shipmentApi.js";

export default function GeneralInformationTab({ order, isActive }) {
  const serviceName = order?.service?.service?.serviceName;

  const { data: shipmentData, refetch: refetchShipment } =
    useGetShipmentsByServiceOrderIdQuery(order?.orderId, {
      skip: !order?.orderId,
    });

  // Refetch data when tab becomes active
  useEffect(() => {
    if (isActive && order?.orderId) {
      refetchShipment();
    }
  }, [isActive, order?.orderId, refetchShipment]);

  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      {serviceName == "Personalization" && (
        <PersonalizationProductList
          orderId={order?.orderId}
          products={order?.requestedProduct}
          totalAmount={order?.totalAmount}
        />
      )}
      {serviceName == "Customization" && (
        <CustomizationProductList
          shipFee={order?.shipFee}
          products={order?.requestedProduct}
          totalAmount={order?.totalAmount}
        />
      )}
      {serviceName == "Sale" && (
        <SaleProductList
          shipFee={order?.shipFee}
          products={order?.requestedProduct}
          totalAmount={order?.totalAmount}
        />
      )}

      <View style={styles.gridContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin đơn hàng</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
              <Text style={styles.infoValue}>
                {order?.orderId || "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Loại dịch vụ:</Text>
              <Text style={styles.infoValue}>
                {getServiceTypeLabel(order?.service?.service?.serviceName)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày đặt:</Text>
              <Text style={styles.infoValue}>
                {order?.createdAt
                  ? formatDateTimeString(order.createdAt)
                  : "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số lượng sản phẩm:</Text>
              <Text style={styles.infoValue}>
                {order?.quantity || "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Yêu cầu lắp đặt bởi xưởng:</Text>
              <Text style={styles.infoValue}>
                {order?.install ? "Có lắp đặt" : "Không cần lắp đặt"}
              </Text>
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.infoLabel}>Ghi chú:</Text>
              <Text style={styles.infoValue}>
                {order?.description || "Không có ghi chú"}
              </Text>
            </View>
          </View>
        </View>

        {serviceName != "Sale" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Thông tin lịch hẹn tư vấn bàn hợp đồng
            </Text>

            <View style={styles.infoContainer}>
              {order?.consultantAppointment ? (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Hình thức:</Text>
                    <Text style={styles.infoValue}>
                      {order.consultantAppointment.form}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Địa điểm:</Text>
                    <Text style={styles.infoValue}>
                      {order.consultantAppointment.meetAddress}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ngày giờ hẹn:</Text>
                    <Text style={styles.infoValue}>
                      {formatDateTimeToVietnamese(
                        new Date(order.consultantAppointment.dateTime)
                      )}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Mô tả:</Text>
                    <Text style={styles.infoValue}>
                      {order.consultantAppointment.content || "Không có mô tả"}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>Không có lịch hẹn tư vấn</Text>
              )}
            </View>
          </View>
        )}
      </View>

      <View style={styles.cardFullWidth}>
        <View style={styles.doubleColumnContainer}>
          <View style={styles.column}>
            <View style={styles.infoContainer}>
              <Text style={styles.cardTitle}>Thông tin khách hàng</Text>

              <Text style={styles.infoText}>
                <Text style={styles.bold}>Tên khách hàng:</Text>{" "}
                {order?.user?.username || "Chưa cập nhật"}
              </Text>

              <Text style={styles.infoText}>
                <Text style={styles.bold}>Địa chỉ giao hàng:</Text>{" "}
                {shipmentData?.data[0]?.toAddress || "Chưa cập nhật"}
              </Text>
            </View>
          </View>

          <View style={styles.column}>
            {order?.review ? (
              <>
                {order?.review?.status ? (
                  <>
                    <View style={styles.infoContainer}>
                      <Text style={styles.cardTitle}>Đánh giá</Text>

                      <View style={styles.ratingRow}>
                        <Text style={styles.infoLabel}>Số sao:</Text>
                        <StarRating rating={order.review.rating} />
                      </View>

                      <View style={styles.commentContainer}>
                        <Text style={styles.infoLabel}>Bình luận:</Text>
                        <Text style={styles.infoValue}>
                          {order.review.comment || "Không có bình luận"}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày đăng:</Text>
                        <Text style={styles.infoValue}>
                          {formatDateTimeString(
                            new Date(order.review.createdAt)
                          )}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <Text style={styles.emptyText}>Đánh giá đang chờ duyệt</Text>
                )}
              </>
            ) : (
              <Text style={styles.emptyText}>Chưa có đánh giá</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  gridContainer: {
    marginTop: 0,
    marginBottom: 16,
  },
  doubleColumnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  column: {
    flex: 1,
    minWidth: 250,
    paddingRight: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 0,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: appColorTheme.brown_2,
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 8,
    minWidth: 120,
  },
  infoValue: {
    flex: 1,
  },
  infoText: {
    marginBottom: 12,
  },
  bold: {
    fontWeight: "bold",
  },
  noteContainer: {
    marginTop: 8,
  },
  linkContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  linkText: {
    color: appColorTheme.brown_2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  commentContainer: {
    marginTop: 8,
  },
  emptyText: {
    color: "#718096",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 20,
  },
  cardFullWidth: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 0,
  },
});
