import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { usePayServicePackMutation } from "../../../../services/paymentApi.js";
import { useNotify } from "../../../../components/Utility/Notify.jsx";
import useAuth from "../../../../hooks/useAuth";
import Pricing from "../../../general/Pricing/Pricing.jsx";
import { FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function BuyPackByPaymentGateway({
  isOpen,
  onClose,
  woodworker,
}) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const notify = useNotify();
  const [payServicePack, { isLoading }] = usePayServicePackMutation();
  const isServicePackValid =
    woodworker?.servicePackEndDate &&
    Date.now() <= new Date(woodworker.servicePackEndDate).getTime();

  const handleBuyPack = async (data) => {
    const postData = {
      servicePackId: data.servicePackId,
      userId: auth.userId,
      email: auth.sub,
      returnUrl: `${window.location.origin}/payment-success`,
    };

    try {
      const res = await payServicePack(postData).unwrap();

      if (res.url || res.data.url) {
        window.location.href = res.url || res.data.url;
      } else {
        onClose();
        navigate(
          "/success?title=Thanh toán thành công&desc=Gói dịch vụ của bạn đã được kích hoạt&path=/ww/profile&buttonText=Xem tài khoản"
        );
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
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isOpen={isOpen}
      onClose={isLoading ? null : onClose}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mua gói dịch vụ</ModalHeader>
        {!isLoading && <ModalCloseButton />}
        <ModalBody bgColor="app_grey.1" py={6}>
          {isLoading ? (
            <Flex justifyContent="center" alignItems="center" minHeight="300px">
              <Spinner size="xl" thickness="4px" color="app_primary.500" />
            </Flex>
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
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            leftIcon={<FiXCircle />}
            isDisabled={isLoading}
          >
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
