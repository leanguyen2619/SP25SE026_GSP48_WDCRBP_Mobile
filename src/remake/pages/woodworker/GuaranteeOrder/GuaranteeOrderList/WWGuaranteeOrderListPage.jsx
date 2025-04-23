import {
  Heading,
  Stack,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Spinner,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { appColorTheme } from "../../../../config/appconfig";
import GuaranteeOrderList from "./GuaranteeOrderList";
import { FiPlus, FiTrash2, FiEdit, FiSave } from "react-icons/fi";
import { useState, useEffect } from "react";
import {
  useGetWoodworkerByIdQuery,
  useUpdateWarrantyPolicyMutation,
} from "../../../../services/woodworkerApi";
import useAuth from "../../../../hooks/useAuth";
import { useNotify } from "../../../../components/Utility/Notify";

export default function WWGuaranteeOrderListPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { auth } = useAuth();
  const woodworkerId = auth?.wwId;
  const notify = useNotify();

  const [warrantyPolicies, setWarrantyPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState("");
  const [policyError, setPolicyError] = useState("");
  const [totalLengthError, setTotalLengthError] = useState(false);

  const {
    data: woodworkerData,
    isLoading,
    refetch,
  } = useGetWoodworkerByIdQuery(woodworkerId);
  const [updateWarrantyPolicy, { isLoading: isUpdating }] =
    useUpdateWarrantyPolicyMutation();

  // Initialize warranty policies from woodworker data
  useEffect(() => {
    if (woodworkerData && woodworkerData?.data?.warrantyPolicy) {
      const policies = woodworkerData.data.warrantyPolicy
        .split(";")
        .map((policy) => policy.trim());
      setWarrantyPolicies(policies);
    }
  }, [woodworkerData]);

  const validatePolicy = (policy) => {
    if (policy.includes(";")) {
      return "Chính sách không được chứa dấu chấm phẩy (;)";
    }

    if (policy.length > 100) {
      return "Chính sách không được vượt quá 100 ký tự";
    }

    return "";
  };

  const checkTotalLength = (policies) => {
    const totalLength = policies.join(";").length;
    return totalLength <= 2000;
  };

  const handleNewPolicyChange = (e) => {
    const value = e.target.value;
    setNewPolicy(value);

    if (value.trim()) {
      setPolicyError(validatePolicy(value));
    } else {
      setPolicyError("");
    }
  };

  const handleAddPolicy = () => {
    if (newPolicy.trim() === "") return;

    const error = validatePolicy(newPolicy.trim());
    if (error) {
      setPolicyError(error);
      return;
    }

    const updatedPolicies = [...warrantyPolicies, newPolicy.trim()];

    if (!checkTotalLength(updatedPolicies)) {
      setTotalLengthError(true);
      return;
    }

    setWarrantyPolicies(updatedPolicies);
    setNewPolicy("");
    setPolicyError("");
    setTotalLengthError(false);
  };

  const handleDeletePolicy = (index) => {
    const updatedPolicies = [...warrantyPolicies];
    updatedPolicies.splice(index, 1);
    setWarrantyPolicies(updatedPolicies);
    setTotalLengthError(false);
  };

  const handleSavePolicies = async () => {
    try {
      const policyString = warrantyPolicies.join(";");

      if (policyString.length > 2000) {
        setTotalLengthError(true);
        return;
      }

      await updateWarrantyPolicy({
        woodworkerId: woodworkerId,
        warrantyPolicy: policyString,
      }).unwrap();

      notify(
        "Cập nhật thành công",
        "Chính sách bảo hành đã được cập nhật",
        "success"
      );
      refetch();
      onClose();
    } catch (error) {
      notify(
        "Cập nhật thất bại",
        error.data?.data || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <Stack spacing={6}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading
          color={appColorTheme.brown_2}
          as="h2"
          fontSize="2xl"
          fontFamily="Montserrat"
        >
          Đơn đặt dịch vụ bảo hành, sửa chữa
        </Heading>
        <Button
          leftIcon={<FiEdit />}
          colorScheme="teal"
          variant="outline"
          onClick={onOpen}
        >
          Quản lý lỗi bảo hành
        </Button>
      </Flex>

      <GuaranteeOrderList />

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quản lý lỗi bảo hành</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Box>
                <FormControl isInvalid={!!policyError} mb={4}>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      value={newPolicy}
                      onChange={handleNewPolicyChange}
                      placeholder="Thêm mục lỗi bảo hành mới"
                    />
                    <InputRightElement width="4.5rem">
                      <IconButton
                        h="1.75rem"
                        size="sm"
                        icon={<FiPlus />}
                        onClick={handleAddPolicy}
                        aria-label="Add policy"
                        colorScheme="green"
                        isDisabled={!!policyError || newPolicy.trim() === ""}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {policyError && (
                    <FormErrorMessage>{policyError}</FormErrorMessage>
                  )}
                </FormControl>

                <VStack
                  spacing={3}
                  align="stretch"
                  maxHeight="300px"
                  overflowY="auto"
                >
                  {warrantyPolicies.map((policy, index) => (
                    <Flex
                      key={index}
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      bg="gray.50"
                      borderRadius="md"
                    >
                      <Text>{policy}</Text>
                      <IconButton
                        size="sm"
                        icon={<FiTrash2 />}
                        onClick={() => handleDeletePolicy(index)}
                        aria-label="Delete policy"
                        colorScheme="red"
                        variant="ghost"
                      />
                    </Flex>
                  ))}
                </VStack>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleSavePolicies}
              leftIcon={<FiSave />}
              isLoading={isUpdating}
              isDisabled={totalLengthError || warrantyPolicies.length === 0}
            >
              Lưu chính sách
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
