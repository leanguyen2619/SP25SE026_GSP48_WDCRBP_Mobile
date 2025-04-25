import {
  Box,
  VStack,
  Text,
  HStack,
  Textarea,
  Button,
  Switch,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import { appColorTheme, service } from "../../../config/appconfig";
import { FiEdit2, FiX, FiCheck } from "react-icons/fi";
import { useNotify } from "../../../components/Utility/Notify";
import {
  useGetAvailableServiceByWwIdQuery,
  useUpdateAvailableServiceByWwIdMutation,
} from "../../../services/availableServiceApi";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import RequireServicePack from "../../../components/Utility/RequireServicePack";

export default function ServiceConfiguration() {
  const notify = useNotify();
  const { auth } = useAuth();
  const navigate = useNavigate();

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
      <Center h="300px">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" p={5}>
        <Text color="red.500" mb={4}>
          Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.
        </Text>
        <Button onClick={refetch} colorScheme="blue">
          Thử lại
        </Button>
      </Box>
    );
  }

  if (!servicesData?.data || servicesData.data.length === 0) {
    return (
      <Box textAlign="center" p={5}>
        <Text mb={4}>
          Bạn chưa có gói dịch vụ nào. Vui lòng đăng ký gói dịch vụ để tiếp tục.
        </Text>
        <Button colorScheme="blue" onClick={() => navigate("/ww/profile")}>
          Mua gói dịch vụ
        </Button>
      </Box>
    );
  }

  return (
    <RequireServicePack>
      <Box>
        <Text
          fontSize="2xl"
          color={appColorTheme.brown_2}
          fontFamily="Montserrat"
          fontWeight="bold"
          mb={6}
        >
          Quản lý Dịch vụ
        </Text>

        <VStack spacing={6} align="stretch">
          {servicesData.data.map((serviceItem) => (
            <Box
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              key={serviceItem.availableServiceId}
              p={5}
              transition="all 0.2s"
            >
              <HStack justify="space-between" mb={3}>
                <Text
                  color={
                    serviceItem.operatingStatus
                      ? appColorTheme.brown_2
                      : "black"
                  }
                  fontWeight="bold"
                  fontSize="lg"
                >
                  {service[serviceItem.service.serviceName]?.serviceAlterName ||
                    serviceItem.service.serviceName}
                </Text>

                <Button
                  size="sm"
                  leftIcon={<FiEdit2 />}
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => handleEdit(serviceItem)}
                  isDisabled={isUpdating}
                >
                  Chỉnh sửa
                </Button>
              </HStack>

              {editingService === serviceItem.availableServiceId ? (
                <VStack spacing={3} align="stretch">
                  <HStack spacing={4}>
                    <Text>Kích hoạt</Text>

                    <Switch
                      size="sm"
                      colorScheme="yellow"
                      isChecked={editOperatingStatus}
                      onChange={() => handleToggle(editOperatingStatus)}
                      isDisabled={isUpdating}
                    />
                  </HStack>

                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    placeholder="Nhập mô tả dịch vụ..."
                    isDisabled={isUpdating}
                  />

                  <HStack justify="flex-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<FiX />}
                      onClick={() => setEditingService(null)}
                      isDisabled={isUpdating}
                    >
                      Đóng
                    </Button>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      leftIcon={<FiCheck />}
                      onClick={() => handleUpdate(serviceItem)}
                      isLoading={isUpdating}
                    >
                      Cập nhật
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <VStack align="stretch" spacing={2}>
                  <Text>{serviceItem.description}</Text>
                  <HStack spacing={4}>
                    <Text>Trạng thái: </Text>
                    {serviceItem.operatingStatus ? (
                      <Text color="green.500">Đang cung cấp dịch vụ</Text>
                    ) : (
                      <Text color="red.500">Tạm dừng</Text>
                    )}
                  </HStack>
                </VStack>
              )}
            </Box>
          ))}
        </VStack>
      </Box>
    </RequireServicePack>
  );
}
