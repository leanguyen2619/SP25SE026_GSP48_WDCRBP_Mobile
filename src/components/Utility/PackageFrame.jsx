import React from "react";
import { View, StyleSheet } from "react-native";

export default function PackageFrame({ children, packageType }) {
  const colors = {
    Bronze: {
      displayText: "Xưởng Đồng",
      displayTextColor: "#7B341E",
      displayBgColor: "#FFE8D1",
      border: "#CD7F32",
      glow: "rgba(205, 127, 50, 0.5)",
    },
    Silver: {
      displayText: "Xưởng Bạc",
      displayTextColor: "#374151",
      displayBgColor: "#fff",
      border: "#6B7280",
      glow: "rgba(107, 114, 128, 0.5)",
    },
    Gold: {
      displayText: "Xưởng Vàng",
      displayTextColor: "#78350F",
      displayBgColor: "#FFF9C4",
      border: "#FFD700",
      glow: "rgba(255, 215, 0, 0.5)",
    },
  };

  if (!packageType) {
    return children;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.frame,
          {
            borderColor: colors[packageType]?.border,
            shadowColor: colors[packageType]?.glow,
          },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 2,
  },
  frame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  content: {
    position: "relative",
    borderRadius: 8,
    zIndex: 1,
  },
});
