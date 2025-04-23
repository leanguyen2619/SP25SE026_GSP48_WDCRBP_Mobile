import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Divider,
  useDisclosure,
  Box,
  Grid,
  GridItem,
  Spinner,
  Center,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { FiCheck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import { appColorTheme } from "../../../../../../config/appconfig";
import { format } from "date-fns";
import useAuth from "../../../../../../hooks/useAuth";
import {
  useGetContractByServiceOrderIdQuery,
  useCusSignContractMutation,
} from "../../../../../../services/contractApi";
import SignatureComponent from "../../../../../../components/Common/SignatureComponent";
import { useImageUpload } from "../../../../../../hooks/useImageUpload";

export default function ContractConfirmModal({
  serviceOrderId,
  buttonText = "Xác nhận hợp đồng",
  refetch,
  refetchDeposit,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notify = useNotify();
  const { auth } = useAuth();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
  const { uploadImage } = useImageUpload();
  const [submitLoading, setSubmitLoading] = useState(false);

  // Signature state
  const [savedSignature, setSavedSignature] = useState(false);
  const [localSignatureBlob, setLocalSignatureBlob] = useState(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);

  // Get contract data
  const {
    data: contractResponse,
    isLoading: contractLoading,
    error: contractError,
  } = useGetContractByServiceOrderIdQuery(serviceOrderId, {
    skip: !isOpen, // Only fetch when modal is open
  });

  // Customer sign contract mutation
  const [confirmContract, { isLoading: confirmLoading }] =
    useCusSignContractMutation();

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch (e) {
      return "";
    }
  };

  // Handle signature save callback
  const handleSaveSignature = (blob, dataUrl) => {
    setLocalSignatureBlob(blob);
    setSignatureDataUrl(dataUrl);
    setSavedSignature(true);
    notify("Lưu chữ ký", "Chữ ký đã được lưu thành công", "success");
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      let customerSign = null;

      // If we have a signature, upload it
      if (savedSignature && localSignatureBlob) {
        try {
          // Create file from blob
          const file = new File(
            [localSignatureBlob],
            `signature-${Date.now()}.png`,
            {
              type: "image/png",
            }
          );

          // Upload to your image storage
          const result = await uploadImage(file);
          customerSign = result.url;
        } catch (error) {
          notify(
            "Lỗi tải chữ ký",
            "Không thể tải chữ ký lên hệ thống, sử dụng chữ ký điện tử mặc định",
            "warning"
          );
        }
      }

      if (!customerSign) {
        notify("Vui lòng kí tên", "", "error");
        return;
      }

      await confirmContract({
        serviceOrderId,
        customerSign: customerSign,
        cusId: auth?.userId,
      }).unwrap();

      notify(
        "Xác nhận hợp đồng thành công",
        "Hợp đồng đã được xác nhận và đơn hàng của bạn đã được cập nhật",
        "success"
      );

      onClose();
      refetch();
      refetchDeposit();
    } catch (err) {
      notify(
        "Xác nhận thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const isLoading = contractLoading || confirmLoading;
  const contract = contractResponse?.data;

  return (
    <>
      <Button leftIcon={<FiCheckCircle />} colorScheme="green" onClick={onOpen}>
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{buttonText}</ModalHeader>
          {!submitLoading && <ModalCloseButton />}
          <ModalBody pb={6}>
            <Stack spacing={4}>
              {contractLoading ? (
                <Center p={4}>
                  <Spinner size="lg" color={appColorTheme.brown_2} />
                </Center>
              ) : contractError ? (
                <Box p={4} bg="red.50" borderRadius="md">
                  <Text color="red.500">Không thể tải thông tin hợp đồng</Text>
                </Box>
              ) : contract ? (
                <Box p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                  <Grid templateColumns="180px 1fr" gap={3}>
                    <GridItem>
                      <Text fontWeight="semibold">Mã hợp đồng:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{contract.contractId}</Text>
                    </GridItem>

                    <GridItem>
                      <Link
                        href={`/contract/${serviceOrderId}`}
                        target="_blank"
                        color={appColorTheme.brown_2}
                      >
                        Xem chi tiết
                      </Link>
                    </GridItem>
                    <GridItem></GridItem>

                    <GridItem>
                      <Text fontWeight="semibold">Ngày hoàn thành:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{formatDate(contract.completeDate)}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold">Tổng tiền thanh toán:</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold" color={appColorTheme.brown_2}>
                        {contract.contractTotalAmount?.toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold">Thợ thực hiện:</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{contract.woodworker?.username}</Text>
                    </GridItem>
                  </Grid>

                  <Box mt={4}>
                    <Text fontWeight="semibold">Chữ ký thợ:</Text>
                    {contract.woodworkerSignature ? (
                      <Box mt={2}>
                        <img
                          src={contract.woodworkerSignature}
                          alt="Chữ ký thợ"
                          style={{ maxWidth: "200px" }}
                        />
                      </Box>
                    ) : (
                      <Text>Chưa có chữ ký</Text>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box p={4} bg="orange.50" borderRadius="md">
                  <Text>Không tìm thấy thông tin hợp đồng</Text>
                </Box>
              )}

              {/* Add customer signature section */}
              {!contractLoading && contract && (
                <Box p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                  <Text fontSize="md" fontWeight="bold" mb={3}>
                    Ký tên xác nhận hợp đồng
                  </Text>

                  <SignatureComponent
                    onSaveSignature={handleSaveSignature}
                    savedSignature={savedSignature}
                    title="Chữ ký của bạn"
                    showSizeControls={true}
                  />
                </Box>
              )}

              <Divider my={2} />
              <CheckboxList
                items={checkboxItems}
                setButtonDisabled={setIsCheckboxDisabled}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              variant="ghost"
              mr={3}
              onClick={onClose}
              leftIcon={<FiXCircle />}
              isDisabled={isLoading}
            >
              Đóng
            </Button>
            <Button
              colorScheme="green"
              onClick={handleSubmit}
              isLoading={submitLoading}
              isDisabled={isCheckboxDisabled || !contract || contractLoading}
              leftIcon={<FiCheck />}
            >
              Xác nhận hợp đồng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
