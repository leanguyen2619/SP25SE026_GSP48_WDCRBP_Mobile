import {
  FormControl,
  FormLabel,
  Select,
  FormHelperText,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function GuaranteeErrorSelection({
  guaranteeError,
  setGuaranteeError,
  woodworkerId,
  isRequired = true,
}) {
  // This will be replaced with API data in the future
  const [guaranteeErrorOptions, setGuaranteeErrorOptions] = useState([
    { value: "Nứt, vỡ, gãy", label: "Nứt, vỡ, gãy" },
    { value: "Lỗi gỗ, mối mọt", label: "Lỗi gỗ, mối mọt" },
    { value: "Sơn bị bong tróc", label: "Sơn bị bong tróc" },
    { value: "Kệ, bản lề bị hỏng", label: "Kệ, bản lề bị hỏng" },
    {
      value: "other",
      label: "Khác (vui lòng mô tả chi tiết trong phần mô tả)",
    },
  ]);

  // In the future, this useEffect will fetch error options by woodworkerId
  useEffect(() => {
    // Future API call would go here
    // Example:
    // if (woodworkerId) {
    //   fetchGuaranteeErrorTypes(woodworkerId).then(data => {
    //     setGuaranteeErrorOptions(data);
    //   });
    // }
  }, [woodworkerId]);

  return (
    <FormControl isRequired={isRequired} mb={4}>
      <FormLabel>Loại lỗi bảo hành:</FormLabel>
      <Select
        value={guaranteeError}
        onChange={(e) => setGuaranteeError(e.target.value)}
        placeholder="Chọn loại lỗi"
      >
        {guaranteeErrorOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <FormHelperText>
        Sản phẩm của bạn còn trong thời hạn bảo hành
      </FormHelperText>
    </FormControl>
  );
}
