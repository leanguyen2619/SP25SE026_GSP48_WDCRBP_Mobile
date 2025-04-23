import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiEye } from "react-icons/fi";
import {
  appColorTheme,
  transactionTypeColorMap,
} from "../../../../config/appconfig";
import { formatDateTimeString, formatPrice } from "../../../../utils/utils";
import { useGetTransactionByIdQuery } from "../../../../services/transactionApi";

export default function TransactionDetailModal({ transaction }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const {
    data: response,
    isLoading,
    error,
  } = useGetTransactionByIdQuery(transaction?.transactionId, {
    skip: !isOpen,
  });

  const transactionDetail = response?.data[0];

  const renderContent = () => {
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
          <Text>Đã có lỗi xảy ra khi tải thông tin giao dịch</Text>
        </Center>
      );
    }

    const detail = transactionDetail || transaction;

    return (
      <Stack gap={5}>
        {/* Thông tin cơ bản */}
        <Box>
          <Heading size="md" mb={4}>
            Thông tin giao dịch
          </Heading>
          <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
            <Grid templateColumns="repeat(2, 1fr)" gap={5}>
              <Box>
                <Text fontWeight="bold">Mã giao dịch:</Text>
                <Text>{detail?.transactionId}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Loại giao dịch:</Text>
                <Text color={transactionTypeColorMap[detail?.transactionType]}>
                  {detail?.transactionType}
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Số tiền:</Text>
                <Text color={appColorTheme.brown_2} fontWeight="bold">
                  {formatPrice(detail?.amount)}
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Ngày tạo:</Text>
                <Text>{formatDateTimeString(detail?.createdAt)}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Mô tả:</Text>
                <Text>{detail?.description}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Trạng thái:</Text>
                <Text color={detail?.status ? "green.500" : "red.500"}>
                  {detail?.status ? "Đã hoàn thành" : "Chưa hoàn thành"}
                </Text>
              </Box>
            </Grid>
          </Box>
        </Box>
      </Stack>
    );
  };

  return (
    <>
      <Tooltip label="Chi tiết" hasArrow>
        <Button
          p="1px"
          color={appColorTheme.brown_2}
          bg="none"
          border={`1px solid ${appColorTheme.brown_2}`}
          _hover={{ bg: appColorTheme.brown_2, color: "white" }}
          onClick={onOpen}
        >
          <FiEye />
        </Button>
      </Tooltip>

      <Modal
        size="4xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết giao dịch</ModalHeader>
          <ModalCloseButton />
          <ModalBody bgColor="app_grey.1" pb={6}>
            {renderContent()}
            <HStack justify="flex-end" mt={6}>
              <Button onClick={onClose}>Đóng</Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
