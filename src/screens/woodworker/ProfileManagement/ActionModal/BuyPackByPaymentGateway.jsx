import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Linking from "expo-linking";
import { appColorTheme } from "../../../../config/appconfig";
import { usePayServicePackMutation } from "../../../../services/paymentApi.js";
import { useNotify } from "../../../../components/Utility/Notify.jsx";
import useAuth from "../../../../hooks/useAuth";
import Pricing from "../../../general/Pricing/Pricing.jsx";
import Icon from "react-native-vector-icons/Feather";

export default function BuyPackByPaymentGateway({
  isOpen,
  onClose,
  woodworker,
  onSuccess,
}) {
  const { auth } = useAuth();
  const notify = useNotify();
  const [payServicePack, { isLoading }] = usePayServicePackMutation();
  const isServicePackValid =
    woodworker?.servicePackEndDate &&
    Date.now() <= new Date(woodworker.servicePackEndDate).getTime();

  const handleBuyPack = async (data) => {
    const returnUrl = Linking.createURL("payment-success");

    const postData = {
      servicePackId: data.servicePackId,
      userId: auth.userId,
      email: auth.sub,
      returnUrl: returnUrl,
    };

    try {
      const res = await payServicePack(postData).unwrap();

      if (res.url || res.data?.url) {
        onClose();
        await Linking.openURL(res.url || res.data.url);

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      notify(
        "Thanh toán thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={isLoading ? null : onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Mua gói dịch vụ</Text>
            {!isLoading && (
              <TouchableOpacity onPress={onClose}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.modalBody}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={appColorTheme.brown_2} />
              </View>
            ) : (
              <Pricing
                handleButtonClick={handleBuyPack}
                label="Kích hoạt"
                isLoading={isLoading}
                servicePackId={
                  isServicePackValid
                    ? woodworker?.servicePack?.servicePackId
                    : null
                }
                packName={
                  isServicePackValid ? woodworker?.servicePack?.name : null
                }
              />
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.footerButton,
                styles.closeButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Icon name="x-circle" size={16} color="#333" />
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  closeButton: {
    backgroundColor: "#F3F4F6",
  },
  closeButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
