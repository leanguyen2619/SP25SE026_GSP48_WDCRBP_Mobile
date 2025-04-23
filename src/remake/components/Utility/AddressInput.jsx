import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetAllProvinceQuery,
  useGetDistrictByProvinceIdQuery,
  useGetWardByDistrictIdQuery,
} from "../../services/ghnApi";
import { appColorTheme } from "../../config/appconfig";

export default function AddressInput({ value, onChange }) {
  const [address, setAddress] = useState({
    street: value?.street || "",
    cityId: value?.cityId || "",
    districtId: value?.districtId || "",
    wardCode: value?.wardCode || "",
    cityName: value?.cityName || "",
    districtName: value?.districtName || "",
    wardName: value?.wardName || "",
  });

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "province", "district", "ward"

  // API calls
  const { data: provincesResponse, isLoading: isLoadingProvinces } =
    useGetAllProvinceQuery();

  const { data: districtsResponse, isLoading: isLoadingDistricts } =
    useGetDistrictByProvinceIdQuery(address.cityId, {
      skip: !address.cityId,
    });

  const { data: wardsResponse, isLoading: isLoadingWards } =
    useGetWardByDistrictIdQuery(address.districtId, {
      skip: !address.districtId,
    });

  useEffect(() => {
    onChange(address);
  }, [address, onChange]);

  // Mở modal để chọn dữ liệu
  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  // Đóng modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Xử lý khi chọn tỉnh/thành phố
  const handleSelectProvince = (province) => {
    const newAddress = {
      ...address,
      cityId: province.ProvinceID.toString(),
      cityName: province.ProvinceName,
      // Reset district và ward khi đổi tỉnh
      districtId: "",
      districtName: "",
      wardCode: "",
      wardName: "",
    };
    setAddress(newAddress);
    closeModal();
  };

  // Xử lý khi chọn quận/huyện
  const handleSelectDistrict = (district) => {
    const newAddress = {
      ...address,
      districtId: district.DistrictID.toString(),
      districtName: district.DistrictName,
      // Reset ward khi đổi quận
      wardCode: "",
      wardName: "",
    };
    setAddress(newAddress);
    closeModal();
  };

  // Xử lý khi chọn phường/xã
  const handleSelectWard = (ward) => {
    const newAddress = {
      ...address,
      wardCode: ward.WardCode,
      wardName: ward.WardName,
    };
    setAddress(newAddress);
    closeModal();
  };

  // Xử lý khi nhập địa chỉ đường phố
  const handleChangeStreet = (text) => {
    setAddress({ ...address, street: text });
  };

  // Render item cho danh sách chọn trong modal
  const renderItem = ({ item }) => {
    let onPress;
    let displayName;

    if (modalType === "province") {
      onPress = () => handleSelectProvince(item);
      displayName = item.ProvinceName;
    } else if (modalType === "district") {
      onPress = () => handleSelectDistrict(item);
      displayName = item.DistrictName;
    } else if (modalType === "ward") {
      onPress = () => handleSelectWard(item);
      displayName = item.WardName;
    }

    return (
      <TouchableOpacity style={styles.modalItem} onPress={onPress}>
        <Text style={styles.modalItemText}>{displayName}</Text>
      </TouchableOpacity>
    );
  };

  // Lấy data và title cho modal dựa vào loại
  const getModalData = () => {
    switch (modalType) {
      case "province":
        return {
          title: "Chọn Tỉnh/Thành phố",
          data: provincesResponse?.data?.data || [],
          isLoading: isLoadingProvinces,
        };
      case "district":
        return {
          title: "Chọn Quận/Huyện",
          data: districtsResponse?.data?.data || [],
          isLoading: isLoadingDistricts,
        };
      case "ward":
        return {
          title: "Chọn Phường/Xã",
          data: wardsResponse?.data?.data || [],
          isLoading: isLoadingWards,
        };
      default:
        return { title: "", data: [], isLoading: false };
    }
  };

  // Modal hiển thị danh sách chọn
  const renderModal = () => {
    const { title, data, isLoading } = getModalData();

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={appColorTheme.brown_2} />
              </View>
            ) : (
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) =>
                  modalType === "province"
                    ? item.ProvinceID.toString()
                    : modalType === "district"
                    ? item.DistrictID.toString()
                    : item.WardCode
                }
                contentContainerStyle={styles.modalList}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tỉnh/Thành phố */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Tỉnh/Thành phố <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.selectInput,
            !address.cityId && styles.placeholderInput,
          ]}
          onPress={() => openModal("province")}
        >
          <Text
            style={address.cityId ? styles.selectText : styles.placeholderText}
          >
            {address.cityName || "Chọn tỉnh/thành phố"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        {isLoadingProvinces && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color={appColorTheme.brown_2}
          />
        )}
      </View>

      {/* Quận/Huyện */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Quận/Huyện <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.selectInput,
            (!address.districtId || !address.cityId) && styles.placeholderInput,
          ]}
          onPress={() => (address.cityId ? openModal("district") : null)}
          disabled={!address.cityId}
        >
          <Text
            style={
              address.districtId
                ? styles.selectText
                : !address.cityId
                ? styles.disabledText
                : styles.placeholderText
            }
          >
            {address.districtName || "Chọn quận/huyện"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={address.cityId ? "#666" : "#aaa"}
          />
        </TouchableOpacity>
        {isLoadingDistricts && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color={appColorTheme.brown_2}
          />
        )}
      </View>

      {/* Phường/Xã */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Phường/Xã <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.selectInput,
            (!address.wardCode || !address.districtId) &&
              styles.placeholderInput,
          ]}
          onPress={() => (address.districtId ? openModal("ward") : null)}
          disabled={!address.districtId}
        >
          <Text
            style={
              address.wardCode
                ? styles.selectText
                : !address.districtId
                ? styles.disabledText
                : styles.placeholderText
            }
          >
            {address.wardName || "Chọn phường/xã"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={address.districtId ? "#666" : "#aaa"}
          />
        </TouchableOpacity>
        {isLoadingWards && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color={appColorTheme.brown_2}
          />
        )}
      </View>

      {/* Số nhà, tên đường */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Số nhà, tên đường <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tên đường, số nhà"
          value={address.street}
          onChangeText={handleChangeStreet}
        />
      </View>

      {/* Modal selection */}
      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "red",
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  placeholderInput: {
    borderColor: "#E2E8F0",
  },
  selectText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    fontSize: 16,
    color: "#A0AEC0",
  },
  disabledText: {
    fontSize: 16,
    color: "#CBD5E0",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  loadingIndicator: {
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    maxHeight: "80%",
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
  modalCloseButton: {
    padding: 4,
  },
  modalList: {
    paddingHorizontal: 16,
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalItemText: {
    fontSize: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});
