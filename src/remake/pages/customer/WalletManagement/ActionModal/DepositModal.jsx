import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { appColorTheme } from "../../../../config/appconfig";
import { useTopUpWalletMutation } from "../../../../services/paymentApi";
import { useNotify } from "../../../../components/Utility/Notify";
import useAuth from "../../../../hooks/useAuth";
import { formatPrice } from "../../../../utils/utils";
import { FiPlusSquare, FiXCircle } from "react-icons/fi";
import CheckboxList from "../../../../components/Utility/CheckboxList";

export default function DepositModal({ isOpen, onClose, wallet }) {
  const notify = useNotify();
  const { auth } = useAuth();
  const [topUpWallet, { isLoading }] = useTopUpWalletMutation();
  const initialRef = useRef(null);
  const [amount, setAmount] = useState("");
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        userId: wallet.userId,
        walletId: wallet.walletId,
        transactionType: "Nạp ví",
        amount: parseInt(amount),
        email: auth.sub,
        returnUrl: `${window.location.origin}/payment-success`,
      };

      const res = await topUpWallet(postData).unwrap();

      onClose();

      window.location.href = res.data.url;
    } catch (err) {
      notify(
        "Nạp tiền thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? null : onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nạp tiền</ModalHeader>
        {!isLoading && <ModalCloseButton />}
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Số tiền nạp</FormLabel>
              <Input
                ref={initialRef}
                value={amount}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền cần nạp"
                type="number"
              />
            </FormControl>
            {amount && (
              <HStack justify="space-between">
                <Spacer />
                <Text
                  fontSize="xl"
                  color={appColorTheme.brown_2}
                  fontWeight="bold"
                >
                  {formatPrice(parseInt(amount))}
                </Text>
              </HStack>
            )}

            {amount && parseInt(amount) > 0 && (
              <>
                <Divider my={2} />
                <CheckboxList
                  items={checkboxItems}
                  setButtonDisabled={setIsCheckboxDisabled}
                />
              </>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isLoading}
            variant="ghost"
            mr={3}
            onClick={onClose}
            leftIcon={<FiXCircle />}
          >
            Đóng
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isLoading}
            isDisabled={!amount || parseInt(amount) <= 0 || isCheckboxDisabled}
            leftIcon={<FiPlusSquare />}
          >
            Nạp tiền
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
