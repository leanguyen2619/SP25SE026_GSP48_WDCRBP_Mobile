import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import { appColorTheme } from "../../../../config/appconfig";
import { useGetServiceOrderComplaintsQuery } from "../../../../services/complaintApi";
import { AntDesign } from "@expo/vector-icons";

// Import components similar to staff modal
import ServiceInfoSection from "./ServiceInfoSection";
import ProductInfoSection from "./ProductInfoSection";
import Transaction from "./Transaction";
import ComplaintAccordion from "./ComplaintAccordion";

export default function ComplaintDetailModal({ complaint }) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract service name and order details
  const serviceName =
    complaint?.serviceOrderDetail?.service?.service?.serviceName;
  const orderDetail = complaint?.serviceOrderDetail;
  const orderId = orderDetail?.orderId;

  // Fetch all complaints for this service order
  const { data: serviceOrderComplaints, isLoading: isLoadingComplaints } =
    useGetServiceOrderComplaintsQuery(orderId, {
      skip: !isOpen || !orderId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  // State to store all complaints for this order
  const [allOrderComplaints, setAllOrderComplaints] = useState([]);

  useEffect(() => {
    if (serviceOrderComplaints?.data) {
      setAllOrderComplaints(serviceOrderComplaints.data);
    }
  }, [serviceOrderComplaints?.data]);

  return (
    <>
      <TouchableOpacity
        style={styles.viewDetailButton}
        onPress={() => setIsOpen(true)}
      >
        <AntDesign name="eye" size={16} color={appColorTheme.brown_2} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Chi tiết khiếu nại #{complaint?.complaintId}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <AntDesign name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Top section: Service and Product Information side by side */}
              <View style={styles.topSection}>
                {/* Left side: Service Information */}
                <View style={styles.sectionHalf}>
                  <ServiceInfoSection
                    orderDetail={orderDetail}
                    serviceName={serviceName}
                  />
                </View>

                {/* Right side: Product Information */}
                <View style={styles.sectionHalf}>
                  <ProductInfoSection
                    orderDetail={orderDetail}
                    serviceName={serviceName}
                  />
                </View>
              </View>

              {/* Transaction Information */}
              <View style={styles.section}>
                <Transaction order={complaint?.serviceOrderDetail} />
              </View>

              {/* All Complaints for this Order */}
              <ComplaintAccordion
                orderDetail={orderDetail}
                allOrderComplaints={allOrderComplaints}
                currentComplaint={complaint}
                isLoadingComplaints={isLoadingComplaints}
              />

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setIsOpen(false)}
                >
                  <Text style={styles.closeBtnText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  viewDetailButton: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "95%",
    maxHeight: "95%",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    backgroundColor: "#F7FAFC",
    paddingBottom: 15,
  },
  topSection: {
    flexDirection: "column",
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  sectionHalf: {
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  closeBtnText: {
    fontWeight: "bold",
  },
});
