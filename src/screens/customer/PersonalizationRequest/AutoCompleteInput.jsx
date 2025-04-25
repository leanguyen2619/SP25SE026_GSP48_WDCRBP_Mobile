import React, { useState } from "react";
import { Box, Input, List, ListItem, useOutsideClick } from "@chakra-ui/react";

export default function AutoCompleteInput({
  options = [],
  value = "",
  onChange,
  placeholder = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const ref = React.useRef();

  // Close dropdown when clicking outside
  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false),
  });

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Filter options based on input
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsOpen(true);

    // Pass value to parent
    onChange(newValue);
  };

  // Handle option selection
  const handleSelect = (option) => {
    setInputValue(option);
    setIsOpen(false);
    onChange(option);
  };

  return (
    <Box position="relative" ref={ref}>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
      />

      {isOpen && filteredOptions.length > 0 && (
        <List
          position="absolute"
          bg="white"
          width="100%"
          borderWidth="1px"
          borderRadius="md"
          mt="2px"
          zIndex={10}
          maxH="200px"
          overflowY="auto"
          boxShadow="md"
        >
          {filteredOptions.map((option, index) => (
            <ListItem
              key={index}
              px={4}
              py={2}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={() => handleSelect(option)}
            >
              {option}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
