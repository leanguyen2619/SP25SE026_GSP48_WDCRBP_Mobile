import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { appColorTheme } from "../../../../config/appconfig";
import DepositModal from "../ActionModal/DepositModal";
import WithdrawModal from "../ActionModal/WithdrawModal";
import { useGetUserWalletQuery } from "../../../../services/walletApi";
import useAuth from "../../../../hooks/useAuth";
import { formatPrice } from "../../../../utils/utils";

export default function WalletInformation() {
  const { auth } = useAuth();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetUserWalletQuery(auth?.userId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const wallet = response?.data;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đã có lỗi xảy ra khi tải thông tin ví</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceSection}>
        <Text style={styles.sectionTitle}>Số dư ví</Text>
        <Text style={styles.balanceText}>
          {formatPrice(wallet?.balance || 0)}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <DepositModal
          wallet={wallet}
          onSuccess={() => {
            refetch();
          }}
        />

        <WithdrawModal
          wallet={wallet}
          onSuccess={() => {
            refetch();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
});
