import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
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
    return <ActivityIndicator size="small" color="#3182CE" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Loại lỗi bảo hành:{" "}
        {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={guaranteeError}
          onValueChange={(itemValue) => setGuaranteeError(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn loại lỗi" value="" />
          {guaranteeErrorOptions.length > 0 ? (
            guaranteeErrorOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))
          ) : (
            <Picker.Item
              label="Vui lòng mô tả lỗi trong phần mô tả"
              value="other"
            />
          )}
        </Picker>
      </View>
      <Text style={styles.helperText}>
        Sản phẩm của bạn còn trong thời hạn bảo hành
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  required: {
    color: "#E53E3E",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    marginBottom: 4,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  helperText: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
});
