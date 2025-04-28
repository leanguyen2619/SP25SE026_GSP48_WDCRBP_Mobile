import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { appColorTheme, service } from "../../../config/appconfig";
import { useNotify } from "../../../components/Utility/Notify";
import {
  useGetAvailableServiceByWwIdQuery,
  useUpdateAvailableServiceByWwIdMutation,
} from "../../../services/availableServiceApi";
import useAuth from "../../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import WoodworkerLayout from "../../../layouts/WoodworkerLayout";

export default function ServiceConfiguration() {
  const notify = useNotify();
  const { auth } = useAuth();
  const navigation = useNavigation();

  // Fetch available services using the API
  const {
    data: servicesData,
    isLoading,
    isError,
    refetch,
  } = useGetAvailableServiceByWwIdQuery(auth?.wwId);
  const [updateService, { isLoading: isUpdating }] =
    useUpdateAvailableServiceByWwIdMutation();

  const [editingService, setEditingService] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editOperatingStatus, setEditOperatingStatus] = useState(false);

  const handleToggle = (status) => {
    setEditOperatingStatus(!status);
  };

  const handleEdit = (serviceItem) => {
    setEditingService(serviceItem.availableServiceId);
    setEditDescription(serviceItem.description);
    setEditOperatingStatus(serviceItem.operatingStatus);
  };

  const handleUpdate = async (serviceItem) => {
    try {
      await updateService({
        availableServiceId: serviceItem.availableServiceId,
        description: editDescription,
        operatingStatus: editOperatingStatus,
      }).unwrap();

      refetch();
      setEditingService(null);
      notify("Cập nhật thành công", "", "success");
    } catch (error) {
      notify("Lỗi cập nhật", "Không thể cập nhật dịch vụ", "error");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColorTheme.brown_2} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!servicesData?.data || servicesData.data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Bạn chưa có gói dịch vụ nào. Vui lòng đăng ký gói dịch vụ để tiếp tục.
        </Text>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => navigation.navigate("WWProfile")}
        >
          <Text style={styles.buyButtonText}>Mua gói dịch vụ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <WoodworkerLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.heading}>Quản lý Dịch vụ</Text>
          </View>

          <View style={styles.serviceList}>
            {servicesData.data.map((serviceItem) => (
              <View
                style={[
                  styles.serviceCard,
                  serviceItem.operatingStatus && styles.activeServiceCard,
                ]}
                key={serviceItem.availableServiceId}
              >
                <View style={styles.serviceHeader}>
                  <Text
                    style={[
                      styles.serviceTitle,
                      serviceItem.operatingStatus && styles.activeServiceTitle,
                    ]}
                  >
                    {service[serviceItem.service.serviceName]
                      ?.serviceAlterName || serviceItem.service.serviceName}
                  </Text>

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(serviceItem)}
                    disabled={isUpdating}
                  >
                    <AntDesign name="edit" size={16} color="#3182ce" />
                    <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                  </TouchableOpacity>
                </View>

                {editingService === serviceItem.availableServiceId ? (
                  <View style={styles.editContainer}>
                    <View style={styles.toggleContainer}>
                      <Text style={styles.toggleLabel}>Kích hoạt</Text>

                      <Switch
                        value={editOperatingStatus}
                        onValueChange={() => handleToggle(editOperatingStatus)}
                        disabled={isUpdating}
                        trackColor={{ false: "#767577", true: "#f8e1b7" }}
                        thumbColor={
                          editOperatingStatus
                            ? appColorTheme.brown_2
                            : "#f4f3f4"
                        }
                      />
                    </View>

                    <TextInput
                      value={editDescription}
                      onChangeText={setEditDescription}
                      multiline
                      numberOfLines={3}
                      placeholder="Nhập mô tả dịch vụ..."
                      style={styles.textArea}
                      editable={!isUpdating}
                    />

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setEditingService(null)}
                        disabled={isUpdating}
                      >
                        <AntDesign name="close" size={16} color="#4A5568" />
                        <Text style={styles.cancelButtonText}>Đóng</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.updateButton}
                        onPress={() => handleUpdate(serviceItem)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <>
                            <AntDesign name="check" size={16} color="white" />
                            <Text style={styles.updateButtonText}>
                              Cập nhật
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceDescription}>
                      {serviceItem.description}
                    </Text>
                    <View style={styles.statusContainer}>
                      <Text style={styles.statusLabel}>Trạng thái: </Text>
                      {serviceItem.operatingStatus ? (
                        <Text style={styles.activeStatus}>
                          Đang cung cấp dịch vụ
                        </Text>
                      ) : (
                        <Text style={styles.inactiveStatus}>Tạm dừng</Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </WoodworkerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  header: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
  },
  serviceList: {
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  activeServiceCard: {
    borderLeftWidth: 3,
    borderLeftColor: appColorTheme.brown_2,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  activeServiceTitle: {
    color: appColorTheme.brown_2,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderWidth: 1,
    borderColor: "#3182ce",
    borderRadius: 4,
  },
  editButtonText: {
    color: "#3182ce",
    fontSize: 12,
    marginLeft: 5,
  },
  editContainer: {
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleLabel: {
    marginRight: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#4A5568",
    marginLeft: 5,
    fontSize: 14,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3182ce",
    padding: 8,
    borderRadius: 4,
  },
  updateButtonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 14,
  },
  serviceDetails: {
    marginTop: 5,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
  },
  activeStatus: {
    color: "green",
    fontSize: 14,
  },
  inactiveStatus: {
    color: "red",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#3182ce",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  buyButton: {
    backgroundColor: "#3182ce",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buyButtonText: {
    color: "white",
    fontSize: 14,
  },
});
