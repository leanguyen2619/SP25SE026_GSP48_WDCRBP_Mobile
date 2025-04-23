import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
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

export default function GeneralInformationTab({ order, isActive }) {
  const serviceName = order?.service?.service?.serviceName;

  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.cardTitle}>
            Thông tin đơn hàng
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
              <Text style={styles.infoValue}>{order?.orderId || "Chưa cập nhật"}</Text>
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
                  ? formatDateTimeString(new Date(order.createdAt))
                  : "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số lượng sản phẩm:</Text>
              <Text style={styles.infoValue}>{order?.quantity || "Chưa cập nhật"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Yêu cầu lắp đặt bởi xưởng:</Text>
              <Text style={styles.infoValue}>
                {order?.install ? "Có lắp đặt" : "Không cần lắp đặt"}
              </Text>
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.infoLabel}>Ghi chú:</Text>
              <Text style={styles.infoValue}>{order?.description || "Không có ghi chú"}</Text>
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
                    <Text style={styles.infoValue}>{order.consultantAppointment.form}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Địa điểm:</Text>
                    <Text style={styles.infoValue}>{order.consultantAppointment.meetAddress}</Text>
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

      <View style={styles.card}>
        <View style={styles.doubleColumnContainer}>
          <View style={styles.column}>
            <View style={styles.infoContainer}>
              <Text style={styles.cardTitle}>
                Thông tin xưởng mộc
              </Text>

              <Text style={styles.infoText}>
                <Text style={styles.bold}>Tên xưởng mộc:</Text>{" "}
                {order?.service?.wwDto?.brandName || "Chưa cập nhật"}
              </Text>

              <Text style={styles.infoText}>
                <Text style={styles.bold}>Địa chỉ:</Text>{" "}
                {order?.service?.wwDto?.address || "Chưa cập nhật"}
              </Text>

              <View style={styles.linkContainer}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`/woodworker/${order?.service?.wwDto?.woodworkerId}`)}
                >
                  <Text style={styles.linkText}>
                    Xem xưởng
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            {order?.review ? (
              <>
                {order?.review?.status ? (
                  <>
                    <View style={styles.infoContainer}>
                      <Text style={styles.cardTitle}>
                        Đánh giá
                      </Text>

                      <View style={styles.ratingRow}>
                        <Text style={styles.infoLabel}>Số sao:</Text>
                        <StarRating rating={order.review.rating} />
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Chất lượng thiết kế:</Text>
                        <Text style={styles.infoValue}>{order.review.designQuality} / 5</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Chất lượng sản phẩm:</Text>
                        <Text style={styles.infoValue}>{order.review.productQuality} / 5</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Chất lượng dịch vụ:</Text>
                        <Text style={styles.infoValue}>{order.review.serviceQuality} / 5</Text>
                      </View>

                      <View style={styles.commentContainer}>
                        <Text style={styles.infoLabel}>Bình luận:</Text>
                        <Text style={styles.infoValue}>
                          {order.review.comment || "Không có bình luận"}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <Text style={styles.emptyText}>Đánh giá đang chờ duyệt</Text>
                )}
              </>
            ) : null}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gridContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  doubleColumnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    flex: 1,
    minWidth: 250,
    paddingRight: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  noteContainer: {
    marginTop: 8,
  },
  linkContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  linkText: {
    color: appColorTheme.brown_2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentContainer: {
    marginTop: 8,
  },
  emptyText: {
    color: '#718096',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  }
});
