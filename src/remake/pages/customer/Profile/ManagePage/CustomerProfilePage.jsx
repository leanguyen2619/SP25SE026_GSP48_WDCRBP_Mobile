import { Box, Stack, Heading, Spinner, Center, Text } from "@chakra-ui/react";
import { appColorTheme } from "../../../../config/appconfig.js";
import UserAddress from "../Address/UserAddress.jsx";
import { useGetUserInformationQuery } from "../../../../services/authApi.js";
import useAuth from "../../../../hooks/useAuth.js";
import CustomerPersonalInfoForm from "../PersonalInformation/CustomerPersonalInfoForm.jsx";
import CustomerPasswordChangeForm from "../PersonalInformation/CustomerPasswordChangeForm.jsx";

export default function CustomerProfilePage() {
  const { auth } = useAuth();
  const {
    data: userDataResponse,
    isLoading,
    error,
    refetch,
  } = useGetUserInformationQuery(auth?.userId);

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color={appColorTheme.brown_2}
          size="xl"
        />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px">
        <Text color="red.500">
          Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại sau.
        </Text>
      </Center>
    );
  }

  const userData = userDataResponse.data;

  return (
    <Box>
      <Stack spacing={6}>
        <UserAddress />
      </Stack>

      {/* Thông tin cá nhân */}
      <Stack mt={6} spacing={6}>
        <Heading
          color={appColorTheme.brown_2}
          fontFamily="Montserrat"
          fontSize="2xl"
        >
          Thông tin cá nhân
        </Heading>

        <Stack bg="white" p={5} borderRadius="lg" boxShadow="md" spacing={10}>
          <CustomerPersonalInfoForm userData={userData} refetch={refetch} />
          <CustomerPasswordChangeForm refetch={refetch} />
        </Stack>
      </Stack>
    </Box>
  );
}
