import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUpdateTransactionStatusMutation } from "../../../services/transactionApi";
import { useDecryptDataQuery } from "../../../services/decryptApi";
import { useAddServicePackMutation } from "../../../services/woodworkerApi";
import { useNotify } from "../../../components/Utility/Notify";
import { appColorTheme } from "../../../config/appconfig";

export default function BuyPackSuccessPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const notify = useNotify();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [addServicePack] = useAddServicePackMutation();
  const [status, setStatus] = useState("Đang xử lý giao dịch...");
  const [isProcessing, setIsProcessing] = useState(true);

  // Service Pack-specific parameters
  const encryptedTransactionId = params.TransactionId;
  const encryptedWoodworkerId = params.WoodworkerId;
  const encryptedServicePackId = params.ServicePackId;

  // Decrypt transaction ID
  const { data: transactionIdData, isLoading: isTransactionIdLoading } =
    useDecryptDataQuery(encryptedTransactionId, {
      skip: !encryptedTransactionId,
    });

  // Decrypt service pack data
  const { data: woodworkerIdData, isLoading: isWoodworkerIdLoading } =
    useDecryptDataQuery(encryptedWoodworkerId, {
      skip: !encryptedWoodworkerId,
    });

  const { data: servicePackIdData, isLoading: isServicePackIdLoading } =
    useDecryptDataQuery(encryptedServicePackId, {
      skip: !encryptedServicePackId,
    });

  useEffect(() => {
    handleServicePackPaymentSuccess();
  }, [
    transactionIdData,
    woodworkerIdData,
    servicePackIdData,
    isTransactionIdLoading,
    isWoodworkerIdLoading,
    isServicePackIdLoading,
  ]);

  const handleServicePackPaymentSuccess = async () => {
    if (
      !encryptedWoodworkerId ||
      !encryptedServicePackId ||
      !encryptedTransactionId
    ) {
      setStatus("Thông tin giao dịch không hợp lệ");
      setIsProcessing(false);
      navigation.replace("WoodworkerProfile");
      return;
    }

    if (
      isWoodworkerIdLoading ||
      isServicePackIdLoading ||
      isTransactionIdLoading
    ) {
      setStatus("Đang giải mã thông tin giao dịch...");
      return;
    }

    try {
      setStatus("Đang cập nhật gói dịch vụ...");
      // Call addServicePack to update the service pack
      await addServicePack({
        woodworkerId: parseInt(woodworkerIdData?.data),
        servicePackId: parseInt(servicePackIdData?.data),
      }).unwrap();

      setStatus("Đang cập nhật trạng thái giao dịch...");
      // Update transaction status
      await updateTransactionStatus({
        transactionId: parseInt(transactionIdData?.data),
        status: true,
      }).unwrap();

      setStatus("Giao dịch hoàn tất!");
      setIsProcessing(false);

      navigation.replace("Success", {
        title: "Thanh toán thành công",
        desc: "Đăng ký gói dịch vụ đã được thực hiện thành công",
        path: "WoodworkerProfile",
        buttonText: "Xem hồ sơ",
      });
    } catch (error) {
      setStatus("Có lỗi xảy ra, vui lòng thử lại sau");
      setIsProcessing(false);
      notify(
        "Cập nhật thất bại",
        error?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
      navigation.replace("WoodworkerProfile");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          {isProcessing ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Ionicons name="sync" size={50} color="white" />
          )}
        </View>

        <Text style={styles.heading}>{status}</Text>

        <Text style={styles.description}>
          {isProcessing
            ? "Vui lòng đợi trong giây lát, chúng tôi đang xử lý giao dịch của bạn"
            : status == "Giao dịch hoàn tất!"
            ? "Chuyển hướng bạn đến trang thành công..."
            : "Chuyển hướng bạn về trang hồ sơ..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColorTheme.brown_2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Montserrat",
  },
  description: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    maxWidth: 300,
  },
});
