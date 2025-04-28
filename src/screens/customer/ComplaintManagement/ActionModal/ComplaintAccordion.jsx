import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { formatDateString } from "../../../../utils/utils";
import {
  appColorTheme,
  complaintStatusConstants,
} from "../../../../config/appconfig";
import ImageListSelector from "../../../../components/Utility/ImageListSelector";
import RefundTransactionCard from "../../../customer/ComplaintManagement/ActionModal/RefundTransactionCard";
import { AntDesign } from "@expo/vector-icons";

// Custom Accordion Item component
const AccordionItem = ({
  item,
  isExpanded,
  onToggle,
  isCurrentComplaint,
  children,
}) => {
  return (
    <View
      style={[
        styles.accordionItem,
        isCurrentComplaint && styles.currentAccordionItem,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.accordionButton,
          isCurrentComplaint && styles.currentAccordionButton,
        ]}
        onPress={onToggle}
      >
        <View style={styles.accordionButtonContent}>
          <View style={styles.headerRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.status === complaintStatusConstants.COMPLETED
                      ? "#48BB78" // green
                      : item.status === complaintStatusConstants.IN_PROGRESS
                      ? "#ECC94B" // yellow
                      : item.status === complaintStatusConstants.PENDING
                      ? "#9F7AEA" // purple
                      : "#F56565", // red
                },
              ]}
            >
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
            <Text style={styles.titleText}>Khiếu nại #{item.complaintId}</Text>
            <Text style={styles.dateText}>
              {formatDateString(new Date(item.createdAt))}
            </Text>
            {isCurrentComplaint && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Đang xem</Text>
              </View>
            )}
          </View>
        </View>
        <AntDesign
          name={isExpanded ? "up" : "down"}
          size={16}
          color="#718096"
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.accordionPanel}>{children}</View>}
    </View>
  );
};

export default function ComplaintAccordion({
  orderDetail,
  allOrderComplaints,
  currentComplaint,
  isLoadingComplaints,
}) {
  // State to track expanded accordion items
  const [expandedItems, setExpandedItems] = useState(() => {
    const initialExpanded = {};
    if (currentComplaint) {
      initialExpanded[currentComplaint.complaintId] = true;
    }
    return initialExpanded;
  });

  // Toggle accordion item
  const toggleAccordion = (complaintId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId],
    }));
  };

  // Check if an item is expanded
  const isItemExpanded = (complaintId) => {
    return !!expandedItems[complaintId];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Tất cả khiếu nại của đơn hàng #{orderDetail?.orderId}
      </Text>

      {isLoadingComplaints ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={appColorTheme.brown_2} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : allOrderComplaints.length > 0 ? (
        <View style={styles.accordionContainer}>
          {allOrderComplaints.map((complaintItem) => (
            <AccordionItem
              key={complaintItem.complaintId}
              item={complaintItem}
              isExpanded={isItemExpanded(complaintItem.complaintId)}
              onToggle={() => toggleAccordion(complaintItem.complaintId)}
              isCurrentComplaint={
                complaintItem.complaintId === currentComplaint?.complaintId
              }
            >
              <View style={styles.contentStack}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Khiếu nại được tạo khi đơn hàng ở trạng thái:
                  </Text>
                  <Text style={styles.infoValue}>
                    {complaintItem?.orderStatus}
                  </Text>
                </View>

                {/* Complaint Type */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Loại khiếu nại:</Text>
                  <Text style={styles.infoValue}>
                    {complaintItem.complaintType}
                  </Text>
                </View>

                {/* Complaint Content */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nội dung khiếu nại:</Text>
                  <Text style={styles.infoValue}>
                    {complaintItem.description}
                  </Text>
                </View>

                {/* Proof Images */}
                {complaintItem.proofImgUrls &&
                  complaintItem.proofImgUrls.length > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Hình ảnh minh chứng:</Text>
                      <View style={styles.imageContainer}>
                        <ImageListSelector
                          imgH={150}
                          imgUrls={complaintItem.proofImgUrls}
                        />
                      </View>
                    </View>
                  )}

                {/* Woodworker Response */}
                {complaintItem.woodworkerResponse && (
                  <View style={styles.responseBox}>
                    <Text style={styles.infoLabel}>Phản hồi từ xưởng mộc:</Text>
                    <Text style={styles.responseText}>
                      {complaintItem.woodworkerResponse}
                    </Text>
                  </View>
                )}

                {/* Staff Response */}
                {complaintItem.staffResponse && (
                  <View style={styles.staffResponseBox}>
                    <Text style={styles.infoLabel}>Phản hồi từ nhân viên:</Text>
                    <Text style={styles.responseText}>
                      {complaintItem.staffResponse}
                    </Text>

                    {/* Staff Member */}
                    {complaintItem.staffUser && (
                      <View style={styles.staffInfoRow}>
                        <View style={styles.staffInfo}>
                          <Text style={styles.staffLabel}>
                            Nhân viên xử lý:
                          </Text>
                          <Text style={styles.staffValue}>
                            {complaintItem.staffUser.username}
                          </Text>
                        </View>
                        <View style={styles.staffInfo}>
                          <Text style={styles.staffLabel}>SĐT:</Text>
                          <Text style={styles.staffValue}>
                            {complaintItem.staffUser.phone}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {/* Refund Information */}
                <RefundTransactionCard complaintItem={complaintItem} />
              </View>
            </AccordionItem>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          Không có khiếu nại nào cho đơn hàng này
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
  },
  accordionContainer: {
    marginTop: 10,
  },
  accordionItem: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  currentAccordionItem: {
    borderWidth: 2,
    borderColor: appColorTheme.brown_2,
  },
  accordionButton: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
  currentAccordionButton: {
    backgroundColor: "#F7FAFC",
  },
  accordionButtonContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  badge: {
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  titleText: {
    fontWeight: "600",
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#718096",
    marginRight: 8,
  },
  currentBadge: {
    backgroundColor: "#9F7AEA",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currentBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  accordionPanel: {
    padding: 15,
    backgroundColor: "white",
  },
  contentStack: {
    marginTop: 5,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoValue: {
    lineHeight: 20,
  },
  imageContainer: {
    marginTop: 5,
  },
  responseBox: {
    padding: 12,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    marginBottom: 15,
  },
  staffResponseBox: {
    padding: 12,
    backgroundColor: "#EBF8FF",
    borderRadius: 8,
    marginBottom: 15,
  },
  responseText: {
    lineHeight: 20,
  },
  staffInfoRow: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
  },
  staffInfo: {
    flexDirection: "row",
    marginRight: 15,
    marginBottom: 5,
  },
  staffLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  staffValue: {},
  emptyText: {
    textAlign: "center",
    padding: 15,
    color: "#718096",
  },
});
