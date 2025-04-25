import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from "react-native";

export default function AutoCompleteInput({
  options = [],
  value = "",
  onChange,
  placeholder = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle keyboard dismiss to close dropdown
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsOpen(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  // Update filtered options when options prop changes
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  // Handle input change
  const handleInputChange = (text) => {
    setInputValue(text);

    // Filter options based on input
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsOpen(true);

    // Pass value to parent
    onChange(text);
  };

  // Handle option selection
  const handleSelect = (option) => {
    setInputValue(option);
    setIsOpen(false);
    onChange(option);
    Keyboard.dismiss();
  };

  // Render option item
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleSelect(item)}
      key={index}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={handleInputChange}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
      />

      {isOpen && filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredOptions}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "white",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    maxHeight: 200,
    zIndex: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  list: {
    maxHeight: 200,
  },
  optionItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
});
