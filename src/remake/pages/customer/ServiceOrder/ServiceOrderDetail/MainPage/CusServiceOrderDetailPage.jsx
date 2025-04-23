import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useGetServiceOrderByIdQuery } from "../../../../../services/serviceOrderApi";
import { appColorTheme } from "../../../../../config/appconfig";
import useAuth from "../../../../../hooks/useAuth";
import ActionBar from "../ActionModal/ActionBar/ActionBar.jsx";
import GeneralInformationTab from "../Tab/GeneralInformationTab.jsx";
import ProgressTab from "../Tab/ProgressTab.jsx";
import ContractAndTransactionTab from "../Tab/ContractAndTransactionTab.jsx";
import { useGetAllOrderDepositByOrderIdQuery } from "../../../../../services/orderDepositApi.js";

export default function CusServiceOrderDetailPage() {
  const route = useRoute();
  const { orderId } = route.params;
  const { data, isLoading, error, refetch } = useGetServiceOrderByIdQuery(orderId);
  const order = data?.data;
  const {
    data: depositsResponse,
    isLoading: isDepositsLoading,
    error: depositsError,
    refetch: refetchDeposit,
  } = useGetAllOrderDepositByOrderIdQuery(orderId);
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
        <Text style={styles.errorText}>Đã có lỗi xảy ra khi tải thông tin đơn dịch vụ</Text>
      </View>
    );
  }

  if (
    auth?.userId != order?.user?.userId &&
    auth?.wwId != order?.service?.wwDto?.woodworkerId
  ) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không có quyền truy cập vào thông tin đơn dịch vụ này</Text>
      </View>
    );
  }

  const tabs = [
    { label: "Chung", icon: "document-text-outline" },
    { label: "Tiến độ", icon: "pulse-outline" },
    {
      label: `${
        serviceName != "Sale" ? "Hợp đồng & Giao dịch" : "Giao dịch"
      }`,
      icon: "document-outline",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              Chi tiết đơn #{order.orderId}
            </Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {order?.status || "Đang xử lý"}
              </Text>
            </View>
          </View>

          {order?.feedback && (
            <Text style={styles.feedback}>
              <Text style={styles.boldText}>Phản hồi của bạn:</Text> {order?.feedback}
            </Text>
          )}
        </View>

        <View style={styles.actionContainer}>
          <ActionBar
            deposits={deposits}
            order={order}
            refetch={refetch}
            status={order?.status}
            feedback={order?.feedback}
            refetchDeposit={refetchDeposit}
          />
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabList}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                activeTabIndex === index && styles.activeTab
              ]}
              onPress={() => handleTabChange(index)}
            >
              <Ionicons 
                name={tab.icon} 
                size={20} 
                color={activeTabIndex === index ? appColorTheme.brown_2 : '#4A5568'} 
                style={styles.tabIcon} 
              />
              <Text 
                style={[
                  styles.tabText,
                  activeTabIndex === index && styles.activeTabText
                ]}
              >
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: appColorTheme.brown_2,
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 12,
  },
  statusBadge: {
    backgroundColor: appColorTheme.brown_2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  feedback: {
    fontSize: 14,
    marginTop: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  tabsContainer: {
    flex: 1,
  },
  tabList: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    backgroundColor: appColorTheme.brown_0,
    borderBottomColor: appColorTheme.brown_1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  activeTabText: {
    color: appColorTheme.brown_2,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
});
