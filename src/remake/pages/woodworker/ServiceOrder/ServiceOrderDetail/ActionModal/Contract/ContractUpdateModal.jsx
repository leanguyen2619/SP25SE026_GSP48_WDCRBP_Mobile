import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
  Spinner,
  Center,
  Divider,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import ContractEditSection from "./ContractEditSection.jsx";
import PriceDetailSection from "./PriceDetailSection.jsx";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import {
  useGetContractByServiceOrderIdQuery,
  useCreateContractCustomizeMutation,
} from "../../../../../../services/contractApi";
import { useNotify } from "../../../../../../components/Utility/Notify.jsx";
import CheckboxList from "../../../../../../components/Utility/CheckboxList.jsx";
import { useImageUpload } from "../../../../../../hooks/useImageUpload.js";

export default function ContractUpdateModal({ order, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const serviceName = order?.service?.service?.serviceName;
  const isPersonalizationService = serviceName === "Personalization";
  const initialRef = useRef(null);
  const notify = useNotify();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
  const { uploadImage } = useImageUpload();
  const [areAllProductsQuoted, setAreAllProductsQuoted] = useState(false);

  // Set quotation status to true automatically for non-Personalization services
  useEffect(() => {
    if (!isPersonalizationService) {
      setAreAllProductsQuoted(true);
    }
  }, [isPersonalizationService]);

  // Handle modal opening
  const handleOpenModal = () => {
    onOpen();
  };

  // Fetch contract data if it exists
  const {
    data: contractResponse,
    isLoading: isLoadingContract,
    refetch: refetchContract,
  } = useGetContractByServiceOrderIdQuery(order?.orderId, {
    skip: !isOpen || !order?.orderId,
  });

  // Create/update contract mutation
  const [createContractCustomize, { isLoading: isSubmitting }] =
    useCreateContractCustomizeMutation();

  // Track form data
  const [contractData, setContractData] = useState(null);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [localSignatureBlob, setLocalSignatureBlob] = useState(null);

  // Handle contract data updates from the edit section
  const handleContractDataChange = (data) => {
    setContractData(data);
  };

  // Handle quotation completion status
  const handleQuotationComplete = (isComplete) => {
    setAreAllProductsQuoted(isComplete);
  };

  // Handle saved signature from ContractEditSection
  const handleSaveSignature = (blob, dataUrl) => {
    setLocalSignatureBlob(blob);
    // Also update contract data with the dataUrl for preview
    setContractData((prev) => ({
      ...prev,
      signatureData: dataUrl,
    }));
    notify("Lưu chữ ký", "Chữ ký đã được lưu thành công", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isExistingContract = !!contractResponse?.data;

    // Ensure all products have been quoted only for Personalization service
    if (isPersonalizationService && !areAllProductsQuoted) {
      notify(
        "Thiếu thông tin",
        "Vui lòng báo giá đầy đủ cho tất cả sản phẩm trước khi tạo hợp đồng",
        "error"
      );
      return;
    }

    // For updates - no signature check needed
    // For new contracts - validate signature
    if (
      !isExistingContract &&
      !localSignatureBlob &&
      !contractData?.signatureData
    ) {
      notify(
        "Thiếu thông tin",
        "Vui lòng ký tên và lưu chữ ký trước khi tạo hợp đồng",
        "error"
      );
      return;
    }

    try {
      setIsUploadingSignature(true);

      let signatureUrl = contractData.woodworkerSignature;

      // Upload signature to Vercel Blob only for new contracts
      if (
        !isExistingContract &&
        (localSignatureBlob || contractData.signatureData)
      ) {
        let file;

        if (localSignatureBlob) {
          // Use the saved blob directly from SignatureComponent
          file = new File([localSignatureBlob], `signature-${Date.now()}.png`, {
            type: "image/png",
          });
        } else if (contractData.signatureData) {
          // Convert signature to blob if we only have dataURL
          const blob = await (await fetch(contractData.signatureData)).blob();
          file = new File([blob], `signature-${Date.now()}.png`, {
            type: "image/png",
          });
        }

        // Upload to Vercel Blob
        const result = await uploadImage(file);
        signatureUrl = result.url;
      }

      // Format the completeDate to ensure it's a proper ISO string with time
      const completeDate = new Date(contractData.completeDate);
      completeDate.setHours(23, 59, 59, 999); // Set to end of day

      // Prepare API data with the new format that includes per-product warranty durations
      const postData = {
        woodworkerSignature: signatureUrl,
        woodworkerTerms: contractData.woodworkerTerms,
        completeDate: completeDate.toISOString(),
        serviceOrderId: parseInt(order.orderId),
        requestedProductIds: contractData.requestedProductIds,
        warrantyDurations: contractData.warrantyDurations,
      };

      await createContractCustomize(postData).unwrap();

      notify(
        isExistingContract
          ? "Cập nhật hợp đồng thành công"
          : "Tạo hợp đồng thành công",
        "",
        "success"
      );

      refetch();
      refetchContract();
      onClose();
    } catch (error) {
      notify(
        "Thao tác hợp đồng thất bại",
        error.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    } finally {
      setIsUploadingSignature(false);
    }
  };

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  return (
    <>
      <Button
        py={1}
        px={2}
        color={appColorTheme.blue_0}
        bg="none"
        border={`1px solid ${appColorTheme.blue_0}`}
        _hover={{ bg: appColorTheme.blue_0, color: "white" }}
        leftIcon={<FiEdit2 />}
        onClick={handleOpenModal}
      >
        Soạn hợp đồng
      </Button>

      <Modal
        size="6xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cập nhật hợp đồng</ModalHeader>
          {!isSubmitting && !isUploadingSignature && <ModalCloseButton />}
          <ModalBody bgColor="app_grey.1" pb={6}>
            {isLoadingContract ? (
              <Center p={8}>
                <Spinner size="xl" color={appColorTheme.brown_2} />
              </Center>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Show PriceDetailSection only for Personalization service */}
                {isPersonalizationService && (
                  <>
                    <Box mb={4}>
                      <PriceDetailSection
                        orderId={order?.orderId}
                        onQuotationComplete={handleQuotationComplete}
                      />
                    </Box>
                    <Divider my={6} />
                  </>
                )}

                {/* Show ContractEditSection based on conditions */}
                {!isPersonalizationService ||
                areAllProductsQuoted ||
                contractResponse?.data ? (
                  <Box>
                    <ContractEditSection
                      initialContract={contractResponse?.data || null}
                      onChange={handleContractDataChange}
                      onSaveSignature={handleSaveSignature}
                      savedSignature={localSignatureBlob ? true : false}
                      order={order}
                      isExistingContract={!!contractResponse?.data}
                    />
                  </Box>
                ) : (
                  <Alert status="warning">
                    <AlertIcon />
                    Vui lòng báo giá tất cả sản phẩm trước khi tiếp tục soạn hợp
                    đồng.
                  </Alert>
                )}

                {(!isPersonalizationService ||
                  areAllProductsQuoted ||
                  contractResponse?.data) && (
                  <>
                    <Box mt={6}>
                      <CheckboxList
                        items={checkboxItems}
                        setButtonDisabled={setIsCheckboxDisabled}
                      />
                    </Box>

                    <HStack mt={10}>
                      <Spacer />
                      <Button
                        colorScheme="blue"
                        mr={3}
                        type="submit"
                        isLoading={isSubmitting || isUploadingSignature}
                        isDisabled={isCheckboxDisabled}
                        leftIcon={<FiCheck />}
                        loadingText={
                          isUploadingSignature
                            ? "Đang tải chữ ký"
                            : "Đang xử lý"
                        }
                      >
                        Cập nhật
                      </Button>
                      <Button
                        onClick={onClose}
                        leftIcon={<FiX />}
                        isDisabled={isSubmitting || isUploadingSignature}
                      >
                        Đóng
                      </Button>
                    </HStack>
                  </>
                )}
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
