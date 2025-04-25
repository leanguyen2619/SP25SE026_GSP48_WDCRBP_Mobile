import React from "react";
import { View, StyleSheet } from "react-native";
import { serviceOrderStatusConstants } from "../../../../../../config/appconfig.js";
import FeedbackModal from "../FeedbackModal/FeedbackModal.jsx";
import CancelModal from "../FeedbackModal/CancelModal.jsx";
import AppointmentConfirmModal from "../FeedbackModal/AppointmentConfirmModal.jsx";
import ContractConfirmModal from "../FeedbackModal/ContractConfirmModal.jsx";
import PaymentModal from "../FeedbackModal/PaymentModal.jsx";
import DesignConfirmModal from "../FeedbackModal/DesignConfirmModal.jsx";
import useAuth from "../../../../../../hooks/useAuth.js";
import ReviewModal from "../FeedbackModal/ReviewModal.jsx";

export default function ActionBar({
  status,
  feedback,
  order,
  refetch,
  refetchDeposit,
  deposits,
}) {
  const { auth } = useAuth();

  const renderActionButtons = () => {
    // Default: no actions
    let showFeedbackButton = false;
    let showPaymentButton = false;
    let showAppointmentButton = false;
    let showCancelButton = false;
    let showContractButton = false;
    let showDesignButton = false;
    let showReviewRatingButton = false;
    let confirmButtonText = "Xác nhận";
    let paymentButtonText = "";

    let depositNumber = -1;
    const unpaidDeposit =
      deposits?.length > 0
        ? [...deposits]
            .sort((a, b) => a.depositNumber - b.depositNumber)
            .find((d) => {
              if (d.status != true) {
                depositNumber = d.depositNumber;
              }

              return d.status !== true;
            })
        : null;

    const isWithinReviewWindow = () => {
      if (!order?.updatedAt) return false;
      const updatedDate = new Date(order.updatedAt);
      const currentDate = new Date();
      const differenceMs = currentDate - updatedDate;
      const differenceDays = differenceMs / 86400000;
      return differenceDays <= 14;
    };
    if (
      !order?.review &&
      status == serviceOrderStatusConstants.DA_HOAN_TAT &&
      isWithinReviewWindow()
    ) {
      showReviewRatingButton = true;
    }

    showCancelButton = [
      serviceOrderStatusConstants.DANG_CHO_THO_DUYET,
      serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_LICH_HEN,
      serviceOrderStatusConstants.DA_DUYET_LICH_HEN,
      serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_HOP_DONG,
      serviceOrderStatusConstants.DA_DUYET_HOP_DONG,
      serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_THIET_KE,
      serviceOrderStatusConstants.DA_DUYET_THIET_KE,
      serviceOrderStatusConstants.DANG_GIA_CONG,
    ].includes(status);

    if (order && order.role === "Customer") {
      switch (status) {
        case serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_LICH_HEN:
          if (!feedback || feedback.trim() === "") {
            showAppointmentButton = true;
            showFeedbackButton = true;
            confirmButtonText = "Xác nhận lịch hẹn";
          }

          break;

        case serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_HOP_DONG:
          if (!feedback || feedback.trim() === "") {
            // If there's NO feedback, show BOTH confirmation and feedback buttons
            showContractButton = true;
            showFeedbackButton = true;
            confirmButtonText = "Xác nhận hợp đồng";
          }

          break;

        case serviceOrderStatusConstants.DA_DUYET_HOP_DONG:
          if (
            (!feedback || feedback.trim() === "") &&
            unpaidDeposit &&
            depositNumber == 1
          ) {
            showPaymentButton = true;
          }

          break;

        case serviceOrderStatusConstants.DANG_CHO_KHACH_DUYET_THIET_KE:
          if (!feedback || feedback.trim() === "") {
            showDesignButton = true;
            showFeedbackButton = true;
            confirmButtonText = "Xác nhận thiết kế";
          }

          break;

        case serviceOrderStatusConstants.DA_DUYET_THIET_KE:
          if (
            (!feedback || feedback.trim() === "") &&
            unpaidDeposit &&
            depositNumber == 2
          ) {
            showPaymentButton = true;
          }

          break;

        case serviceOrderStatusConstants.DANG_GIAO_HANG_LAP_DAT:
          if (
            unpaidDeposit &&
            (depositNumber == 3 || depositNumber == 2 || depositNumber == 1)
          ) {
            showPaymentButton = true;
            paymentButtonText = "Thanh toán và xác nhận đơn hàng";
          }

          break;

        default:
          break;
      }
    }

    showCancelButton = false;

    return (
      <View style={styles.actionButtons}>
        {showFeedbackButton && (
          <FeedbackModal serviceOrderId={order?.orderId} refetch={refetch} />
        )}

        {showAppointmentButton && (
          <AppointmentConfirmModal
            serviceOrderId={order?.orderId}
            appointment={order?.consultantAppointment}
            buttonText={confirmButtonText}
            refetch={refetch}
          />
        )}

        {showContractButton && (
          <ContractConfirmModal
            serviceOrderId={order?.orderId}
            buttonText={confirmButtonText}
            refetch={refetch}
            refetchDeposit={refetchDeposit}
          />
        )}

        {showDesignButton && (
          <DesignConfirmModal
            serviceOrderId={order?.orderId}
            products={order?.requestedProduct}
            buttonText={confirmButtonText}
            refetch={refetch}
          />
        )}

        {showPaymentButton && unpaidDeposit && (
          <PaymentModal
            deposit={unpaidDeposit}
            order={order}
            refetch={refetch}
            buttonText={paymentButtonText}
          />
        )}

        {showCancelButton && (
          <CancelModal serviceOrderId={order?.orderId} refetch={refetch} />
        )}

        {showReviewRatingButton && (
          <ReviewModal
            serviceOrderId={order?.orderId}
            refetch={refetch}
            userId={auth?.userId}
          />
        )}
      </View>
    );
  };

  return renderActionButtons();
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
});
