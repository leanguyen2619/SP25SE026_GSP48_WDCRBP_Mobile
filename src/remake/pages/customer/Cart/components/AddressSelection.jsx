import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AddressSelection({
  addresses = [],
  isLoading = false,
  error = null,
  selectedAddress,
  setSelectedAddress,
  auth,
}) {
  const navigation = useNavigation();

  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      // Find default address or use the first one
      const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress.userAddressId.toString());
    }
  }, [addresses, selectedAddress, setSelectedAddress]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#4299E1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Feather
          name="alert-circle"
          size={18}
          color="#E53E3E"
          style={styles.errorIcon}
        />
        <Text style={styles.errorText}>
          Không thể tải địa chỉ. Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  if (addresses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bạn chưa có địa chỉ giao hàng</Text>
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={() => navigation.navigate("CustomerProfile")}
        >
          <Feather
            name="plus-circle"
            size={16}
            color="white"
            style={styles.addAddressIcon}
          />
          <Text style={styles.addAddressText}>Thêm địa chỉ mới</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Địa chỉ giao hàng</Text>

        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate("CustomerProfile")}
        >
          <Text style={styles.manageButtonText}>Quản lý địa chỉ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addressesContainer}>
        {addresses.map((address) => (
          <TouchableOpacity
            key={address.userAddressId}
            style={[
              styles.addressItem,
              selectedAddress === address.userAddressId.toString() &&
                styles.selectedAddressItem,
            ]}
            onPress={() => setSelectedAddress(address.userAddressId.toString())}
          >
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioOuter,
                  selectedAddress === address.userAddressId.toString() &&
                    styles.selectedRadioOuter,
                ]}
              >
                {selectedAddress === address.userAddressId.toString() && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <View style={styles.addressTextContainer}>
                <Text style={styles.addressText}>{address.address}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorContainer: {
    backgroundColor: "#FED7D7",
    borderRadius: 4,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: "#C53030",
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  emptyText: {
    marginBottom: 12,
  },
  addAddressButton: {
    backgroundColor: "#48BB78",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addAddressIcon: {
    marginRight: 6,
  },
  addAddressText: {
    color: "white",
    fontWeight: "500",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
  },
  manageButton: {
    padding: 4,
  },
  manageButtonText: {
    color: "#3182CE",
    fontSize: 14,
  },
  addressesContainer: {
    marginTop: 8,
  },
  addressItem: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "white",
  },
  selectedAddressItem: {
    borderColor: "#48BB78",
    backgroundColor: "#F0FFF4",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadioOuter: {
    borderColor: "#48BB78",
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#48BB78",
  },
  addressTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  addressText: {
    fontWeight: "500",
  },
});
