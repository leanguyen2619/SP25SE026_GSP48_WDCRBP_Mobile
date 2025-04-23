import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../config/appconfig";

export default function CheckboxList({ items, setButtonDisabled }) {
  const [checkedItems, setCheckedItems] = useState(items.map(() => false));

  useEffect(() => {
    const allRequiredChecked = items.every(
      (item, index) => item.isOptional || checkedItems[index]
    );

    setButtonDisabled(!allRequiredChecked);
  }, [checkedItems, items, setButtonDisabled]);

  const handleCheck = (index) => {
    setCheckedItems((prev) => {
      const newCheckedItems = [...prev];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận thông tin</Text>

      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.checkboxContainer}
          onPress={() => handleCheck(index)}
          activeOpacity={0.7}
        >
          <View
            style={[styles.checkbox, checkedItems[index] && styles.checkedBox]}
          >
            {checkedItems[index] && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>

          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.checkboxLabel,
                item.isOptional && styles.optionalLabel,
              ]}
            >
              {item.description}
              {item.isOptional && (
                <Text style={styles.optionalText}> (Tùy chọn)</Text>
              )}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: appColorTheme.brown_2,
    borderColor: appColorTheme.brown_2,
  },
  labelContainer: {
    flex: 1,
    marginLeft: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000",
  },
  optionalLabel: {
    color: "#718096",
  },
  optionalText: {
    fontSize: 14,
    color: "#718096",
  },
});
