import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { appColorTheme } from "../../../../../../config/appconfig";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import CategorySearchCombobox from "../../../../../../components/Utility/CategorySearchCombobox";

const { width, height } = Dimensions.get("window");

export default function FiltersComponent({ visible, onClose, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState({
    ratingRange: [0, 5],
    sortBy: "",
    searchTerm: "",
    categoryId: null,
    applyFilters: true,
    applySearch: true,
  });

  const [expandedSections, setExpandedSections] = useState({
    rating: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange?.(localFilters);
    onClose?.();
  };

  const setCategoryId = (categoryId) => {
    handleLocalFilterChange("categoryId", categoryId);
  };

  const resetFilters = () => {
    setLocalFilters({
      ratingRange: [0, 5],
      sortBy: "",
      searchTerm: "",
      categoryId: null,
      applyFilters: true,
      applySearch: true,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bộ lọc thiết kế</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#4A5568" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Danh mục */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Danh mục</Text>
              <CategorySearchCombobox setCategoryId={setCategoryId} />
            </View>

            {/* Đánh giá sao */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleSection("rating")}
            >
              <Text style={styles.accordionTitle}>Lọc theo số sao</Text>
              <Ionicons
                name={expandedSections.rating ? "chevron-up" : "chevron-down"}
                size={20}
                color="#4A5568"
              />
            </TouchableOpacity>

            {expandedSections.rating && (
              <View style={styles.accordionContent}>
                <View style={styles.ratingRangeContainer}>
                  <Text style={styles.rangeText}>Sao tối thiểu:</Text>
                  <Text style={styles.rangeValue}>
                    ⭐ {localFilters.ratingRange[0].toFixed(1)}
                  </Text>
                </View>
                <Slider
                  minimumValue={0}
                  maximumValue={5}
                  step={0.1}
                  value={localFilters.ratingRange[0]}
                  onValueChange={(value) =>
                    handleLocalFilterChange("ratingRange", [
                      value,
                      Math.max(value, localFilters.ratingRange[1]),
                    ])
                  }
                  minimumTrackTintColor={appColorTheme.brown_2}
                  maximumTrackTintColor="#E2E8F0"
                  thumbTintColor={appColorTheme.brown_0}
                />

                <View style={styles.ratingRangeContainer}>
                  <Text style={styles.rangeText}>Sao tối đa:</Text>
                  <Text style={styles.rangeValue}>
                    ⭐ {localFilters.ratingRange[1].toFixed(1)}
                  </Text>
                </View>
                <Slider
                  minimumValue={0}
                  maximumValue={5}
                  step={0.1}
                  value={localFilters.ratingRange[1]}
                  onValueChange={(value) =>
                    handleLocalFilterChange("ratingRange", [
                      Math.min(localFilters.ratingRange[0], value),
                      value,
                    ])
                  }
                  minimumTrackTintColor={appColorTheme.brown_2}
                  maximumTrackTintColor="#E2E8F0"
                  thumbTintColor={appColorTheme.brown_0}
                />
              </View>
            )}

            {/* Sắp xếp */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sắp xếp theo</Text>
              <Picker
                selectedValue={localFilters.sortBy}
                onValueChange={(value) =>
                  handleLocalFilterChange("sortBy", value)
                }
                style={styles.picker}
              >
                <Picker.Item label="Chọn cách sắp xếp" value="" />
                <Picker.Item label="Đề xuất" value="rating-desc" />
                <Picker.Item label="Số sao: Tăng dần" value="rating-asc" />
                <Picker.Item label="Số sao: Giảm dần" value="rating-desc" />
                <Picker.Item label="Tên: A-Z" value="name-asc" />
                <Picker.Item label="Tên: Z-A" value="name-desc" />
              </Picker>
            </View>

            {/* Tìm kiếm */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tìm kiếm thiết kế</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập tên thiết kế"
                value={localFilters.searchTerm}
                onChangeText={(text) =>
                  handleLocalFilterChange("searchTerm", text)
                }
              />
            </View>

            {/* Switches */}
            <View style={styles.section}>
              <View style={styles.switchContainer}>
                <Text>Áp dụng bộ lọc</Text>
                <Switch
                  value={localFilters.applyFilters}
                  onValueChange={(value) =>
                    handleLocalFilterChange("applyFilters", value)
                  }
                  trackColor={{ false: "#CBD5E0", true: appColorTheme.brown_1 }}
                  thumbColor={
                    localFilters.applyFilters
                      ? appColorTheme.brown_2
                      : "#F7FAFC"
                  }
                />
              </View>

              <View style={styles.switchContainer}>
                <Text>Áp dụng từ khóa</Text>
                <Switch
                  value={localFilters.applySearch}
                  onValueChange={(value) =>
                    handleLocalFilterChange("applySearch", value)
                  }
                  trackColor={{ false: "#CBD5E0", true: appColorTheme.brown_1 }}
                  thumbColor={
                    localFilters.applySearch ? appColorTheme.brown_2 : "#F7FAFC"
                  }
                />
              </View>
            </View>
          </ScrollView>

          {/* Button footer */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Ionicons
                name="filter"
                size={20}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    maxHeight: height * 0.9,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: height * 0.65,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  accordionContent: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  picker: {
    backgroundColor: "white",
    marginVertical: 8,
  },
  ratingRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  rangeText: {
    fontSize: 14,
  },
  rangeValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#EDF2F7",
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#4A5568",
    fontWeight: "600",
  },
  applyButton: {
    flex: 2,
    backgroundColor: appColorTheme.brown_2,
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
});
