// DesignConfirmModal.native.js

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { useAcceptServiceOrderMutation } from "../../../../../../services/serviceOrderApi";
import { useNotify } from "../../../../../../components/Utility/Notify";
import CheckboxList from "../../../../../../components/Utility/CheckboxList";
import ImageListSelector from "../../../../../../components/Utility/ImageListSelector";

export default function DesignConfirmModal({
  serviceOrderId,
  products = [],
  buttonText = "Xác nhận thiết kế",
  refetch,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const notify = useNotify();
  const [acceptOrder, { isLoading }] = useAcceptServiceOrderMutation();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);

  // manage which accordion items are open
  const [expandedItems, setExpandedItems] = useState([]);

  const checkboxItems = [
    {
      description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
      isOptional: false,
    },
  ];

  // Filter products that actually have designs
  const productsWithDesigns = products.filter(
    (p) =>
      p.personalProductDetail?.designUrls &&
      p.personalProductDetail.designUrls.trim() !== ""
  );

  const onOpen = () => setIsOpen(true);
  const onClose = () => !isLoading && setIsOpen(false);

  const toggleExpand = (id) =>
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = async () => {
    try {
      await acceptOrder({ serviceOrderId }).unwrap();
      notify("Xác nhận thành công", "Thiết kế đã được xác nhận", "success");
      onClose();
      refetch();
    } catch (err) {
      notify(
        "Xác nhận thất bại",
        err?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.openButton} onPress={onOpen}>
        <Feather name="check-circle" size={20} color="#fff" />
        <Text style={styles.openButtonText}>{buttonText}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{buttonText}</Text>
              {!isLoading && (
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} />
                </TouchableOpacity>
              )}
            </View>

            {/* Body */}
            <ScrollView style={styles.modalBody}>
              <Text style={styles.heading}>Thiết kế sản phẩm</Text>

              {productsWithDesigns.length > 0 ? (
                productsWithDesigns.map((prod) => (
                  <View
                    key={prod.requestedProductId}
                    style={styles.accordionItem}
                  >
                    <TouchableOpacity
                      style={styles.accordionHeader}
                      onPress={() => toggleExpand(prod.requestedProductId)}
                    >
                      <Text style={styles.accordionHeaderText}>
                        Sản phẩm {prod.category?.categoryName}
                      </Text>
                      <Feather
                        name={
                          expandedItems.includes(prod.requestedProductId)
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={20}
                      />
                    </TouchableOpacity>

                    {expandedItems.includes(prod.requestedProductId) && (
                      <View style={styles.accordionPanel}>
                        <Text style={styles.text}>
                          Số lượng: {prod.quantity}
                        </Text>
                        <View style={styles.imageListContainer}>
                          <ImageListSelector
                            imgUrls={prod.personalProductDetail.designUrls}
                            imgH={300}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.noDesignContainer}>
                  <Text>Không có thiết kế nào để xác nhận.</Text>
                </View>
              )}

              <CheckboxList
                items={checkboxItems}
                setButtonDisabled={setIsCheckboxDisabled}
              />
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Feather name="x-circle" size={18} />
                <Text style={styles.cancelButtonText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.confirmButton,
                  (isCheckboxDisabled || productsWithDesigns.length === 0) &&
                    styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={
                  isCheckboxDisabled ||
                  productsWithDesigns.length === 0 ||
                  isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Feather name="check" size={18} color="#fff" />
                )}
                <Text style={styles.confirmButtonText}>Xác nhận thiết kế</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 4,
  },
  openButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  accordionItem: {
    marginBottom: 8,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
  },
  accordionHeaderText: {
    fontWeight: "bold",
  },
  accordionPanel: {
    padding: 12,
  },
  text: {
    marginBottom: 8,
  },
  imageListContainer: {
    marginTop: 8,
  },
  noDesignContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginLeft: 8,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  cancelButtonText: {
    marginLeft: 4,
  },
  confirmButton: {
    backgroundColor: "green",
  },
  confirmButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
