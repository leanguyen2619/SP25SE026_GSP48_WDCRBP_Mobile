import React from "react";
import { View, Text } from "react-native";
import AppointmentUpdateModal from "../Appointment/AppointmentUpdateModal.jsx";
import ContractUpdateModal from "../Contract/ContractUpdateModal.jsx";
import { serviceOrderStatusConstants } from "../../../../../../config/appconfig.js";
import CancelModal from "./CancelModal.jsx";
import DesignUpdateModal from "../Design/DesignUpdateModal.jsx";
import FinishUpdateModal from "../Finish/FinishUpdateModal.jsx";

export default function ActionBar({ status, feedback, order, refetch }) {
  const renderActionButtons = () => {
    const serviceName = order?.service?.service?.serviceName;

    let showAppointmentModal = false;
    let showCancelModal = false;
    let showContractModal = false;
    let showDesignModal = false;
    let showCompleteModal = false;

    if (order && order.role === "Woodworker") {
      switch (status) {
        case serviceOrderStatusConstants.DANG_CHO_THO_DUYET:
          if (serviceName == "Sale") {
            showCancelModal = true;
            showCompleteModal = true;
          } else {
            showAppointmentModal = true;
            showCancelModal = true;
          }

          break;

        case serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_LICH_HEN:
          if (feedback && feedback.trim() !== "") {
            showAppointmentModal = true;
          }

          break;

        case serviceOrderStatusConstants.DA_DUYET_LICH_HEN:
          showContractModal = true;

          break;

        case serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_HOP_DONG:
          if (feedback && feedback.trim() !== "") {
            showContractModal = true;
          }

          break;

        case serviceOrderStatusConstants.DA_DUYET_HOP_DONG:
          if (serviceName == "Personalization") {
            showDesignModal = true;
          }

          break;

        case serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_THIET_KE:
          if (feedback && feedback.trim() !== "") {
            showDesignModal = true;
          }

          break;

        case serviceOrderStatusConstants.DANG_GIA_CONG:
          showCompleteModal = true;

          break;

        default:
          break;
      }
    }

    showCancelModal = false;

    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {showAppointmentModal && (
          <AppointmentUpdateModal refetch={refetch} order={order} />
        )}
        {showContractModal && (
          <ContractUpdateModal refetch={refetch} order={order} />
        )}
        {showCancelModal && (
          <CancelModal serviceOrderId={order?.orderId} refetch={refetch} />
        )}
        {showDesignModal && (
          <DesignUpdateModal
            serviceOrderId={order?.orderId}
            products={order?.requestedProduct}
            refetch={refetch}
          />
        )}
        {showCompleteModal && (
          <FinishUpdateModal
            order={order}
            serviceOrderId={order?.orderId}
            products={order?.requestedProduct}
            refetch={refetch}
          />
        )}
      </View>
    );
  };

  return renderActionButtons();
}
