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
import DesignCartItemDetail from "./DesignCartItemDetail.jsx";
import { appColorTheme } from "../../../../config/appconfig.js";
import { useGetUserAddressesByUserIdQuery } from "../../../../services/userAddressApi.js";
import DesignOrderSummary from "./DesignOrderSummary.jsx";

export default function DesignCartTab() {
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
  }, [cart.designs]);

  // Check for selectedWoodworker in params
  useEffect(() => {
    const params = route.params || {};
    const preSelectedWoodworker = params.selectedWoodworker;

    if (preSelectedWoodworker && cart.designs[preSelectedWoodworker]) {
      // Initially select the first group (install or non-install) available
      const designs = cart.designs[preSelectedWoodworker];
      const hasInstall = designs.some((design) => design.isInstall);
      const hasNonInstall = designs.some((design) => !design.isInstall);

      if (hasInstall) {
        setSelection([preSelectedWoodworker, "install"]);
      } else if (hasNonInstall) {
        setSelection([preSelectedWoodworker, "non-install"]);
      }
    }
  }, [route.params, cart.designs]);

  // Group designs by woodworker and installation status
  const groupedDesigns = Object.entries(cart.designs).map(
    ([woodworkerId, designs]) => {
      // Split designs into install and non-install groups
      const installDesigns = designs.filter((design) => design.isInstall);
      const nonInstallDesigns = designs.filter((design) => !design.isInstall);

      return {
        woodworkerId,
        woodworkerName: designs[0]?.woodworkerName || "Unknown Woodworker",
        installDesigns,
        nonInstallDesigns,
      };
    }
  );

  // Handle group selection (woodworker + installation type)
  const handleGroupSelect = (woodworkerId, installType) => {
    setSelection([woodworkerId, installType]);
  };

  // Get the currently selected designs based on woodworker and installation status
  const selectedDesigns = selection
    ? cart.designs[selection[0]]?.filter((design) =>
        selection[1] === "install" ? design.isInstall : !design.isInstall
      )
    : [];

  const navigateToWoodworker = (woodworkerId) => {
    navigation.navigate("WoodworkerDetail", { woodworkerId });
  };

  const navigateToDesigns = () => {
    navigation.navigate("Designs");
  };

  if (groupedDesigns.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={navigateToDesigns}
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
          {groupedDesigns.map(
            ({
              woodworkerId,
              woodworkerName,
              installDesigns,
              nonInstallDesigns,
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
                {installDesigns.length > 0 && (
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

                    <View style={styles.designsList}>
                      {installDesigns.map((design) => (
                        <DesignCartItemDetail
                          key={design.designIdeaVariantId}
                          design={design}
                          type="design"
                          woodworkerId={woodworkerId}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                )}

                {/* No installation required items */}
                {nonInstallDesigns.length > 0 && (
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

                    <View style={styles.designsList}>
                      {nonInstallDesigns.map((design) => (
                        <DesignCartItemDetail
                          key={design.designIdeaVariantId}
                          design={design}
                          type="design"
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
        <DesignOrderSummary
          auth={auth}
          selectedGroup={selection}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          cartDesigns={selectedDesigns}
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
  designsList: {
    gap: 16,
  },
  summaryContainer: {
    marginTop: 16,
  },
});
