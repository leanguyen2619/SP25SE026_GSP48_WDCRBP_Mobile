import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useGetServiceOrderByIdQuery } from "../../../../../services/serviceOrderApi";
import { appColorTheme } from "../../../../../config/appconfig";
import useAuth from "../../../../../hooks/useAuth";
import ActionBar from "../ActionModal/ActionBar/ActionBar.jsx";
import Ionicons from "react-native-vector-icons/Ionicons";
import GeneralInformationTab from "../Tab/GeneralInformationTab.jsx";
import ProcessTab from "../Tab/ProgressTab.jsx";
import ContractAndTransactionTab from "../Tab/ContractAndTransactionTab.jsx";

export default function WWServiceOrderDetailPage() {
  const route = useRoute();
  const id = route.params?.id;
  const { data, isLoading, error, refetch } = useGetServiceOrderByIdQuery(id);
  const order = data?.data;
  const { auth } = useAuth();
  const serviceName = order?.service?.service?.serviceName;

  // Track active tab index
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Handle tab change
  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Đã có lỗi xảy ra khi tải thông tin đơn dịch vụ
        </Text>
      </View>
    );
  }

  if (
    auth?.userId != order?.user?.userId &&
    auth?.wwId != order?.service?.wwDto?.woodworkerId
  ) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Không có quyền truy cập vào thông tin đơn dịch vụ này
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              Chi tiết đơn #{order.orderId}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {order?.status || "Đang xử lý"}
              </Text>
            </View>
          </View>

          {order?.feedback && (
            <Text style={styles.feedbackText}>
              <Text style={styles.boldText}>Phản hồi của khách hàng:</Text>{" "}
              {order?.feedback}
            </Text>
          )}

          <View style={styles.actionBarContainer}>
            <ActionBar
              order={order}
              refetch={refetch}
              status={order?.status}
              feedback={order?.feedback}
            />
          </View>
        </View>

        <View style={styles.tabContainer}>
          <View style={styles.tabHeaderContainer}>
            {[
              { label: "Chung", icon: "document-text-outline" },
              { label: "Tiến độ", icon: "analytics-outline" },
              {
                label: `${
                  serviceName != "Sale" ? "Hợp đồng & Giao dịch" : "Giao dịch"
                }`,
                icon: "document-outline",
              },
            ].map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tabButton,
                  activeTabIndex === index && styles.activeTabButton,
                ]}
                onPress={() => handleTabChange(index)}
              >
                <View style={styles.tabButtonContent}>
                  <Ionicons
                    name={tab.icon}
                    size={20}
                    color={
                      activeTabIndex === index ? appColorTheme.brown_2 : "gray"
                    }
                  />
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTabIndex === index && styles.activeTabButtonText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {activeTabIndex === 0 && (
              <GeneralInformationTab
                order={order}
                activeTabIndex={activeTabIndex}
                isActive={activeTabIndex === 0}
              />
            )}
            {activeTabIndex === 1 && (
              <ProcessTab
                order={order}
                activeTabIndex={activeTabIndex}
                isActive={activeTabIndex === 1}
              />
            )}
            {activeTabIndex === 2 && (
              <ContractAndTransactionTab
                order={order}
                activeTabIndex={activeTabIndex}
                isActive={activeTabIndex === 2}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColorTheme.grey_1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: appColorTheme.brown_2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
  },
  feedbackText: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: "bold",
  },
  actionBarContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabHeaderContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: appColorTheme.brown_2,
    backgroundColor: appColorTheme.brown_0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonText: {
    marginLeft: 5,
    color: "gray",
    fontSize: 14,
  },
  activeTabButtonText: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  tabContent: {
    padding: 15,
  },
});
