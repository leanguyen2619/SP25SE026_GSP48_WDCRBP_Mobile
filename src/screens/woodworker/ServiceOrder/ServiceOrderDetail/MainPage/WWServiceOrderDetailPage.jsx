import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useGetServiceOrderByIdQuery } from "../../../../../services/serviceOrderApi";
import { appColorTheme } from "../../../../../config/appconfig";
import useAuth from "../../../../../hooks/useAuth";
import ActionBar from "../ActionModal/ActionBar/ActionBar.jsx";
import GeneralInformationTab from "../Tab/GeneralInformationTab.jsx";
import ProgressTab from "../Tab/ProgressTab.jsx";
import ContractAndTransactionTab from "../Tab/ContractAndTransactionTab.jsx";
import { useGetAllOrderDepositByOrderIdQuery } from "../../../../../services/orderDepositApi.js";
import WoodworkerLayout from "../../../../../layouts/WoodworkerLayout.jsx";

export default function WWServiceOrderDetailPage() {
  const route = useRoute();
  const { orderId } = route.params;
  const { data, isLoading, error, refetch, isFetching } =
    useGetServiceOrderByIdQuery(orderId, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });
  const order = data?.data;
  const {
    data: depositsResponse,
    isLoading: isDepositsLoading,
    error: depositsError,
    refetch: refetchDeposit,
    isFetching: isDepositsFetching,
  } = useGetAllOrderDepositByOrderIdQuery(orderId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const deposits = depositsResponse?.data || [];
  const { auth } = useAuth();
  const serviceName = order?.service?.service?.serviceName;

  // Track active tab index
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Handle tab change
  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  if (isLoading || isDepositsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (error || depositsError) {
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

  const tabs = [
    { label: "Chung", icon: "document-text-outline" },
    { label: "Tiến độ", icon: "pulse-outline" },
    {
      label: serviceName != "Sale" ? "HĐ & GD" : "Giao dịch",
      icon: "document-outline",
    },
  ];

  return (
    <WoodworkerLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                Chi tiết đơn dịch vụ #{order.orderId}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {order?.status || "Đang xử lý"}
                </Text>
              </View>
            </View>

            {order?.feedback && (
              <Text style={styles.feedback}>
                <Text style={styles.boldText}>Phản hồi của bạn:</Text>{" "}
                {order?.feedback}
              </Text>
            )}
          </View>

          <View style={styles.actionContainer}>
            {!isFetching && !isDepositsFetching ? (
              <ActionBar
                deposits={deposits}
                order={order}
                refetch={refetch}
                status={order?.status}
                feedback={order?.feedback}
                refetchDeposit={refetchDeposit}
              />
            ) : (
              <View style={styles.loadingBarContainer}>
                <ActivityIndicator size="small" color={appColorTheme.brown_2} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabHeaderContainer}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tabButton,
                  activeTabIndex === index && styles.activeTabButton,
                ]}
                onPress={() => handleTabChange(index)}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={
                    activeTabIndex === index ? appColorTheme.brown_2 : "#4A5568"
                  }
                />
                <Text
                  style={[
                    styles.tabLabel,
                    activeTabIndex === index && styles.activeTabLabel,
                  ]}
                >
                  {tab.label}
                </Text>
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
              <ProgressTab
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
      </View>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: appColorTheme.brown_2,
    fontSize: 22,
    fontWeight: "bold",
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: appColorTheme.brown_2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  feedback: {
    fontSize: 14,
    marginTop: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  actionContainer: {
    alignItems: "flex-end",
  },
  tabsContainer: {
    flex: 1,
  },
  tabHeaderContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 0,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
    marginRight: 8,
    flex: 1,
    justifyContent: "center",
  },
  activeTabButton: {
    backgroundColor: appColorTheme.brown_0,
    borderBottomColor: appColorTheme.brown_1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabLabel: {
    marginLeft: 4,
    fontSize: 14,
    color: "#4A5568",
  },
  activeTabLabel: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 0,
  },
  loadingBarContainer: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
