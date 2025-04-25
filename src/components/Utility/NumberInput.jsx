import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { appColorTheme } from "../../config/appconfig";

const NumberInput = ({
  value,
  onChangeText,
  placeholder = "Nhập số",
  label,
  min = 1,
  max = 999,
  style,
  errorText,
  isInvalid = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value || "");

  const handleChange = (text) => {
    // Loại bỏ các ký tự không phải số
    const numericValue = text.replace(/[^0-9]/g, "");

    // Lưu giá trị vào state nội bộ
    setLocalValue(numericValue);

    // Gọi hàm callback với giá trị mới
    onChangeText(numericValue);
  };

  const validateValue = () => {
    // Nếu giá trị rỗng thì đặt thành giá trị tối thiểu
    if (!localValue || localValue === "") {
      onChangeText(min.toString());
      setLocalValue(min.toString());
      return;
    }

    // Kiểm tra và điều chỉnh giá trị trong phạm vi min-max
    const numValue = parseInt(localValue);
    if (numValue < min) {
      onChangeText(min.toString());
      setLocalValue(min.toString());
    } else if (numValue > max) {
      onChangeText(max.toString());
      setLocalValue(max.toString());
    }
  };

  // Cập nhật localValue khi prop value thay đổi từ bên ngoài
  React.useEffect(() => {
    if (value !== undefined && !isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.focused,
          isInvalid && styles.invalid,
          style,
        ]}
        value={localValue?.toString()}
        onChangeText={handleChange}
        placeholder={placeholder}
        keyboardType="numeric"
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          validateValue();
        }}
      />
      {isInvalid && errorText && (
        <Text style={styles.errorText}>{errorText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: "100%",
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  focused: {
    borderColor: appColorTheme.brown_2,
  },
  invalid: {
    borderColor: "#E53E3E",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 14,
    marginTop: 4,
  },
});

export default NumberInput;
