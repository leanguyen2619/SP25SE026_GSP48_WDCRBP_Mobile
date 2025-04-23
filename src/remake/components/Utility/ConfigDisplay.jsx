import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ConfigDisplay({
  config,
  compact = true,
  color = "#1A202C", // gray.900 tương đương
}) {
  if (!config || !Array.isArray(config) || config.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {config.map((configItem, index) => {
          const value = configItem.designVariantValues[0];
          return (
            <View key={index} style={styles.compactItem}>
              <Text style={styles.labelText}>
                {value.designIdeaConfig.specifications}: {value.value}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  // Standard display (like in cart details)
  return (
    <View style={styles.standardContainer}>
      {config.map((configItem, index) => {
        const value = configItem.designVariantValues[0];
        return (
          <View key={index} style={styles.standardRow}>
            <Text style={styles.labelText}>
              {value.designIdeaConfig.specifications}: {value.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 4,
  },
  compactItem: {
    backgroundColor: "#F7FAFC", // gray.100 tương đương
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: "row",
  },
  labelText: {
    fontSize: 12,
    fontWeight: "500",
  },
  valueText: {
    fontSize: 12,
  },
  standardContainer: {
    marginTop: 4,
  },
  standardRow: {
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "center",
  },
  standardLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  standardValue: {
    fontSize: 14,
  },
});
