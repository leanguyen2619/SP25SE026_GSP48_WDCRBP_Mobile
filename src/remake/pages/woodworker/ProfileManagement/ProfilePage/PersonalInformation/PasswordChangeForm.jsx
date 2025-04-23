import {
  Box,
  Button,
  GridItem,
  Heading,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { appColorTheme } from "../../../../../config/appconfig.js";
import CheckboxList from "../../../../../components/Utility/CheckboxList.jsx";
import { useChangePasswordMutation } from "../../../../../services/userApi.js";
import useAuth from "../../../../../hooks/useAuth.js";
import { useNotify } from "../../../../../components/Utility/Notify.jsx";
import PasswordInput from "../../../../../components/Input/PasswordInput.jsx";
import { FiCheckCircle } from "react-icons/fi";

export default function PasswordChangeForm({ refetch }) {
  const { auth } = useAuth();
  const notify = useNotify();
  const [passwordDisabled, setPasswordDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [changePassword] = useChangePasswordMutation();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const postData = Object.fromEntries(formData.entries());

    if (postData.newPassword !== postData.confirmPassword) {
      notify("Lỗi", "Mật khẩu mới không khớp", "error");
      return;
    }

    try {
      setIsLoading(true);
      await changePassword({
        userId: auth.userId,
        data: postData,
      }).unwrap();

      refetch();
      notify("Đổi mật khẩu thành công", "Mật khẩu đã được cập nhật", "success");

      e.target.reset();
      setPasswordDisabled(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notify(
        "Đổi mật khẩu thất bại",
        error.data?.message || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <form onSubmit={handlePasswordSubmit}>
      <Box mb={6}>
        <Heading as="h3" fontSize="18px" fontFamily="Montserrat" mb={6}>
          Đổi mật khẩu
        </Heading>
        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10}>
          <GridItem>
            <PasswordInput
              label="Mật khẩu hiện tại"
              name="oldPassword"
              placeholder="Nhập mật khẩu hiện tại"
              isRequired
            />
          </GridItem>
          <GridItem>
            <PasswordInput
              label="Mật khẩu mới"
              name="newPassword"
              placeholder="Nhập mật khẩu mới"
              isRequired
            />
          </GridItem>
          <GridItem>
            <PasswordInput
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              isRequired
            />
          </GridItem>
        </SimpleGrid>
      </Box>

      <Box mb={6}>
        {isLoading ? (
          <Spinner />
        ) : (
          <CheckboxList
            items={[
              {
                description: "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                isOptional: false,
              },
            ]}
            setButtonDisabled={setPasswordDisabled}
          />
        )}
      </Box>

      <Button
        _hover={{ backgroundColor: "app_brown.1", color: "white" }}
        px="30px"
        py="20px"
        bgColor={appColorTheme.brown_2}
        color="white"
        borderRadius="40px"
        zIndex="1"
        type="submit"
        isDisabled={passwordDisabled}
        leftIcon={<FiCheckCircle />}
      >
        Đổi mật khẩu
      </Button>
    </form>
  );
}
