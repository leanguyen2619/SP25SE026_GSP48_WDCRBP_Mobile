import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { appColorTheme } from "../../../../config/appconfig";
import DepositModal from "../ActionModal/DepositModal";
import WithdrawModal from "../ActionModal/WithdrawModal";
import { useGetUserWalletQuery } from "../../../../services/walletApi";
import useAuth from "../../../../hooks/useAuth";
import { formatPrice } from "../../../../utils/utils";

export default function WalletInformation() {
  const { auth } = useAuth();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetUserWalletQuery(auth?.userId);

  const wallet = response?.data;

  const {
    isOpen: isDepositOpen,
    onOpen: onDepositOpen,
    onClose: onDepositClose,
  } = useDisclosure();

  const {
    isOpen: isWithdrawOpen,
    onOpen: onWithdrawOpen,
    onClose: onWithdrawClose,
  } = useDisclosure();

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px">
        <Text>Đã có lỗi xảy ra khi tải thông tin ví</Text>
      </Center>
    );
  }

  return (
    <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
      <Stack spacing={6}>
        {/* Account Balance */}
        <Box>
          <Heading size="md" mb={4}>
            Số dư ví
          </Heading>
          <Text fontSize="2xl" fontWeight="bold" color={appColorTheme.brown_2}>
            {formatPrice(wallet?.balance || 0)}
          </Text>
        </Box>

        {/* Action Buttons */}
        <HStack spacing={4}>
          <Button
            colorScheme="green"
            onClick={onDepositOpen}
            leftIcon={<Text>+</Text>}
          >
            Nạp tiền
          </Button>
          <Button
            colorScheme="purple"
            onClick={onWithdrawOpen}
            leftIcon={<Text>-</Text>}
          >
            Rút tiền
          </Button>
        </HStack>
      </Stack>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={onDepositClose}
        wallet={wallet}
        onSuccess={() => {
          refetch();
          onDepositClose();
        }}
      />
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={onWithdrawClose}
        wallet={wallet}
        onSuccess={() => {
          refetch();
          onWithdrawClose();
        }}
      />
    </Box>
  );
}
