import { Box, Stack, Text, IconButton, HStack, Button } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

const AddressCard = ({ address, onEdit, onSetDefault, isUpdating }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
      <HStack>
        <Text>{address.address}</Text>
        {address.isDefault && (
          <Text
            px={2}
            py={1}
            bg="green.100"
            color="green.800"
            borderRadius="md"
            fontSize="sm"
          >
            Mặc định
          </Text>
        )}
      </HStack>

      <HStack mb={2}>
        <HStack ml="auto">
          {!address.isDefault && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSetDefault(address)}
              isLoading={isUpdating}
            >
              Đặt làm mặc định
            </Button>
          )}
          <IconButton
            icon={<EditIcon />}
            size="sm"
            variant="ghost"
            onClick={() => onEdit(address)}
            isDisabled={isUpdating}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default function AddressList({
  addresses,
  onEdit,
  onSetDefault,
  isUpdating,
}) {
  if (!addresses || addresses.length === 0) {
    return <Text>Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</Text>;
  }

  return (
    <Stack spacing={4}>
      {addresses.map((address) => (
        <AddressCard
          key={address.userAddressId}
          address={address}
          onEdit={onEdit}
          onSetDefault={onSetDefault}
          isUpdating={isUpdating}
        />
      ))}
    </Stack>
  );
}
