import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { appColorTheme } from "../../../../config/appconfig.js";
import {
  useGetUserAddressesByUserIdQuery,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
} from "../../../../services/userAddressApi.js";
import useAuth from "../../../../hooks/useAuth.js";
import { useNotify } from "../../../../components/Utility/Notify.jsx";
import AddressList from "./AddressList.jsx";
import CreateAddressModal from "./CreateAddressModal.jsx";
import UpdateAddressModal from "./UpdateAddressModal.jsx";

export default function UserAddress() {
  const notify = useNotify();
  const { auth } = useAuth();
  const [currentAddress, setCurrentAddress] = useState(null);

  // Modal controls
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const onCreateModalOpen = () => setIsCreateModalOpen(true);
  const onCreateModalClose = () => setIsCreateModalOpen(false);
  const onUpdateModalOpen = () => setIsUpdateModalOpen(true);
  const onUpdateModalClose = () => setIsUpdateModalOpen(false);

  // API Queries and Mutations
  const { data, isLoading, isError, error, refetch } =
    useGetUserAddressesByUserIdQuery(auth?.userId, {
      skip: !auth?.userId,
    });

  const addressesData = data?.data || [];

  const [createUserAddress, { isLoading: isCreating }] =
    useCreateUserAddressMutation();
  const [updateUserAddress, { isLoading: isUpdating }] =
    useUpdateUserAddressMutation();

  const handleCreate = async (formData) => {
    try {
      if (addressesData?.length >= 3) {
        notify("Đã đạt giới hạn tối đa 3 địa chỉ", "", "error");
        return;
      }
      await createUserAddress({
        ...formData,
        userId: auth?.userId,
      }).unwrap();
      notify("Địa chỉ đã được thêm", "", "success");
      refetch();
      onCreateModalClose();
    } catch (err) {
      notify(
        "Có lỗi xảy ra",
        err.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateUserAddress({
        id: currentAddress.userAddressId,
        ...formData,
        userId: auth?.userId,
      }).unwrap();
      notify("Địa chỉ đã được cập nhật", "", "success");
      refetch();
      onUpdateModalClose();
    } catch (err) {
      notify(
        "Có lỗi xảy ra",
        err.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await updateUserAddress({
        id: address.userAddressId,
        isDefault: true,
        address: address.address,
        wardCode: address.wardCode,
        districtId: address.districtId,
        cityId: address.cityId,
        userId: auth?.userId,
      }).unwrap();
      notify("Đã đặt làm địa chỉ mặc định", "", "success");
      refetch();
    } catch (err) {
      notify(
        "Có lỗi xảy ra",
        err.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  const handleEditClick = (address) => {
    setCurrentAddress(address);
    onUpdateModalOpen();
  };

  if (isLoading)
    return (
      <ActivityIndicator size="large" color="#38A169" style={styles.spinner} />
    );

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={24} color="#E53E3E" />
        <Text style={styles.errorText}>
          Không thể tải địa chỉ:{" "}
          {error?.data?.message || "Vui lòng thử lại sau"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Địa chỉ của bạn</Text>

        <TouchableOpacity
          style={[
            styles.addButton,
            addressesData?.length >= 3 && styles.disabledButton,
          ]}
          onPress={onCreateModalOpen}
          disabled={addressesData?.length >= 3}
        >
          <MaterialIcons name="add" size={18} color="#38A169" />
          <Text style={styles.addButtonText}>Thêm địa chỉ</Text>
        </TouchableOpacity>
      </View>

      <AddressList
        addresses={addressesData}
        onEdit={handleEditClick}
        onSetDefault={handleSetDefault}
        isUpdating={isUpdating}
      />

      <CreateAddressModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      {currentAddress && (
        <UpdateAddressModal
          isOpen={isUpdateModalOpen}
          onClose={onUpdateModalClose}
          address={currentAddress}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: appColorTheme.brown_2,
    fontFamily: "Montserrat",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#38A169",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: "#38A169",
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.5,
    borderColor: "#A0AEC0",
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  errorText: {
    color: "#E53E3E",
    marginLeft: 8,
    flex: 1,
  },
});
