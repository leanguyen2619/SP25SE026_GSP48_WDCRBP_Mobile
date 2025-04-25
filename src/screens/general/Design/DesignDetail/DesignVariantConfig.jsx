import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { appColorTheme } from "../../../../config/appconfig.js";
import { formatPrice } from "../../../../utils/utils.js";

export default function DesignVariantConfig({
  designVariants,
  design,
  onVariantSelect,
}) {
  // Transform the API data to structured format
  const getConfigurationsFromVariants = (variants) => {
    if (!variants || variants.length === 0) return [];

    // Extract unique config specifications
    const configMap = new Map();

    variants.forEach((variant) => {
      variant.designIdeaVariantConfig.forEach((config) => {
        const configValue = config.designVariantValues[0];
        const configSpec = configValue.designIdeaConfig;

        if (!configMap.has(configSpec.designIdeaConfigId)) {
          configMap.set(configSpec.designIdeaConfigId, {
            id: configSpec.designIdeaConfigId,
            name: configSpec.specifications,
            values: new Map(),
          });
        }

        const configEntry = configMap.get(configSpec.designIdeaConfigId);
        if (!configEntry.values.has(configValue.designIdeaConfigValueId)) {
          configEntry.values.set(configValue.designIdeaConfigValueId, {
            id: configValue.designIdeaConfigValueId,
            name: configValue.value,
          });
        }
      });
    });

    // Convert Maps to Arrays for easier rendering
    return Array.from(configMap.values()).map((config) => ({
      ...config,
      values: Array.from(config.values.values()),
    }));
  };

  // Transform price data from variants - updated to include variantId
  const getPricesFromVariants = (variants) => {
    if (!variants || variants.length === 0) return [];

    return variants.map((variant) => {
      const configValues = variant.designIdeaVariantConfig.map(
        (config) => config.designVariantValues[0].designIdeaConfigValueId
      );

      // Extract config IDs from the first variant to maintain consistency
      const configIds = variant.designIdeaVariantConfig.map(
        (config) =>
          config.designVariantValues[0].designIdeaConfig.designIdeaConfigId
      );

      return {
        config: configIds,
        configValue: configValues,
        price: variant.price,
        variantId: variant.designIdeaVariantId, // Add variant ID
      };
    });
  };

  // Create structured data from API response
  const configurations = getConfigurationsFromVariants(designVariants);
  const prices = getPricesFromVariants(designVariants);

  // State for selected values (initialize with first values if available)
  const [selectedValues, setSelectedValues] = useState(() => {
    if (configurations.length > 0) {
      return configurations
        .map((config) =>
          config.values.length > 0 ? config.values[0].id : null
        )
        .filter(Boolean);
    }
    return [];
  });

  // Update selected values if configurations change
  useEffect(() => {
    if (configurations.length > 0) {
      setSelectedValues(
        configurations
          .map((config) =>
            config.values.length > 0 ? config.values[0].id : null
          )
          .filter(Boolean)
      );
    }
  }, [designVariants]);

  // Find price and variant based on selected configuration
  const selectedVariantInfo = prices.find(
    (p) =>
      p.configValue.length === selectedValues.length &&
      p.configValue.every((value) => selectedValues.includes(value))
  );

  const selectedPrice = selectedVariantInfo?.price;

  // Find full variant object when selection changes
  useEffect(() => {
    if (selectedVariantInfo && designVariants) {
      // Find the full variant object that matches our selection
      const fullVariant = designVariants.find(
        (variant) =>
          variant.designIdeaVariantId === selectedVariantInfo.variantId
      );

      if (fullVariant && onVariantSelect) {
        onVariantSelect(fullVariant);
      }
    }
  }, [selectedValues, designVariants, selectedVariantInfo, onVariantSelect]);

  if (!configurations.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Không có thông tin cấu hình cho thiết kế này</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Cấu hình sản phẩm</Text>

      {configurations.map((config) => (
        <View key={config.id} style={styles.configSection}>
          <Text style={styles.configName}>{config.name}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.optionsContainer}
          >
            {config.values.map((value) => (
              <TouchableOpacity
                key={value.id}
                style={[
                  styles.optionButton,
                  selectedValues.includes(value.id) &&
                    styles.selectedOptionButton,
                ]}
                onPress={() => {
                  const updatedValues = [...selectedValues];
                  // Find if there's already a selection for this config type
                  const currentIndex = configurations.findIndex(
                    (c) => c.id === config.id
                  );
                  if (currentIndex !== -1) {
                    // Replace the old value with the new one
                    const oldValueIndex = updatedValues.findIndex((v) =>
                      configurations[currentIndex].values.some(
                        (val) => val.id === v
                      )
                    );
                    if (oldValueIndex !== -1) {
                      updatedValues[oldValueIndex] = value.id;
                    } else {
                      updatedValues.push(value.id);
                    }
                  }
                  setSelectedValues(updatedValues);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedValues.includes(value.id) &&
                      styles.selectedOptionText,
                  ]}
                >
                  {value.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}

      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>
          {selectedPrice ? `${formatPrice(selectedPrice)}` : "Không có giá"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 16,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
  configSection: {
    marginBottom: 16,
  },
  configName: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    marginRight: 8,
  },
  selectedOptionButton: {
    borderColor: appColorTheme.brown_2,
  },
  optionText: {
    fontWeight: "bold",
    color: "#000",
  },
  selectedOptionText: {
    color: appColorTheme.brown_2,
  },
  priceContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: appColorTheme.grey_0,
  },
  priceText: {
    fontSize: 24,
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
});
