import { useParams } from "react-router-dom";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useGetGuaranteeOrderByIdQuery } from "../../../../../services/guaranteeOrderApi";
import { appColorTheme } from "../../../../../config/appconfig";
import useAuth from "../../../../../hooks/useAuth";
import ActionBar from "../ActionModal/ActionBar/ActionBar.jsx";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GeneralInformationTab from "../Tab/GeneralInformationTab.jsx";
import ProcessTab from "../Tab/ProgressTab.jsx";
import { useGetAllOrderDepositByGuaranteeOrderIdQuery } from "../../../../../services/orderDepositApi.js";
import { useState } from "react";
import QuotationAndTransactionTab from "../Tab/QuotationAndTransactionTab.jsx";

export default function CusGuaranteeOrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useGetGuaranteeOrderByIdQuery(id);

  const {
    data: depositsResponse,
    isLoading: isDepositsLoading,
    error: depositsError,
    refetch: refetchDeposit,
  } = useGetAllOrderDepositByGuaranteeOrderIdQuery(id);

  const order = data?.data;
  const deposits = depositsResponse?.data || [];
  const { auth } = useAuth();

  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
        <Text>Đã có lỗi xảy ra khi tải thông tin đơn bảo hành</Text>
      </View>
    );
  }

  if (
    auth?.userId != order?.user?.userId &&
    auth?.wwId != order?.woodworker?.woodworkerId
  ) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không có quyền truy cập vào thông tin đơn bảo hành này</Text>
      </View>
    );
  }

  const tabs = [
    { label: "Chung", icon: "file-document" },
    { label: "Tiến độ", icon: "progress-clock" },
    { label: "Báo giá & Giao dịch", icon: "file" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Chi tiết đơn #{order.guaranteeOrderId}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order?.status || "Đang xử lý"}</Text>
            </View>
          </View>

          {order?.feedback && (
            <Text style={styles.feedbackText}>
              <Text style={styles.feedbackLabel}>Phản hồi của bạn:</Text> {order?.feedback}
            </Text>
          )}
        </View>

        <View style={styles.actionBarContainer}>
          <ActionBar
            deposits={deposits}
            order={order}
            refetchDeposit={refetchDeposit}
            refetch={refetch}
            status={order?.status}
            feedback={order?.feedback}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabList}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                activeTabIndex === index && styles.activeTab,
              ]}
              onPress={() => handleTabChange(index)}
            >
              <MaterialCommunityIcons name={tab.icon} size={20} color={activeTabIndex === index ? appColorTheme.brown_2 : "#666"} />
              <Text style={[styles.tabText, activeTabIndex === index && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
            <QuotationAndTransactionTab
              order={order}
              activeTabIndex={activeTabIndex}
              isActive={activeTabIndex === 2}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColorTheme.brown_2,
  },
  statusBadge: {
    backgroundColor: appColorTheme.brown_2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
  },
  feedbackText: {
    fontSize: 14,
    marginTop: 8,
  },
  feedbackLabel: {
    fontWeight: 'bold',
  },
  actionBarContainer: {
    marginTop: 16,
  },
  tabContainer: {
    flex: 1,
  },
  tabList: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: appColorTheme.brown_2,
    backgroundColor: appColorTheme.brown_0,
  },
  tabText: {
    marginLeft: 8,
    color: '#666',
  },
  activeTabText: {
    color: appColorTheme.brown_2,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
});
