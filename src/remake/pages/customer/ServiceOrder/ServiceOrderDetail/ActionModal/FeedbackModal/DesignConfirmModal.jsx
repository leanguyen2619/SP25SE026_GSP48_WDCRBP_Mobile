import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useConfirmDesignMutation } from "../../../../../../services/serviceOrderApi";
import { useGetDesignsAreNotConfirmedQuery } from "../../../../../../services/designApi";
import { useNotify } from "../../../../../../components/Utility/Notify";

// Custom Checkbox component
const CustomCheckbox = ({ checked, onChange, label }) => (
  <TouchableOpacity 
    style={styles.checkbox} 
    onPress={() => onChange(!checked)}
    activeOpacity={0.7}
  >
    <View style={[
      styles.checkboxBox,
      checked && styles.checkboxBoxChecked
    ]}>
      {checked && <Ionicons name="checkmark" size={16} color="white" />}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

// Accordion Item component
const AccordionItem = ({ product, designIds, setDesignIds }) => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  const handleCheckboxChange = (designId, checked) => {
    if (checked) {
      setDesignIds([...designIds, designId]);
    } else {
      setDesignIds(designIds.filter(id => id !== designId));
    }
  };

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{product.productName}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#4A5568"
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.accordionBody}>
          {product.designs.map((design) => (
            <View key={design.id} style={styles.designItem}>
              <View style={styles.designHeader}>
                <Text style={styles.designTitle}>{design.designType}</Text>
              </View>
              
              <View style={styles.designImageContainer}>
                {design.image ? (
                  <Image 
                    source={{ uri: design.image }} 
                    style={styles.designImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.noImage}>
                    <Ionicons name="image-outline" size={32} color="#CBD5E0" />
                    <Text style={styles.noImageText}>Không có hình ảnh</Text>
                  </View>
                )}
              </View>
              
              <CustomCheckbox
                checked={designIds.includes(design.id)}
                onChange={(checked) => handleCheckboxChange(design.id, checked)}
                label="Tôi đồng ý với thiết kế này"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default function DesignConfirmModal({ serviceOrderId, refetch }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [designIds, setDesignIds] = useState([]);
  const [confirmDesign, { isLoading: isLoadingConfirm }] = useConfirmDesignMutation();
  const {
    data: designsData,
    isLoading: isLoadingDesigns,
  } = useGetDesignsAreNotConfirmedQuery(
    { serviceOrderId },
    { skip: !modalVisible }
  );
  const notify = useNotify();

  // Reset design IDs when modal closes or data changes
  useEffect(() => {
    if (!modalVisible || !designsData) {
      setDesignIds([]);
    }
  }, [modalVisible, designsData]);

  const handleSubmit = async () => {
    if (designIds.length === 0) {
      notify(
        "Không có thiết kế nào được chọn",
        "Vui lòng chọn ít nhất một thiết kế để xác nhận",
        "error"
      );
      return;
    }

    try {
      await confirmDesign({
        serviceOrderId,
        designIds,
      }).unwrap();
      notify("Thành công", "Đã xác nhận thiết kế thành công", "success");
      setModalVisible(false);
      if (refetch) refetch();
    } catch (error) {
      notify(
        "Xác nhận thiết kế thất bại",
        error.data?.message || "Không thể xác nhận thiết kế. Vui lòng thử lại sau.",
        "error"
      );
    }
  };

  const productsWithDesigns = designsData?.filter(
    (product) => product.designs.length > 0
  );

  const closeModal = () => {
    if (!isLoadingConfirm) {
      setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="checkmark-circle" size={20} color="white" />
        <Text style={styles.confirmButtonText}>Xác nhận thiết kế</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Xác nhận thiết kế</Text>
              {!isLoadingConfirm && (
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalBody}>
              {isLoadingDesigns ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4299E1" />
                  <Text style={styles.loadingText}>Đang tải thiết kế...</Text>
                </View>
              ) : productsWithDesigns && productsWithDesigns.length > 0 ? (
                <>
                  <Text style={styles.instructionText}>
                    Vui lòng xem xét các thiết kế dưới đây và đánh dấu vào ô bên cạnh để xác nhận. 
                    Sau khi xác nhận, chúng tôi sẽ tiến hành quy trình sản xuất.
                  </Text>
                  
                  <View style={styles.accordionContainer}>
                    {productsWithDesigns.map((product) => (
                      <AccordionItem
                        key={product.id}
                        product={product}
                        designIds={designIds}
                        setDesignIds={setDesignIds}
                      />
                    ))}
                  </View>
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="alert-circle-outline" size={48} color="#A0AEC0" />
                  <Text style={styles.emptyStateText}>Không có thiết kế nào cần xác nhận</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.closeButton]}
                onPress={closeModal}
                disabled={isLoadingConfirm}
              >
                <Ionicons name="close-circle" size={20} color="#333" />
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>

              {productsWithDesigns && productsWithDesigns.length > 0 && (
                <TouchableOpacity
                  style={[
                    styles.footerButton, 
                    styles.submitButton,
                    designIds.length === 0 && styles.disabledButton
                  ]}
                  onPress={handleSubmit}
                  disabled={isLoadingConfirm || designIds.length === 0}
                >
                  {isLoadingConfirm ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={20} color="white" />
                      <Text style={styles.submitButtonText}>Xác nhận</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4299E1",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    maxHeight: "85%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalBody: {
    padding: 16,
  },
  instructionText: {
    marginBottom: 16,
    color: "#4A5568",
    lineHeight: 20,
  },
  accordionContainer: {
    marginTop: 8,
  },
  accordionItem: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F7FAFC",
  },
  accordionTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#2D3748",
  },
  accordionBody: {
    padding: 12,
  },
  designItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
  },
  designHeader: {
    marginBottom: 12,
  },
  designTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  designImageContainer: {
    height: 200,
    backgroundColor: "#F7FAFC",
    borderRadius: 6,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  designImage: {
    width: "100%",
    height: "100%",
  },
  noImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    marginTop: 8,
    color: "#A0AEC0",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxChecked: {
    backgroundColor: "#4299E1",
    borderColor: "#4299E1",
  },
  checkboxLabel: {
    color: "#4A5568",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#4A5568",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    marginTop: 12,
    color: "#4A5568",
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: "#EDF2F7",
  },
  closeButtonText: {
    marginLeft: 4,
    color: "#1A202C",
  },
  submitButton: {
    backgroundColor: "#4299E1",
  },
  submitButtonText: {
    marginLeft: 4,
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
