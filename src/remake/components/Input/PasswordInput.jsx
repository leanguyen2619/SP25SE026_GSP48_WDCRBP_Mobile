import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function PasswordInput({
  label,
  name,
  placeholder,
  isRequired = false,
  variant = "flushed",
  mb = "0",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isRequired={isRequired} mb={mb}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        <Input
          variant={variant}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          name={name}
        />
        <InputRightElement>
          <IconButton
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
            onClick={() => setShowPassword(!showPassword)}
            variant="ghost"
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}
