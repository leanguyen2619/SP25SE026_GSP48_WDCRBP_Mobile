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
  useDisclosure,
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAcceptServiceOrderMutation } from "../../../../../../services/serviceOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import { FiCheck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import ImageListSelector from "../../../../../../components/Utility/ImageListSelector";

export default function DesignConfirmModal({
  serviceOrderId,
  products = [],
  buttonText = "Xác nhận thiết kế",
  refetch,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notify = useNotify();
  const [acceptOrder, { isLoading }] = useAcceptServiceOrderMutation();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  // Filter products that have designs
  const productsWithDesigns = products.filter(
    (product) =>
      product.personalProductDetail?.designUrls &&
      product.personalProductDetail.designUrls.trim() !== ""
  );

  const handleSubmit = async () => {
    try {
      await acceptOrder({
        serviceOrderId: serviceOrderId,
      }).unwrap();

      notify("Xác nhận thành công", "Thiết kế đã được xác nhận", "success");

      onClose();
      refetch();
    } catch (err) {
      notify(
        "Xác nhận thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <Button leftIcon={<FiCheckCircle />} colorScheme="green" onClick={onOpen}>
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={isLoading ? null : onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{buttonText}</ModalHeader>
          {!isLoading && <ModalCloseButton />}
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Heading size="md">Thiết kế sản phẩm</Heading>

              {productsWithDesigns.length > 0 ? (
                <Accordion allowMultiple defaultIndex={[0]}>
                  {productsWithDesigns.map((product) => (
                    <AccordionItem key={product.requestedProductId}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left" fontWeight="bold">
                            Sản phẩm {product.category?.categoryName}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Text mb={2}>Số lượng: {product.quantity}</Text>
                        <Box mt={4}>
                          <ImageListSelector
                            imgUrls={product.personalProductDetail.designUrls}
                            imgH={300}
                          />
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text>Không có thiết kế nào để xác nhận.</Text>
                </Box>
              )}

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
              isLoading={isLoading}
              isDisabled={
                isCheckboxDisabled || productsWithDesigns.length === 0
              }
              leftIcon={<FiCheck />}
            >
              Xác nhận thiết kế
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
