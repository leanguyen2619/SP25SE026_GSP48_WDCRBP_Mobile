import { Stack, Spinner, Center, Text } from "@chakra-ui/react";
import { appColorTheme } from "../../../../../config/appconfig.js";
import { useState, useEffect } from "react";
import { useGetWoodworkerByUserIdQuery } from "../../../../../services/woodworkerApi.js";
import useAuth from "../../../../../hooks/useAuth.js";
import PackManagement from "../Pack/PackManagement.jsx";
import PersonalInformationManagement from "../PersonalInformation/PersonalInformationManagement.jsx";
import WoodworkerInformationManagement from "../WoodworkerInformation/WoodworkerInformationManagement.jsx";

export default function WoodworkerProfileManagementPage() {
  const { auth } = useAuth();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetWoodworkerByUserIdQuery(auth?.userId);
  const [address, setAddress] = useState(null);
  const [isAddressUpdate, setIsAddressUpdate] = useState(false);

  const woodworker = response?.data;

  useEffect(() => {
    if (woodworker?.address) {
      const addressParts = woodworker.address.split(", ");
      const street = addressParts[0];
      const wardName = addressParts[1];
      const districtName = addressParts[2];
      const cityName = addressParts[3];

      setAddress({
        street,
        wardName,
        districtName,
        cityName,
        cityId: woodworker.cityId,
        districtId: woodworker.districtId,
        wardCode: woodworker.wardCode,
      });
    }
  }, [woodworker]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color={appColorTheme.brown_2} />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text>Đã có lỗi xảy ra khi tải thông tin</Text>
      </Center>
    );
  }

  if (!woodworker) {
    return (
      <Center h="100vh">
        <Text>Không tìm thấy thông tin xưởng mộc</Text>
      </Center>
    );
  }

  return (
    <Stack spacing={6}>
      <PackManagement refetch={refetch} woodworker={woodworker} />
      <PersonalInformationManagement
        refetch={refetch}
        woodworker={woodworker}
      />
      <WoodworkerInformationManagement
        refetch={refetch}
        woodworker={woodworker}
        address={address}
        setAddress={setAddress}
        isAddressUpdate={isAddressUpdate}
        setIsAddressUpdate={setIsAddressUpdate}
      />
    </Stack>
  );
}
