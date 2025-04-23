import {
  FormControl,
  FormLabel,
  Select,
  FormHelperText,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useGetWoodworkerByIdQuery } from "../../../../services/woodworkerApi";

export default function GuaranteeErrorSelection({
  guaranteeError,
  setGuaranteeError,
  woodworkerId,
  isRequired = true,
}) {
  const [guaranteeErrorOptions, setGuaranteeErrorOptions] = useState([]);

  // Fetch woodworker data to get warranty policies
  const {
    data: woodworkerData,
    isLoading,
    isError,
  } = useGetWoodworkerByIdQuery(woodworkerId, {
    skip: !woodworkerId,
  });

  // Process warranty policies when woodworker data is available
  useEffect(() => {
    if (woodworkerData?.data?.warrantyPolicy) {
      const warrantyPolicies = woodworkerData.data.warrantyPolicy
        .split(";")
        .map((policy) => policy.trim())
        .filter((policy) => policy.length > 0)
        .map((policy) => ({
          value: policy,
          label: policy,
        }));

      setGuaranteeErrorOptions(warrantyPolicies);
    }
  }, [woodworkerData]);

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <FormControl isRequired={isRequired} mb={4}>
      <FormLabel>Loại lỗi bảo hành:</FormLabel>
      <Select
        value={guaranteeError}
        onChange={(e) => setGuaranteeError(e.target.value)}
        placeholder="Chọn loại lỗi"
      >
        {guaranteeErrorOptions.length > 0 ? (
          guaranteeErrorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          <option value="other">Vui lòng mô tả lỗi trong phần mô tả</option>
        )}
      </Select>
      <FormHelperText>
        Sản phẩm của bạn còn trong thời hạn bảo hành
      </FormHelperText>
    </FormControl>
  );
}
