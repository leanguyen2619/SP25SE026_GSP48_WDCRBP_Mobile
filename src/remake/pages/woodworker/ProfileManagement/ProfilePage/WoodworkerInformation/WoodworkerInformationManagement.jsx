import {
  Box,
  Button,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
  Textarea,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { appColorTheme } from "../../../../../config/appconfig.js";
import ImageUpdateUploader from "../../../../../components/Utility/ImageUpdateUploader.jsx";
import { useState } from "react";
import AddressInput from "../../../../../components/Utility/AddressInput.jsx";
import CheckboxList from "../../../../../components/Utility/CheckboxList.jsx";
import { useNotify } from "../../../../../components/Utility/Notify.jsx";
import { FiCheckCircle } from "react-icons/fi";

export default function WoodworkerInformationManagement({
  woodworker,
  address,
  setAddress,
  isAddressUpdate,
  setIsAddressUpdate,
}) {
  const [imgUrl, setImgUrl] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const notify = useNotify();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Thêm địa chỉ vào data nếu đang cập nhật
    if (isAddressUpdate && address) {
      data.address = `${address.street}, ${address.wardName}, ${address.districtName}, ${address.cityName}`;
      data.cityId = address.cityId;
      data.districtId = address.districtId;
      data.wardCode = address.wardCode;
    }

    // Thêm ảnh vào data nếu có
    if (imgUrl) {
      data.imgUrl = imgUrl;
    }

    try {
      setIsLoading(true);
      notify("Cập nhật thành công", "Thông tin đã được cập nhật", "success");
      setIsAddressUpdate(false);
      setButtonDisabled(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notify(
        "Cập nhật thất bại",
        error.data?.data || "Vui lòng thử lại sau",
        "error"
      );
    }
  };

  return (
    <>
      <Heading
        color={appColorTheme.brown_2}
        fontSize="2xl"
        fontFamily="Montserrat"
      >
        Quản lý Thông tin xưởng mộc
      </Heading>

      <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10}>
            <GridItem colSpan={{ base: 2, xl: "none" }}>
              <FormControl isRequired>
                <FormLabel>Tên xưởng mộc</FormLabel>
                <Input
                  placeholder="Nhập Tên xưởng mộc"
                  name="brandName"
                  defaultValue={woodworker.brandName}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Loại hình kinh doanh</FormLabel>
                <Select
                  placeholder="Chọn loại hình"
                  name="businessType"
                  defaultValue={woodworker.businessType}
                >
                  <option value="Cá nhân">Cá nhân</option>
                  <option value="Hộ kinh doanh">Hộ kinh doanh</option>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Địa chỉ xưởng</FormLabel>
                {isAddressUpdate ? (
                  <AddressInput
                    value={address}
                    onChange={setAddress}
                    oldAddress={address}
                  />
                ) : (
                  <Input
                    value={woodworker.address}
                    isReadOnly
                    bgColor={appColorTheme.grey_1}
                  />
                )}
                <Button
                  variant="link"
                  color={appColorTheme.brown_2}
                  mt={2}
                  onClick={() => setIsAddressUpdate(!isAddressUpdate)}
                >
                  {isAddressUpdate ? "Hủy cập nhật" : "Cập nhật địa chỉ"}
                </Button>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Mã số thuế</FormLabel>
                <Input
                  placeholder="Nhập mã số thuế"
                  name="taxCode"
                  isReadOnly
                  bgColor={appColorTheme.grey_1}
                  defaultValue={woodworker.taxCode}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Giới thiệu</FormLabel>
                <Textarea
                  whiteSpace="pre-wrap"
                  placeholder="Giới thiệu về xưởng mộc của bạn"
                  name="bio"
                  rows={4}
                  defaultValue={woodworker.bio}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ base: 1, xl: 2 }}>
              <FormControl isRequired>
                <FormLabel>Ảnh đại diện cho xưởng</FormLabel>
                <ImageUpdateUploader
                  onUploadComplete={(results) => {
                    setImgUrl(results);
                  }}
                  maxFiles={1}
                  imgUrls={woodworker.imgUrl}
                />
              </FormControl>
            </GridItem>
          </SimpleGrid>

          <Box mt={6}>
            {isLoading ? (
              <Spinner />
            ) : (
              <CheckboxList
                items={[
                  {
                    description:
                      "Tôi đã kiểm tra thông tin và xác nhận thao tác",
                    isOptional: false,
                  },
                ]}
                setButtonDisabled={setButtonDisabled}
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
            mt="40px"
            zIndex="1"
            type="submit"
            isDisabled={buttonDisabled}
            leftIcon={<FiCheckCircle />}
          >
            Cập nhật thông tin
          </Button>
        </form>
      </Box>
    </>
  );
}
