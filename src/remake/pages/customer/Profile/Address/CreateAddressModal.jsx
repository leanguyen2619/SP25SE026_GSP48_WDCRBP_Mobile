import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import AddressInput from "../../../../components/Utility/AddressInput";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import { useNotify } from "../../../../components/Utility/Notify";

export default function CreateAddressModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) {
  const notify = useNotify();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [addressData, setAddressData] = useState({
    street: "",
    cityId: "",
    districtId: "",
    wardCode: "",
    cityName: "",
    districtName: "",
    wardName: "",
  });

  const handleAddressChange = (value) => {
    setAddressData(value);
  };

  const validateForm = () => {
    if (!addressData.cityId) {
      notify("Vui lòng chọn tỉnh/thành phố", "", "error");
      return false;
    }
    if (!addressData.districtId) {
      notify("Vui lòng chọn quận/huyện", "", "error");
      return false;
    }
    if (!addressData.wardCode) {
      notify("Vui lòng chọn phường/xã", "", "error");
      return false;
    }
    if (!addressData.street.trim()) {
      notify("Vui lòng nhập tên đường/số nhà", "", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedAddress = `${addressData.street}, ${addressData.wardName}, ${addressData.districtName}, ${addressData.cityName}`;

    const formData = {
      isDefault,
      address: formattedAddress,
      wardCode: addressData.wardCode,
      districtId: addressData.districtId,
      cityId: addressData.cityId,
    };

    onSubmit(formData);
  };

  const resetForm = () => {
    setAddressData({
      street: "",
      cityId: "",
      districtId: "",
      wardCode: "",
      cityName: "",
      districtName: "",
      wardName: "",
    });
    setIsDefault(false);
    setButtonDisabled(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm địa chỉ mới</ModalHeader>
        {!isLoading && <ModalCloseButton />}
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <AddressInput
                value={addressData}
                onChange={handleAddressChange}
              />

              <FormControl mb={6}>
                <Checkbox
                  isChecked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                >
                  Đặt làm địa chỉ mặc định
                </Checkbox>
              </FormControl>

              <CheckboxList
                items={[
                  {
                    isOptional: false,
                    description:
                      "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                  },
                ]}
                setButtonDisabled={setButtonDisabled}
              />

              <Button
                type="submit"
                colorScheme="green"
                isLoading={isLoading}
                isDisabled={buttonDisabled}
                leftIcon={<AddIcon />}
              >
                Thêm mới
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
