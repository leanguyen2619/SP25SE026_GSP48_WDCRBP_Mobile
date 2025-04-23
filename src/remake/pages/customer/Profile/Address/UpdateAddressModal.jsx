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
import { useState, useEffect } from "react";
import { EditIcon } from "@chakra-ui/icons";
import AddressInput from "../../../../components/Utility/AddressInput";
import CheckboxList from "../../../../components/Utility/CheckboxList";
import { useNotify } from "../../../../components/Utility/Notify";

export default function UpdateAddressModal({
  isOpen,
  onClose,
  address,
  onSubmit,
  isLoading,
}) {
  const notify = useNotify();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);
  const addressParts = address?.address.split(", ") || [];
  const [addressData, setAddressData] = useState({
    street: addressParts[0] || "",
    cityId: address.cityId || "",
    districtId: address.districtId || "",
    wardCode: address.wardCode || "",
    cityName: addressParts[3] || "", // These will be populated by AddressInput
    districtName: addressParts[2] || "",
    wardName: addressParts[1] || "",
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật địa chỉ</ModalHeader>
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
                colorScheme="blue"
                isLoading={isLoading}
                isDisabled={buttonDisabled}
                leftIcon={<EditIcon />}
              >
                Cập nhật
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
