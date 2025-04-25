import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ActionButton({
  text,
  onClickExeFn,
  bgColor = "app_brown.0",
  textColor = "black",
  hoverBgColor = "app_brown.1",
  hoverTextColor = "white",
}) {
  const [isPressed, setIsPressed] = useState(false);

  // Convert Chakra UI color names to actual colors used in app
  const getColor = (colorName) => {
    const colorMap = {
      "app_brown.0": "#F4EBE2",
      "app_brown.1": "#DEC0A7",
      "app_brown.2": "#B78C68",
      black: "#000000",
      white: "#FFFFFF",
    };
    return colorMap[colorName] || colorName;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isPressed
            ? getColor(hoverBgColor)
            : getColor(bgColor),
          borderRadius: 40,
          marginTop: 40,
          marginBottom: 20,
          zIndex: 1,
        },
      ]}
      onPress={onClickExeFn}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          { color: isPressed ? getColor(hoverTextColor) : getColor(textColor) },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
  },
});
