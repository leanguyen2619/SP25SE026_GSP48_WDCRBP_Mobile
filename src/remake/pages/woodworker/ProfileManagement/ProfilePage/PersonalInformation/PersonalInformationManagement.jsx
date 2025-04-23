import { Heading, Stack } from "@chakra-ui/react";
import { appColorTheme } from "../../../../../config/appconfig.js";
import PersonalInfoForm from "./PersonalInfoForm.jsx";
import PasswordChangeForm from "./PasswordChangeForm.jsx";

export default function PersonalInformationManagement({ woodworker, refetch }) {
  return (
    <>
      <Heading
        color={appColorTheme.brown_2}
        fontSize="2xl"
        fontFamily="Montserrat"
      >
        Quản lý Thông tin cá nhân
      </Heading>

      <Stack bg="white" p={5} borderRadius="lg" boxShadow="md" spacing={10}>
        <PersonalInfoForm woodworker={woodworker} refetch={refetch} />
        <PasswordChangeForm refetch={refetch} />
      </Stack>
    </>
  );
}
