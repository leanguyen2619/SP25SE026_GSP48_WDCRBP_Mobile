import AppointmentUpdateModal from "../Appointment/AppointmentUpdateModal.jsx";
import { guaranteeOrderStatusConstants } from "../../../../../../config/appconfig.js";
import CancelModal from "./CancelModal.jsx";
import FinishUpdateModal from "../Finish/FinishUpdateModal.jsx";
import QuotationUpdateModal from "../Quotation/QuotationUpdateModal.jsx";
import ReceiveConfirmationModal from "./ReceiveConfirmationModal.jsx";
import GuaranteeAcceptModal from "../Quotation/GuaranteeAcceptModal.jsx";
import { View } from "react-native";
import { useTrackOrderByCodeMutation } from "../../../../../../services/ghnApi.js";
import { useGetShipmentsByGuaranteeOrderIdQuery } from "../../../../../../services/shipmentApi.js";
import { useEffect, useState } from "react";

export default function ActionBar({ status, feedback, order, refetch }) {
  const [trackingData, setTrackingData] = useState({});

  const { data: shipmentResponse } = useGetShipmentsByGuaranteeOrderIdQuery(
    order?.guaranteeOrderId
  );

  const shipmentOrderCode = shipmentResponse?.data?.[0]?.orderCode;

  const [trackOrderByCode] = useTrackOrderByCodeMutation();

  // Fetch tracking information when shipment data is available
  useEffect(() => {
    const fetchTrackingData = async () => {
      if (shipmentResponse?.data && !order?.install) {
        for (const shipment of shipmentResponse.data) {
          if (shipment.orderCode && shipment.orderCode !== "string") {
            try {
              const response = await trackOrderByCode({
                order_code: shipment.orderCode,
              }).unwrap();

              setTrackingData((prev) => ({
                ...prev,
                [shipment.orderCode]: response.data.data,
              }));
            } catch (error) {
              console.error("Error fetching tracking data:", error);
            }
          }
        }
      }
    };

    if (shipmentResponse?.data) {
      fetchTrackingData();
    }
  }, [shipmentResponse, trackOrderByCode]);

  const renderActionButtons = () => {
    let showAppointmentModal = false;
    let showCancelModal = false;
    let showQuotationModal = false;
    let showConfirmReceiveModal = false;
    let showCompleteModal = false;
    let showAcceptFreeGuaranteeModal = false;

    if (order && order.role === "Woodworker") {
      switch (status) {
        case guaranteeOrderStatusConstants.DANG_CHO_THO_MOC_XAC_NHAN:
          showAppointmentModal = true;
          showCancelModal = true;
          if (order?.isGuarantee) {
            showAcceptFreeGuaranteeModal = true;
          }

          break;

        case guaranteeOrderStatusConstants.DANG_CHO_KHACH_DUYET_LICH_HEN:
          if (feedback && feedback.trim() !== "") {
            showAppointmentModal = true;
          }

          break;

        case guaranteeOrderStatusConstants.DA_DUYET_LICH_HEN:
          showQuotationModal = true;
          if (order?.guaranteeError) {
            showAcceptFreeGuaranteeModal = true;
          }

          break;

        case guaranteeOrderStatusConstants.DANG_CHO_KHACH_DUYET_BAO_GIA:
          if (feedback && feedback.trim() !== "") {
            showQuotationModal = true;
          }

          break;

        case guaranteeOrderStatusConstants.DANG_CHO_NHAN_HANG:
          if (
            shipmentOrderCode &&
            trackingData[shipmentOrderCode] &&
            trackingData[shipmentOrderCode]?.status == "delivered"
          ) {
            showConfirmReceiveModal = true;
          }

          break;

        case guaranteeOrderStatusConstants.DANG_SUA_CHUA:
          showCompleteModal = true;

          break;

        default:
          break;
      }
    }

    showCancelModal = false;

    return (
      <View style={{ width: "100%" }}>
        {showAcceptFreeGuaranteeModal && (
          <GuaranteeAcceptModal
            refetch={refetch}
            order={order}
            guaranteeOrderId={order?.guaranteeOrderId}
          />
        )}

        {showAppointmentModal && (
          <AppointmentUpdateModal refetch={refetch} order={order} />
        )}

        {showCancelModal && (
          <CancelModal
            serviceOrderId={order?.guaranteeOrderId}
            refetch={refetch}
          />
        )}

        {showQuotationModal && (
          <QuotationUpdateModal
            refetch={refetch}
            guaranteeOrderId={order?.guaranteeOrderId}
          />
        )}

        {showConfirmReceiveModal && (
          <ReceiveConfirmationModal
            refetch={refetch}
            guaranteeOrderId={order?.guaranteeOrderId}
          />
        )}

        {showCompleteModal && (
          <FinishUpdateModal
            guaranteeOrderId={order?.guaranteeOrderId}
            order={order}
            refetch={refetch}
          />
        )}
      </View>
    );
  };

  return renderActionButtons();
}
