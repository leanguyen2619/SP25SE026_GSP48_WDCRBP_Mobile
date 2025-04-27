import React, { useRef, useState, useEffect } from "react";
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
import { formatPrice } from "../../../../utils/utils";
import ImageUpdateUploader from "../../../../components/Utility/ImageUpdateUploader";
import {
  useUpdateDesignIdeaMutation,
  useGetDesignIdeaVariantQuery,
} from "../../../../services/designIdeaApi";
import { useNotify } from "../../../../components/Utility/Notify";
import CheckboxList from "../../../../components/Utility/CheckboxList";

export default function DesignUpdateModal({ design, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgUrls, setImgUrls] = useState(design?.img_urls || "");
  const [isInstall, setIsInstall] = useState(design?.isInstall || false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [formData, setFormData] = useState({
    name: design?.name || "",
    description: design?.description || "",
  });
  const notify = useNotify();

  const [updateDesignIdea, { isLoading }] = useUpdateDesignIdeaMutation();

  // Fetch variant data when modal opens
  const { data: variantData, isLoading: isVariantLoading } =
    useGetDesignIdeaVariantQuery(design?.designIdeaId, {
      skip: !isOpen || !design?.designIdeaId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const variants = variantData?.data || [];

  // Track variant prices to update
  const [variantPrices, setVariantPrices] = useState([]);

  useEffect(() => {
    if (isOpen && design) {
      // Initialize with actual data once the modal is opened and variants loaded
      setIsInstall(design?.isInstall || false);
      setImgUrls(design?.img_urls || "");
      setFormData({
        name: design?.name || "",
        description: design?.description || "",
      });

      // Initialize variant prices from fetched data
      if (variants.length > 0) {
        const initialPrices = variants.map((variant) => ({
          designIdeaVariantId: variant.designIdeaVariantId,
          price: variant.price,
        }));
        setVariantPrices(initialPrices);
      }
    }
  }, [isOpen, design, variants]);

  const handlePriceChange = (variantId, newPrice) => {
    setVariantPrices((prev) =>
      prev.map((item) =>
        item.designIdeaVariantId === variantId
          ? { ...item, price: newPrice }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    // Format data according to the API's expected structure
    const data = {
      designIdeaId: design.designIdeaId,
      name: formData.name,
      img: imgUrls,
      description: formData.description,
      isInstall: isInstall,
      prices: variantPrices,
    };

    try {
      await updateDesignIdea(data).unwrap();
      notify("Cập nhật thiết kế thành công");
      refetch?.();
      closeModal();
    } catch (error) {
      notify(
        "Cập nhật thiết kế thất bại",
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
      <TouchableOpacity style={styles.iconButton} onPress={openModal}>
        <Ionicons
          name="create-outline"
          size={18}
          color={appColorTheme.blue_0}
        />
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide" onRequestClose={closeModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chỉnh sửa thiết kế</Text>
            {!isLoading && (
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.scrollView}>
            {isVariantLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={appColorTheme.brown_2} />
                <Text style={styles.loadingText}>
                  Đang tải dữ liệu thiết kế...
                </Text>
              </View>
            ) : (
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

                <View style={styles.switchContainer}>
                  <Switch
                    value={isInstall}
                    onValueChange={setIsInstall}
                    trackColor={{
                      false: "#767577",
                      true: appColorTheme.green_0,
                    }}
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

                {variants.length > 0 && (
                  <View style={styles.formGroup}>
                    <Text style={styles.sectionTitle}>
                      Bảng giá theo cấu hình
                    </Text>
                    {variants.map((variant) => (
                      <View
                        key={variant.designIdeaVariantId}
                        style={styles.priceCard}
                      >
                        <View style={styles.priceConfigSection}>
                          <Text style={styles.variantIdText}>
                            Mã biến thể: {variant.designIdeaVariantId}
                          </Text>

                          {variant.designIdeaVariantConfig.map((config) =>
                            config.designVariantValues.map((value) => (
                              <View
                                style={styles.configRow}
                                key={value.designIdeaConfigValueId}
                              >
                                <Text style={styles.configName}>
                                  {value.designIdeaConfig.specifications}:
                                </Text>
                                <Text style={styles.configValue}>
                                  {value.value}
                                </Text>
                              </View>
                            ))
                          )}
                        </View>

                        <View style={styles.priceInputSection}>
                          <Text style={styles.currentPrice}>
                            {formatPrice(
                              variantPrices.find(
                                (p) =>
                                  p.designIdeaVariantId ===
                                  variant.designIdeaVariantId
                              )?.price || variant.price
                            )}
                          </Text>

                          <TextInput
                            style={styles.priceInput}
                            keyboardType="numeric"
                            value={String(
                              variantPrices.find(
                                (p) =>
                                  p.designIdeaVariantId ===
                                  variant.designIdeaVariantId
                              )?.price || variant.price
                            )}
                            onChangeText={(value) =>
                              handlePriceChange(
                                variant.designIdeaVariantId,
                                parseInt(value) || 0
                              )
                            }
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
                      <Text style={styles.saveButtonText}>Lưu</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: appColorTheme.blue_0,
    borderRadius: 4,
    marginHorizontal: 4,
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
  loadingContainer: {
    padding: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
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
  variantIdText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  configRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  configName: {
    flex: 1,
  },
  configValue: {
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
    alignItems: "center",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  cancelButtonText: {
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: appColorTheme.blue_0,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
