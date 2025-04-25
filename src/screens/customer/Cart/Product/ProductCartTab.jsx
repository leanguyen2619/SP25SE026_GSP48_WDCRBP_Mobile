import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import useCart from "../../../../hooks/useCart.js";
import useAuth from "../../../../hooks/useAuth.js";
import ProductCartItemDetail from "./ProductCartItemDetail.jsx";
import { appColorTheme } from "../../../../config/appconfig.js";
import { useGetUserAddressesByUserIdQuery } from "../../../../services/userAddressApi.js";
import ProductOrderSummary from "./ProductOrderSummary.jsx";

export default function ProductCartTab() {
  const { cart } = useCart();
  const navigation = useNavigation();
  const { auth } = useAuth();
  const route = useRoute();

  // Enhanced selection state: [woodworkerId, installType]
  const [selection, setSelection] = useState(null);
  // State to track which address is selected
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Fetch user addresses
  const {
    data: addressesResponse,
    isLoading: isLoadingAddresses,
    error: addressError,
  } = useGetUserAddressesByUserIdQuery(auth?.userId, {
    skip: !auth?.userId,
  });

  const addresses = addressesResponse?.data || [];

  // Reset selection when cart changes
  useEffect(() => {
    setSelection(null);
  }, [cart.products]);

  // Check for selectedWoodworker in params
  useEffect(() => {
    const params = route.params || {};
    const preSelectedWoodworker = params.selectedWoodworker;

    if (preSelectedWoodworker && cart.products[preSelectedWoodworker]) {
      // Initially select the first group (install or non-install) available
      const products = cart.products[preSelectedWoodworker];
      const hasInstall = products.some((product) => product.isInstall);
      const hasNonInstall = products.some((product) => !product.isInstall);

      if (hasInstall) {
        setSelection([preSelectedWoodworker, "install"]);
      } else if (hasNonInstall) {
        setSelection([preSelectedWoodworker, "non-install"]);
      }
    }
  }, [route.params, cart.products]);

  // Group products by woodworker and installation status
  const groupedProducts = Object.entries(cart.products).map(
    ([woodworkerId, products]) => {
      // Split products into install and non-install groups
      const installProducts = products.filter((product) => product.isInstall);
      const nonInstallProducts = products.filter(
        (product) => !product.isInstall
      );

      return {
        woodworkerId,
        woodworkerName: products[0]?.woodworkerName || "Unknown Woodworker",
        installProducts,
        nonInstallProducts,
      };
    }
  );

  // Handle group selection (woodworker + installation type)
  const handleGroupSelect = (woodworkerId, installType) => {
    setSelection([woodworkerId, installType]);
  };

  // Get the currently selected products based on woodworker and installation status
  const selectedProducts = selection
    ? cart.products[selection[0]]?.filter((product) =>
        selection[1] === "install" ? product.isInstall : !product.isInstall
      )
    : [];

  const navigateToWoodworker = (woodworkerId) => {
    navigation.navigate("WoodworkerDetail", { woodworkerId });
  };

  const navigateToProducts = () => {
    navigation.navigate("Products");
  };

  if (groupedProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={navigateToProducts}
        >
          <Text style={styles.continueButtonText}>Tiếp tục mua sắm</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cart Items List */}
      <View style={styles.itemsContainer}>
        <ScrollView>
          {groupedProducts.map(
            ({
              woodworkerId,
              woodworkerName,
              installProducts,
              nonInstallProducts,
            }) => (
              <View key={woodworkerId} style={styles.woodworkerSection}>
                <TouchableOpacity
                  onPress={() => navigateToWoodworker(woodworkerId)}
                  style={styles.woodworkerHeader}
                >
                  <Text style={styles.woodworkerName}>
                    Xưởng mộc: {woodworkerName}
                  </Text>
                </TouchableOpacity>

                {/* Installation required items */}
                {installProducts.length > 0 && (
                  <TouchableOpacity
                    style={[
                      styles.groupContainer,
                      selection &&
                        selection[0] === woodworkerId &&
                        selection[1] === "install" &&
                        styles.selectedGroup,
                    ]}
                    onPress={() => handleGroupSelect(woodworkerId, "install")}
                  >
                    {selection &&
                      selection[0] === woodworkerId &&
                      selection[1] === "install" && (
                        <Feather
                          name="check-circle"
                          size={20}
                          color={appColorTheme.brown_2}
                          style={styles.checkIcon}
                        />
                      )}

                    <View style={styles.groupHeader}>
                      <Text style={styles.groupTitle}>Cần lắp đặt</Text>
                    </View>

                    <View style={styles.productsList}>
                      {installProducts.map((product) => (
                        <ProductCartItemDetail
                          key={product.productId}
                          product={product}
                          woodworkerId={woodworkerId}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                )}

                {/* No installation required items */}
                {nonInstallProducts.length > 0 && (
                  <TouchableOpacity
                    style={[
                      styles.groupContainer,
                      selection &&
                        selection[0] === woodworkerId &&
                        selection[1] === "non-install" &&
                        styles.selectedGroup,
                    ]}
                    onPress={() =>
                      handleGroupSelect(woodworkerId, "non-install")
                    }
                  >
                    {selection &&
                      selection[0] === woodworkerId &&
                      selection[1] === "non-install" && (
                        <Feather
                          name="check-circle"
                          size={20}
                          color={appColorTheme.brown_2}
                          style={styles.checkIcon}
                        />
                      )}

                    <View style={styles.groupHeader}>
                      <Text style={styles.groupTitle}>Không cần lắp đặt</Text>
                    </View>

                    <View style={styles.productsList}>
                      {nonInstallProducts.map((product) => (
                        <ProductCartItemDetail
                          key={product.productId}
                          product={product}
                          woodworkerId={woodworkerId}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )
          )}
        </ScrollView>
      </View>

      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        <ProductOrderSummary
          auth={auth}
          selectedGroup={selection}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          cartProducts={selectedProducts}
          addresses={addresses}
          isLoadingAddresses={isLoadingAddresses}
          addressError={addressError}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: appColorTheme.brown_2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  itemsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  woodworkerSection: {
    marginBottom: 20,
  },
  woodworkerHeader: {
    padding: 16,
  },
  woodworkerName: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
    fontSize: 18,
  },
  groupContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    position: "relative",
  },
  selectedGroup: {
    borderColor: appColorTheme.brown_2,
    backgroundColor: "#F9F5F0",
  },
  checkIcon: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 36,
  },
  groupTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  productsList: {
    gap: 16,
  },
  summaryContainer: {
    marginTop: 16,
  },
});
