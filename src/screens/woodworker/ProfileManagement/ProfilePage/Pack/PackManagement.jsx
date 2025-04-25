import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  appColorTheme,
  getPackTypeLabel,
} from "../../../../../config/appconfig.js";
import PackageFrame from "../../../../../components/Utility/PackageFrame.jsx";
import BuyPackByWalletModal from "../../ActionModal/BuyPackByWalletModal.jsx";
import { formatDateTimeString } from "../../../../../utils/utils.js";
import BuyPackByPaymentGateway from "../../ActionModal/BuyPackByPaymentGateway.jsx";
import * as Linking from "expo-linking";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

export default function PackManagement({ woodworker, refreshData }) {
  const [walletModalOpen, setWalletModalOpen] = React.useState(false);
  const navigation = useNavigation();
  const [paymentGatewayModalOpen, setPaymentGatewayModalOpen] =
    React.useState(false);

  const getPackColor = (type) => {
    switch (type?.toLowerCase()) {
      case "gold":
        return "#ECC94B"; // yellow.500
      case "silver":
        return "#A0AEC0"; // gray.400
      case "bronze":
        return "#DD6B20"; // orange.500
      default:
        return "#718096"; // gray.500
    }
  };

  const handleRefresh = () => {
    if (refreshData) {
      refreshData();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Quản lý Gói dịch vụ</Text>

        <PackageFrame packageType={woodworker.servicePack?.name}>
          <View style={styles.infoCard}>
            <Text style={styles.cardHeading}>Thông tin gói dịch vụ</Text>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Loại xưởng:</Text>
              <Text
                style={[
                  styles.value,
                  { color: getPackColor(woodworker.servicePack?.name) },
                ]}
              >
                {getPackTypeLabel(
                  woodworker.servicePack?.name
                )?.toUpperCase() || "Chưa đăng ký"}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Ngày bắt đầu:</Text>
              <Text style={styles.value}>
                {woodworker.servicePackStartDate
                  ? formatDateTimeString(woodworker.servicePackStartDate)
                  : "Chưa đăng ký"}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Ngày kết thúc:</Text>
              <Text style={styles.value}>
                {woodworker.servicePackStartDate
                  ? formatDateTimeString(woodworker.servicePackEndDate)
                  : "Chưa đăng ký"}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.walletButton}
                onPress={() => setWalletModalOpen(true)}
              >
                <Icon name="plus" size={16} color="white" />
                <Text style={styles.buttonText}>Mua bằng ví</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentButton}
                onPress={() => setPaymentGatewayModalOpen(true)}
              >
                <Icon name="plus" size={16} color="white" />
                <Text style={styles.buttonText}>Mua qua cổng thanh toán</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("UpgradeGuide")}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                Xem hướng dẫn cách quy đổi ngày khi nâng cấp gói dịch vụ
              </Text>
            </TouchableOpacity>
          </View>
        </PackageFrame>
      </View>

      <BuyPackByWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        woodworker={woodworker}
        onSuccess={handleRefresh}
      />
      <BuyPackByPaymentGateway
        isOpen={paymentGatewayModalOpen}
        onClose={() => setPaymentGatewayModalOpen(false)}
        woodworker={woodworker}
        onSuccess={handleRefresh}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "column",
    marginTop: 8,
    marginBottom: 16,
    gap: 12,
  },
  walletButton: {
    backgroundColor: "#38A169", // green
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  paymentButton: {
    backgroundColor: "#3182CE", // blue
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 8,
  },
  linkText: {
    color: appColorTheme.brown_2,
    textDecorationLine: "underline",
  },
});
