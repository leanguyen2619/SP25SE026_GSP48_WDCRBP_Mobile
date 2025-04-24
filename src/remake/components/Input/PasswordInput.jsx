import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import Icon from "react-native-vector-icons/Feather";

export default function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder,
  isRequired = false,
  style = {},
  marginBottom = 0,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, { marginBottom }]}>
      {label && (
        <Text style={styles.label}>
          {label} {isRequired && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={!showPassword}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#718096"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  required: {
    color: "red",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  iconButton: {
    padding: 10,
  },
});
