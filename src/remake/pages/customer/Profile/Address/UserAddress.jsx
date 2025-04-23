import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
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
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();

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

  if (isLoading) return <Spinner size="xl" />;

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Không thể tải địa chỉ: {error?.data?.message || "Vui lòng thử lại sau"}
      </Alert>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading
          color={appColorTheme.brown_2}
          fontFamily="Montserrat"
          fontSize="2xl"
        >
          Địa chỉ của bạn
        </Heading>

        <Button
          leftIcon={<AddIcon />}
          variant={"outline"}
          onClick={onCreateModalOpen}
          isDisabled={addressesData?.length >= 3}
          colorScheme="green"
        >
          Thêm địa chỉ
        </Button>
      </HStack>

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
    </Box>
  );
}
