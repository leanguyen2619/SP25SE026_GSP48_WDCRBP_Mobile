import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const AddressCard = ({ address, onEdit, onSetDefault, isUpdating }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.addressText}>{address.address}</Text>
        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Mặc định</Text>
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        <View style={styles.actionContainer}>
          {!address.isDefault && (
            <TouchableOpacity
              style={styles.defaultButton}
              onPress={() => onSetDefault(address)}
              disabled={isUpdating}
            >
              <Text style={styles.defaultButtonText}>Đặt làm mặc định</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(address)}
            disabled={isUpdating}
          >
            <MaterialIcons name="edit" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function AddressList({
  addresses,
  onEdit,
  onSetDefault,
  isUpdating,
}) {
  if (!addresses || addresses.length === 0) {
    return (
      <Text style={styles.emptyText}>
        Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {addresses.map((address) => (
        <AddressCard
          key={address.userAddressId}
          address={address}
          onEdit={onEdit}
          onSetDefault={onSetDefault}
          isUpdating={isUpdating}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  addressText: {
    flex: 1,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#C6F6D5",
    borderRadius: 6,
    marginLeft: 8,
  },
  defaultBadgeText: {
    color: "#276749",
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 2,
  },
  actionContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    alignItems: "center",
  },
  defaultButton: {
    padding: 6,
  },
  defaultButtonText: {
    color: "#2D3748",
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
  },
});
