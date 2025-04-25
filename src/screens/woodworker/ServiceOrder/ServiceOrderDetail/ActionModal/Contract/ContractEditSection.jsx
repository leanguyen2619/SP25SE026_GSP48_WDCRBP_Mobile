import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Stack,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  FormControl,
  FormLabel,
  Link,
  Flex,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import { appColorTheme } from "../../../../../../config/appconfig.js";
import { formatDateForInput } from "../../../../../../utils/utils.js";
import SignatureComponent from "../../../../../../components/Common/SignatureComponent.jsx";

export default function ContractEditSection({
  initialContract,
  onChange,
  onSaveSignature,
  savedSignature,
  order,
  isExistingContract,
}) {
  const [contract, setContract] = useState({
    woodworkerTerms: "",
    contractTotalAmount: 0,
    completeDate: formatDateForInput(
      new Date(new Date().setMonth(new Date().getMonth() + 1))
    ),
    requestedProductIds: [],
    warrantyDurations: [],
    woodworkerSignature: "",
    signatureData: null,
  });

  // Initialize contract data from existing contract (if any) or order data
  useEffect(() => {
    const productIds =
      order.requestedProduct?.map((p) => p.requestedProductId) || [];
    const durations =
      order.requestedProduct?.map((p) => p.warrantyDuration || 12) || [];

    if (initialContract) {
      // Handle data from existing contract
      setContract((prev) => ({
        ...prev,
        woodworkerTerms: initialContract.woodworkerTerms || "",
        contractTotalAmount: initialContract.contractTotalAmount || 0,
        completeDate: formatDateForInput(initialContract.completeDate) || "",
        requestedProductIds: productIds,
        warrantyDurations: durations,
        woodworkerSignature: initialContract.woodworkerSignature || "",
      }));
    } else if (order) {
      setContract((prev) => ({
        ...prev,
        contractTotalAmount: order.totalAmount || 0,
        requestedProductIds: productIds,
        warrantyDurations: durations,
      }));
    }
  }, [initialContract, order]);

  // Notify parent component of changes
  useEffect(() => {
    onChange && onChange(contract);
  }, [contract, onChange]);

  const handleChange = (field, value) => {
    setContract((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle warranty duration change for a specific product
  const handleWarrantyDurationChange = (index, value) => {
    const newWarrantyDurations = [...contract.warrantyDurations];
    newWarrantyDurations[index] = parseInt(value) || 0;

    setContract((prev) => ({
      ...prev,
      warrantyDurations: newWarrantyDurations,
    }));
  };

  // Handle signature save from SignatureComponent
  const handleSignatureSave = (blob, dataUrl) => {
    handleChange("signatureData", dataUrl);
    onSaveSignature && onSaveSignature(blob, dataUrl);
  };

  return (
    <Box>
      <Heading fontWeight="bold" fontSize="20px" mb={6} textAlign="center">
        Thông tin hợp đồng
      </Heading>

      <Stack spacing={6}>
        {/* Contract basic information */}
        <Box p={5} bgColor="white" boxShadow="md" borderRadius="10px">
          <Stack spacing={4}>
            {/* Platform terms section - link to terms page */}
            <FormControl>
              <FormLabel>Điều khoản của nền tảng:</FormLabel>
              <Flex align="center">
                <Link
                  as={RouterLink}
                  to="/terms"
                  color="blue.500"
                  fontWeight="medium"
                  target="_blank"
                  display="flex"
                  alignItems="center"
                >
                  Xem điều khoản nền tảng
                  <Icon as={FiExternalLink} ml={2} />
                </Link>
              </Flex>
            </FormControl>

            {/* Woodworker terms */}
            <FormControl isRequired>
              <FormLabel>Điều khoản của xưởng mộc:</FormLabel>
              <Textarea
                rows={6}
                value={contract.woodworkerTerms}
                onChange={(e) =>
                  handleChange("woodworkerTerms", e.target.value)
                }
                placeholder="Nhập điều khoản của xưởng mộc"
                whiteSpace="pre-wrap"
              />
            </FormControl>

            {/* Product warranty durations table */}
            <FormControl isRequired>
              <FormLabel>Thời hạn bảo hành theo sản phẩm (tháng):</FormLabel>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead bg={appColorTheme.grey_1}>
                    <Tr>
                      <Th>Mã sản phẩm</Th>
                      <Th>Sản phẩm</Th>
                      <Th>Số lượng</Th>
                      <Th>Thời hạn bảo hành (tháng)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {order?.requestedProduct?.map((product, index) => (
                      <Tr key={product.requestedProductId}>
                        <Td>{product.requestedProductId}</Td>
                        <Td>{product.category?.categoryName || "Sản phẩm"}</Td>
                        <Td>{product.quantity}</Td>
                        <Td>
                          <NumberInput
                            value={contract.warrantyDurations[index] || 0}
                            onChange={(value) =>
                              handleWarrantyDurationChange(index, value)
                            }
                            min={0}
                            max={120}
                            size="sm"
                            width="100px"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </FormControl>

            {/* Completion date */}
            <FormControl isRequired>
              <FormLabel>Ngày hoàn thành:</FormLabel>
              <Input
                type="date"
                value={contract.completeDate}
                onChange={(e) => handleChange("completeDate", e.target.value)}
              />
            </FormControl>
          </Stack>
        </Box>

        {/* Signature section */}
        <Box
          p={5}
          bgColor={appColorTheme.grey_1}
          boxShadow="md"
          borderRadius="10px"
        >
          {!isExistingContract ? (
            <SignatureComponent
              onSaveSignature={handleSignatureSave}
              savedSignature={savedSignature}
              title="Chữ ký thợ"
            />
          ) : (
            <SignatureComponent
              initialSignature={contract.woodworkerSignature}
              isEditable={false}
              title="Chữ ký đã lưu"
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}
