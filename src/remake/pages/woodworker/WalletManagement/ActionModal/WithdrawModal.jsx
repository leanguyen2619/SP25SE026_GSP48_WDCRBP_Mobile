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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { appColorTheme } from "../../../../config/appconfig";
import { formatPrice } from "../../../../utils/utils";

export default function WithdrawModal({ isOpen, onClose, wallet }) {
  const initialRef = useRef(null);
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const handleSubmit = () => {
    // TODO: Implement withdraw logic
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Rút tiền</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <Text>Số dư hiện tại: {formatPrice(wallet?.balance || 0)}</Text>

            <FormControl>
              <FormLabel>Số tiền rút</FormLabel>
              <Input
                ref={initialRef}
                value={amount}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền cần rút"
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
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Đóng
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isDisabled={
              !amount || parseInt(amount) <= 0 || parseInt(amount) > balance
            }
          >
            Rút tiền
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
