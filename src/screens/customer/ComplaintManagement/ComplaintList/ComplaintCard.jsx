import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  appColorTheme,
  complaintStatusConstants,
} from "../../../../config/appconfig";
import { formatDateTimeToVietnamese } from "../../../../utils/utils";
import ComplaintDetailModal from "../ActionModal/ComplaintDetailModal";

const ComplaintCard = ({ complaint, refetch }) => {
  // Xác định màu nền cho badge dựa trên trạng thái
  const getBadgeColor = () => {
    switch (complaint.status) {
      case complaintStatusConstants.COMPLETED:
        return "#48BB78"; // green
      case complaintStatusConstants.IN_PROGRESS:
        return "#ECC94B"; // yellow
      case complaintStatusConstants.PENDING:
        return "#9F7AEA"; // purple
      default:
        return "#F56565"; // red
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>
            Mã khiếu nại: #{complaint.complaintId}
          </Text>

          <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
            <Text style={styles.badgeText}>{complaint.status}</Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <View style={styles.grid}>
          {/* Left Column */}
          <View style={styles.gridItem}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã đơn hàng:</Text>
              <Text style={styles.value}>
                #{complaint.serviceOrderDetail?.orderId || "N/A"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Xưởng mộc:</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>
                  {complaint.serviceOrderDetail?.service?.wwDto?.brandName ||
                    "N/A"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.gridItem}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Loại khiếu nại:</Text>
              <Text style={styles.value}>{complaint.complaintType}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngày tạo:</Text>
              <Text style={styles.value}>
                {formatDateTimeToVietnamese(complaint.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.cardFooter}>
        <ComplaintDetailModal complaint={complaint} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardHeader: {
    backgroundColor: "#F7FAFC",
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardBody: {
    padding: 12,
  },
  grid: {
    flexDirection: "row",
  },
  gridItem: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  label: {
    fontWeight: "600",
    minWidth: 100,
    marginRight: 8,
  },
  value: {
    flex: 1,
  },
  linkText: {
    color: appColorTheme.brown_2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  cardFooter: {
    padding: 12,
    alignItems: "flex-end",
  },
});

export default ComplaintCard;
