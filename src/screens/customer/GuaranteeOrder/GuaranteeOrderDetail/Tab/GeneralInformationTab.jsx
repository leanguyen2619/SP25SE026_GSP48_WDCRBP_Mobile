import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  appColorTheme,
  getServiceTypeLabel,
} from "../../../../../config/appconfig.js";
import {
  formatDateTimeString,
  formatDateTimeToVietnamese,
} from "../../../../../utils/utils.js";
import StarRating from "../../../../../components/Utility/StarRating.jsx";
import PersonalizationProduct from "./PersonalizationProduct.jsx";
import CustomizationProduct from "./CustomizationProduct.jsx";
import SaleProduct from "./SaleProduct.jsx";
import { useNavigation } from "@react-navigation/native";

export default function GeneralInformationTab({ order }) {
  const serviceName = order?.serviceOrderDetail?.service?.service?.serviceName;
  const serviceOrder = order?.serviceOrderDetail;
  const navigation = useNavigation();

  const handleViewOrderDetail = () => {
    navigation.navigate("CustomerServiceOrderDetail", {
      orderId: order?.serviceOrderDetail?.orderId,
    });
  };

  const handleViewWoodworker = () => {
    navigation.navigate("WoodworkerDetail", {
      id: order?.woodworker?.woodworkerId,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {serviceName == "Personalization" && (
        <PersonalizationProduct
          orderId={serviceOrder?.orderId}
          completionDate={serviceOrder?.updatedAt}
          currentProductImgUrls={order?.currentProductImgUrls}
          productCurrentStatus={order?.productCurrentStatus}
          warrantyDuration={order?.requestedProduct?.warrantyDuration}
          product={order?.serviceOrderDetail?.requestedProduct.find(
            (item) =>
              item.requestedProductId ==
              order?.requestedProduct?.requestedProductId
          )}
          isGuarantee={order?.isGuarantee}
          guaranteeError={order?.guaranteeError}
        />
      )}
      {serviceName == "Customization" && (
        <CustomizationProduct
          completionDate={serviceOrder?.updatedAt}
          currentProductImgUrls={order?.currentProductImgUrls}
          productCurrentStatus={order?.productCurrentStatus}
          warrantyDuration={order?.requestedProduct?.warrantyDuration}
          product={order?.serviceOrderDetail?.requestedProduct.find(
            (item) =>
              item.requestedProductId ==
              order?.requestedProduct?.requestedProductId
          )}
          isGuarantee={order?.isGuarantee}
          guaranteeError={order?.guaranteeError}
        />
      )}
      {serviceName == "Sale" && (
        <SaleProduct
          completionDate={serviceOrder?.updatedAt}
          currentProductImgUrls={order?.currentProductImgUrls}
          productCurrentStatus={order?.productCurrentStatus}
          warrantyDuration={order?.requestedProduct?.warrantyDuration}
          product={order?.serviceOrderDetail?.requestedProduct.find(
            (item) =>
              item.requestedProductId ==
              order?.requestedProduct?.requestedProductId
          )}
          isGuarantee={order?.isGuarantee}
          guaranteeError={order?.guaranteeError}
        />
      )}

      <View style={styles.gridContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin đơn hàng</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã yêu cầu:</Text>
              <Text>{order?.guaranteeOrderId || "Chưa cập nhật"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã đơn hàng đã đặt:</Text>
              <Text>
                {getServiceTypeLabel(order?.serviceOrderDetail?.orderId)}
              </Text>
              <TouchableOpacity onPress={handleViewOrderDetail}>
                <Text style={styles.link}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngày đặt:</Text>
              <Text>
                {order?.createdAt
                  ? formatDateTimeString(order?.createdAt)
                  : "Chưa cập nhật"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Yêu cầu lắp đặt bởi xưởng:</Text>
              <Text>{order?.install ? "Có lắp đặt" : "Không cần lắp đặt"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Ghi chú:</Text>
              <Text>{order?.description || "Không có ghi chú"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin lịch hẹn tư vấn</Text>

          <View style={styles.infoContainer}>
            {order?.consultantAppointment ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Hình thức:</Text>
                  <Text>{order.consultantAppointment.form}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Địa điểm:</Text>
                  <Text>{order.consultantAppointment.meetAddress}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Ngày giờ hẹn:</Text>
                  <Text>
                    {formatDateTimeToVietnamese(
                      new Date(order.consultantAppointment.dateTime)
                    )}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Mô tả:</Text>
                  <Text>
                    {order.consultantAppointment.content || "Không có mô tả"}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.noDataText}>Không có lịch hẹn tư vấn</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.gridContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.cardTitle}>Thông tin xưởng mộc</Text>

            <View style={styles.infoContainer}>
              <Text>
                <Text style={styles.label}>Tên xưởng mộc:</Text>{" "}
                {order?.woodworker?.brandName || "Chưa cập nhật"}
              </Text>

              <Text>
                <Text style={styles.label}>Địa chỉ:</Text>{" "}
                {order?.woodworker?.address || "Chưa cập nhật"}
              </Text>

              <TouchableOpacity onPress={handleViewWoodworker}>
                <Text style={styles.link}>Xem xưởng</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoSection}>
            {order?.review ? (
              <>
                {order?.review?.status ? (
                  <View style={styles.infoContainer}>
                    <Text style={styles.cardTitle}>Đánh giá</Text>

                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Số sao:</Text>
                      <StarRating rating={order.review.rating} />
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Bình luận:</Text>
                      <Text>{order.review.comment}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Ngày đăng:</Text>
                      <Text>
                        {formatDateTimeString(order.review.createdAt)}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.noDataText}>
                    (Đánh giá chưa được duyệt)
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.noDataText}>(Chưa có đánh giá)</Text>
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
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
    minWidth: "100%",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: appColorTheme.brown_2,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  label: {
    fontWeight: "bold",
  },
  link: {
    color: appColorTheme.brown_2,
    textDecorationLine: "underline",
  },
  noDataText: {
    color: "#666",
    fontStyle: "italic",
  },
  infoSection: {
    flex: 1,
    minWidth: "100%",
  },
});
