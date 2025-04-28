import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { appColorTheme } from "../../../../config/appconfig";
import GuaranteeOrderList from "./GuaranteeOrderList";
import Icon from "react-native-vector-icons/Feather";
import {
  useGetWoodworkerByIdQuery,
  useUpdateWarrantyPolicyMutation,
} from "../../../../services/woodworkerApi";
import useAuth from "../../../../hooks/useAuth";
import { useNotify } from "../../../../components/Utility/Notify";
import WoodworkerLayout from "../../../../layouts/WoodworkerLayout";

export default function WWGuaranteeOrderListPage() {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const { auth } = useAuth();
  const woodworkerId = auth?.wwId;
  const notify = useNotify();

  const [warrantyPolicies, setWarrantyPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState("");
  const [policyError, setPolicyError] = useState("");
  const [totalLengthError, setTotalLengthError] = useState(false);

  const {
    data: woodworkerData,
    isLoading,
    refetch,
  } = useGetWoodworkerByIdQuery(woodworkerId);
  const [updateWarrantyPolicy, { isLoading: isUpdating }] =
    useUpdateWarrantyPolicyMutation();

  // Initialize warranty policies from woodworker data
  useEffect(() => {
    if (woodworkerData && woodworkerData?.data?.warrantyPolicy) {
      const policies = woodworkerData.data.warrantyPolicy
        .split(";")
        .map((policy) => policy.trim());
      setWarrantyPolicies(policies);
    }
  }, [woodworkerData]);

  const validatePolicy = (policy) => {
    if (policy.includes(";")) {
      return "Chính sách không được chứa dấu chấm phẩy (;)";
    }

    if (policy.length > 100) {
      return "Chính sách không được vượt quá 100 ký tự";
    }

    return "";
  };

  const checkTotalLength = (policies) => {
    const totalLength = policies.join(";").length;
    return totalLength <= 2000;
  };

  const handleNewPolicyChange = (text) => {
    setNewPolicy(text);

    if (text.trim()) {
      setPolicyError(validatePolicy(text));
    } else {
      setPolicyError("");
    }
  };

  const handleAddPolicy = () => {
    if (newPolicy.trim() === "") return;

    const error = validatePolicy(newPolicy.trim());
    if (error) {
      setPolicyError(error);
      return;
    }

    const updatedPolicies = [...warrantyPolicies, newPolicy.trim()];

    if (!checkTotalLength(updatedPolicies)) {
      setTotalLengthError(true);
      return;
    }

    setWarrantyPolicies(updatedPolicies);
    setNewPolicy("");
    setPolicyError("");
    setTotalLengthError(false);
  };

  const handleDeletePolicy = (index) => {
    const updatedPolicies = [...warrantyPolicies];
    updatedPolicies.splice(index, 1);
    setWarrantyPolicies(updatedPolicies);
    setTotalLengthError(false);
  };

  const handleSavePolicies = async () => {
    try {
      const policyString = warrantyPolicies.join(";");

      if (policyString.length > 2000) {
        setTotalLengthError(true);
        return;
      }

      await updateWarrantyPolicy({
        woodworkerId: woodworkerId,
        warrantyPolicy: policyString,
      }).unwrap();

      notify(
        "Cập nhật thành công",
        "Chính sách bảo hành đã được cập nhật",
        "success"
      );
      refetch();
      onClose();
    } catch (error) {
      notify(
        "Cập nhật thất bại",
        error.data?.data || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <WoodworkerLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}></Text>
          <TouchableOpacity style={styles.button} onPress={onOpen}>
            <Icon
              name="edit"
              size={18}
              color={appColorTheme.brown_2}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Quản lý lỗi bảo hành</Text>
          </TouchableOpacity>
        </View>

        <GuaranteeOrderList />

        <Modal
          visible={isOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={onClose}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Quản lý lỗi bảo hành</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="x" size={18} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      size="large"
                      color={appColorTheme.brown_2}
                    />
                  </View>
                ) : (
                  <View style={styles.contentContainer}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={[
                          styles.input,
                          policyError ? styles.inputError : null,
                        ]}
                        value={newPolicy}
                        onChangeText={handleNewPolicyChange}
                        placeholder="Thêm mục lỗi bảo hành mới"
                      />
                      <TouchableOpacity
                        style={[
                          styles.addButton,
                          (!!policyError || newPolicy.trim() === "") &&
                            styles.disabledButton,
                        ]}
                        onPress={handleAddPolicy}
                        disabled={!!policyError || newPolicy.trim() === ""}
                      >
                        <Icon name="plus" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    {policyError ? (
                      <Text style={styles.errorText}>{policyError}</Text>
                    ) : null}

                    <ScrollView style={styles.policyList}>
                      {warrantyPolicies.map((policy, index) => (
                        <View key={index} style={styles.policyItem}>
                          <Text style={styles.policyText}>{policy}</Text>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeletePolicy(index)}
                          >
                            <Icon name="trash-2" size={18} color="#e53e3e" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    (totalLengthError || warrantyPolicies.length === 0) &&
                      styles.disabledButton,
                  ]}
                  onPress={handleSavePolicies}
                  disabled={totalLengthError || warrantyPolicies.length === 0}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Icon
                        name="save"
                        size={18}
                        color="#fff"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.saveButtonText}>Lưu chính sách</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: appColorTheme.brown_2,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    flex: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: appColorTheme.brown_2,
    borderRadius: 4,
  },
  buttonText: {
    color: appColorTheme.brown_2,
    marginLeft: 5,
  },
  buttonIcon: {
    marginRight: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    backgroundColor: "#f9f9f9",
    maxHeight: "70%",
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 15,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#e53e3e",
  },
  addButton: {
    backgroundColor: "#38a169",
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginLeft: 10,
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 12,
    marginBottom: 10,
  },
  policyList: {
    maxHeight: 300,
  },
  policyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  policyText: {
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    padding: 10,
    marginRight: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButtonText: {
    color: "#333",
  },
  saveButton: {
    backgroundColor: appColorTheme.brown_2,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 4,
  },
  saveButtonText: {
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
