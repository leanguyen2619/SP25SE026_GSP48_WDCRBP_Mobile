import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColorTheme } from "../../../../config/appconfig";
import ImageUpload from "../../../../components/Utility/ImageUpload";
import { formatPrice } from "../../../../utils/utils";
import { useAddDesignIdeaMutation } from "../../../../services/designIdeaApi";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import useAuth from "../../../../hooks/useAuth";
import CategorySelector from "../../../../components/Utility/CategorySelector";
import { validateDesignData } from "../../../../validations";

export default function DesignCreateModal({ refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [configurations, setConfigurations] = useState([
    {
      id: 1,
      name: "Kích thước (dài x rộng x cao cm)",
      values: [],
    },
  ]);
  const [prices, setPrices] = useState([]);
  const [imgUrls, setImgUrls] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [categoryId, setCategoryId] = useState(null);
  const [isInstall, setIsInstall] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const notify = useNotify();
  const { auth } = useAuth();

  const [addDesignIdea, { isLoading }] = useAddDesignIdeaMutation();

  const handleAddConfig = () => {
    const newConfigId = configurations.length + 1;
    setConfigurations([
      ...configurations,
      {
        id: newConfigId,
        name: "",
        values: [],
      },
    ]);
  };

  const handleAddValue = (configId) => {
    const configIndex = configurations.findIndex((c) => c.id == configId);
    if (configIndex === -1) return;

    const newValueId =
      configId * 100 + (configurations[configIndex].values.length + 1);
    const newConfigurations = [...configurations];
    newConfigurations[configIndex].values.push({
      id: newValueId,
      name: "",
    });
    setConfigurations(newConfigurations);
    updatePrices(newConfigurations);
  };

  const handleConfigChange = (configId, field, value) => {
    const configIndex = configurations.findIndex((c) => c.id == configId);
    if (configIndex === -1) return;

    const newConfigurations = [...configurations];
    newConfigurations[configIndex][field] = value;
    setConfigurations(newConfigurations);
  };

  const handleValueChange = (configId, valueId, value) => {
    const configIndex = configurations.findIndex((c) => c.id == configId);
    if (configIndex === -1) return;

    const valueIndex = configurations[configIndex].values.findIndex(
      (v) => v.id == valueId
    );
    if (valueIndex === -1) return;

    const newConfigurations = [...configurations];
    newConfigurations[configIndex].values[valueIndex].name = value;
    setConfigurations(newConfigurations);
  };

  const handleRemoveConfig = (configId) => {
    setConfigurations(configurations.filter((c) => c.id != configId));
    updatePrices(configurations.filter((c) => c.id != configId));
  };

  const handleRemoveValue = (configId, valueId) => {
    const configIndex = configurations.findIndex((c) => c.id == configId);
    if (configIndex === -1) return;

    const newConfigurations = [...configurations];
    newConfigurations[configIndex].values = newConfigurations[
      configIndex
    ].values.filter((v) => v.id != valueId);
    setConfigurations(newConfigurations);
    updatePrices(newConfigurations);
  };

  const updatePrices = (configs) => {
    // Tạo tất cả các tổ hợp có thể có của các giá trị cấu hình
    const combinations = generateCombinations(configs);
    const newPrices = combinations.map((combo) => {
      const existingPrice = prices.find(
        (p) =>
          JSON.stringify(p.config) == JSON.stringify(combo.config) &&
          JSON.stringify(p.configValue) == JSON.stringify(combo.configValue)
      );
      return (
        existingPrice || {
          config: combo.config,
          configValue: combo.configValue,
          price: 0,
        }
      );
    });
    setPrices(newPrices);
  };

  const generateCombinations = (configs) => {
    if (configs.length === 0) return [];

    const result = [];
    const configIds = configs.map((c) => c.id);
    const valueIds = configs.map((c) => c.values.map((v) => v.id));

    function generate(current, index) {
      if (index === configs.length) {
        result.push({
          config: [...configIds],
          configValue: [...current],
        });
        return;
      }

      for (const valueId of valueIds[index]) {
        current.push(valueId);
        generate(current, index + 1);
        current.pop();
      }
    }

    generate([], 0);
    return result;
  };

  const handlePriceChange = (config, configValue, price) => {
    const priceIndex = prices.findIndex(
      (p) =>
        JSON.stringify(p.config) == JSON.stringify(config) &&
        JSON.stringify(p.configValue) == JSON.stringify(configValue)
    );
    if (priceIndex === -1) return;

    const newPrices = [...prices];
    newPrices[priceIndex].price = price;
    setPrices(newPrices);
  };

  const handleSubmit = async () => {
    const data = {
      woodworkerId: auth?.wwId,
      name: formData.name,
      img: imgUrls,
      categoryId: +categoryId,
      description: formData.description,
      configurations,
      prices,
      isInstall: isInstall,
    };

    // Validate data before submission
    const validationErrors = validateDesignData(data);
    if (validationErrors.length > 0) {
      notify("Vui lòng kiểm tra", validationErrors.join("\n"), "error");
      return;
    }

    try {
      await addDesignIdea(data).unwrap();
      notify("Thêm thiết kế thành công");

      // Reset form
      setConfigurations([]);
      setPrices([]);
      setImgUrls([]);

      refetch?.();
      setIsOpen(false);
    } catch (error) {
      notify(
        "Thêm thiết kế thất bại",
        error.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    if (!isLoading) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.addButton} onPress={openModal}>
        <Ionicons name="add" size={16} color={appColorTheme.green_0} />
        <Text style={styles.addButtonText}>Thêm thiết kế mới</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide" onRequestClose={closeModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Thêm thiết kế mới</Text>
            {!isLoading && (
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tên thiết kế *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên thiết kế"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Hình ảnh *</Text>
                <ImageUpload
                  maxFiles={4}
                  onUploadComplete={(result) => {
                    setImgUrls(result);
                  }}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Danh mục *</Text>
                <CategorySelector setCategoryId={setCategoryId} />
              </View>

              <View style={styles.switchContainer}>
                <Switch
                  value={isInstall}
                  onValueChange={setIsInstall}
                  trackColor={{ false: "#767577", true: appColorTheme.green_0 }}
                  thumbColor={isInstall ? "#ffffff" : "#f4f3f4"}
                />
                <Text style={styles.switchLabel}>
                  Cần giao hàng + lắp đặt bởi xưởng
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Mô tả *</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Nhập mô tả"
                  multiline
                  numberOfLines={5}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.configHeaderRow}>
                  <Text style={styles.sectionTitle}>Cấu hình sản phẩm</Text>
                  <TouchableOpacity
                    style={styles.addConfigButton}
                    onPress={handleAddConfig}
                  >
                    <Ionicons name="add" size={16} color="white" />
                    <Text style={styles.addConfigButtonText}>
                      Thêm cấu hình
                    </Text>
                  </TouchableOpacity>
                </View>

                {configurations.map((config) => (
                  <View key={config.id} style={styles.configCard}>
                    <View style={styles.configHeader}>
                      <View style={styles.configNameContainer}>
                        <Text style={styles.label}>Tên cấu hình *</Text>
                        <TextInput
                          style={styles.input}
                          value={config.name}
                          onChangeText={(text) =>
                            handleConfigChange(config.id, "name", text)
                          }
                          placeholder="Nhập tên cấu hình"
                        />
                      </View>
                      {config.name !== "Kích thước (dài x rộng x cao cm)" && (
                        <TouchableOpacity
                          style={styles.removeConfigButton}
                          onPress={() => handleRemoveConfig(config.id)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={24}
                            color={appColorTheme.red_0}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.valuesContainer}>
                      <Text style={styles.label}>Giá trị *</Text>
                      {config.values.map((value) => (
                        <View key={value.id} style={styles.valueRow}>
                          <TextInput
                            style={[styles.input, styles.valueInput]}
                            value={value.name}
                            onChangeText={(text) =>
                              handleValueChange(config.id, value.id, text)
                            }
                            placeholder="Nhập giá trị"
                          />
                          <TouchableOpacity
                            style={styles.removeValueButton}
                            onPress={() =>
                              handleRemoveValue(config.id, value.id)
                            }
                          >
                            <Ionicons
                              name="trash"
                              size={20}
                              color={appColorTheme.red_0}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                      <TouchableOpacity
                        style={styles.addValueButton}
                        onPress={() => handleAddValue(config.id)}
                      >
                        <Ionicons
                          name="add"
                          size={16}
                          color={appColorTheme.brown_2}
                        />
                        <Text style={styles.addValueButtonText}>
                          Thêm giá trị
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              <Text style={styles.noteText}>
                * Lưu ý: Hãy tính phần tiền giao hàng + lắp đặt vào trong giá
                của sản phẩm
              </Text>

              {prices.length > 0 && (
                <View style={styles.formGroup}>
                  <Text style={styles.sectionTitle}>
                    Bảng giá theo cấu hình
                  </Text>
                  {prices.map((price, index) => (
                    <View key={index} style={styles.priceCard}>
                      <View style={styles.priceConfigSection}>
                        {price.configValue.map((valueId) => {
                          const configId = Math.floor(valueId / 100);
                          const config = configurations.find(
                            (c) => c.id == configId
                          );
                          const value = config?.values.find(
                            (v) => v.id == valueId
                          );
                          return (
                            <View style={styles.priceConfigRow} key={valueId}>
                              <Text style={styles.priceConfigName}>
                                {config?.name}:
                              </Text>
                              <Text style={styles.priceConfigValue}>
                                {value?.name}
                              </Text>
                            </View>
                          );
                        })}
                      </View>

                      <View style={styles.priceInputSection}>
                        <Text style={styles.currentPrice}>
                          {formatPrice(price.price)}
                        </Text>
                        <TextInput
                          style={styles.priceInput}
                          keyboardType="numeric"
                          value={String(price.price)}
                          onChangeText={(value) =>
                            handlePriceChange(
                              price.config,
                              price.configValue,
                              parseInt(value) || 0
                            )
                          }
                          placeholder="Nhập giá"
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.checkboxSection}>
                <CheckboxList
                  items={[
                    {
                      isOptional: false,
                      description:
                        "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                    },
                  ]}
                  setButtonDisabled={setButtonDisabled}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={closeModal}
                  disabled={isLoading}
                >
                  <Ionicons name="close" size={18} color="#000" />
                  <Text style={styles.cancelButtonText}>Đóng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.saveButton,
                    (buttonDisabled || isLoading) && styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={buttonDisabled || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons name="save" size={18} color="white" />
                      <Text style={styles.saveButtonText}>Lưu</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: appColorTheme.green_0,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: appColorTheme.green_0,
    marginLeft: 5,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 15,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    marginLeft: 10,
    fontWeight: "500",
  },
  configHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addConfigButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColorTheme.brown_2,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addConfigButtonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 14,
  },
  configCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  configHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  configNameContainer: {
    flex: 1,
  },
  removeConfigButton: {
    padding: 5,
  },
  valuesContainer: {
    marginTop: 10,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  valueInput: {
    flex: 1,
    marginRight: 10,
  },
  removeValueButton: {
    padding: 5,
  },
  addValueButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  addValueButtonText: {
    color: appColorTheme.brown_2,
    marginLeft: 5,
    fontSize: 14,
  },
  noteText: {
    fontStyle: "italic",
    marginBottom: 20,
  },
  priceCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  priceConfigSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
    marginBottom: 10,
  },
  priceConfigRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  priceConfigName: {
    flex: 1,
  },
  priceConfigValue: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  priceInputSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currentPrice: {
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontSize: 16,
  },
  priceInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    width: 120,
  },
  checkboxSection: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    minWidth: 100,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  cancelButtonText: {
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: "#2196F3",
  },
  saveButtonText: {
    color: "white",
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
