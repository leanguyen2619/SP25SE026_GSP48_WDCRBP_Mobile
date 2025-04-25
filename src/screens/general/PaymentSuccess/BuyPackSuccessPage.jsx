import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUpdateTransactionStatusMutation } from "../../../services/transactionApi";
import { useDecryptDataQuery } from "../../../services/decryptApi";
import { useAddServicePackMutation } from "../../../services/woodworkerApi";
import { useNotify } from "../../../components/Utility/Notify";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { appColorTheme } from "../../../config/appconfig";

export default function BuyPackSuccessPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const notify = useNotify();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [addServicePack] = useAddServicePackMutation();
  const [status, setStatus] = useState("Đang xử lý giao dịch...");
  const [isProcessing, setIsProcessing] = useState(true);

  // Service Pack-specific parameters
  const encryptedTransactionId = route.params?.TransactionId;
  const encryptedWoodworkerId = route.params?.WoodworkerId;
  const encryptedServicePackId = route.params?.ServicePackId;

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
        path: "Profile",
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <ActivityIndicator
            size="large"
            color="white"
            animating={isProcessing}
          />
        </View>

        <Text style={styles.heading}>{status}</Text>

        <Text style={styles.text}>
          {isProcessing
            ? "Vui lòng đợi trong giây lát, chúng tôi đang xử lý giao dịch của bạn"
            : status === "Giao dịch hoàn tất!"
            ? "Chuyển hướng bạn đến trang thành công..."
            : "Chuyển hướng bạn về trang hồ sơ..."}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColorTheme.brown_2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heading: {
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
    maxWidth: "90%",
  },
});
