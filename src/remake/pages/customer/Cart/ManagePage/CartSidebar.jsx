import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DesignCartItem from "../Design/DesignCartItem.jsx";
import ProductCartItem from "../Product/ProductCartItem.jsx";
import useCart from "../../../../hooks/useCart.js";
import { appColorTheme } from "../../../../config/appconfig.js";

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, getCartItemCount } = useCart();
  const [activeTab, setActiveTab] = useState(0);
  const navigation = useNavigation();

  // Function to determine the link based on active tab
  const navigateToCart = () => {
    navigation.navigate("Cart", {
      tab: activeTab === 0 ? "design" : "product",
    });
    setIsOpen(false);
  };

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      {/* Cart Icon with Badge */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={onOpen}
        activeOpacity={0.7}
      >
        <Feather name="shopping-cart" size={24} color="black" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getCartItemCount()}</Text>
        </View>
      </TouchableOpacity>

      {/* Cart Drawer as Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.drawerContent}>
            {/* Header */}
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerHeaderText}>Giỏ hàng</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 0 && styles.activeTab]}
                onPress={() => setActiveTab(0)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 0 && styles.activeTabText,
                  ]}
                >
                  Thiết kế
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 1 && styles.activeTab]}
                onPress={() => setActiveTab(1)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 1 && styles.activeTabText,
                  ]}
                >
                  Sản phẩm
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <ScrollView
              style={styles.tabContentContainer}
              contentContainerStyle={styles.tabContentScrollContainer}
            >
              {/* Designs Tab */}
              {activeTab === 0 && (
                <View style={styles.tabContent}>
                  {Object.keys(cart.designs).length === 0 ? (
                    <View style={styles.emptyCart}>
                      <Text style={styles.emptyCartText}>
                        Không có thiết kế trong giỏ hàng
                      </Text>
                    </View>
                  ) : (
                    Object.entries(cart.designs).map(
                      ([woodworkerId, designs]) => (
                        <View key={woodworkerId} style={styles.woodworkerGroup}>
                          <Text style={styles.woodworkerName}>
                            Xưởng mộc: {designs?.[0]?.woodworkerName}
                          </Text>

                          {designs.map((design) => (
                            <DesignCartItem
                              key={design.designIdeaVariantId}
                              item={design}
                              type="design"
                              woodworkerId={woodworkerId}
                            />
                          ))}
                          <View style={styles.divider} />
                        </View>
                      )
                    )
                  )}
                </View>
              )}

              {/* Products Tab */}
              {activeTab === 1 && (
                <View style={styles.tabContent}>
                  {Object.keys(cart.products).length === 0 ? (
                    <View style={styles.emptyCart}>
                      <Text style={styles.emptyCartText}>
                        Không có sản phẩm trong giỏ hàng
                      </Text>
                    </View>
                  ) : (
                    Object.entries(cart.products).map(
                      ([woodworkerId, products]) => (
                        <View key={woodworkerId} style={styles.woodworkerGroup}>
                          <Text style={styles.woodworkerName}>
                            Xưởng mộc: {products?.[0]?.woodworkerName}
                          </Text>

                          {products.map((product) => (
                            <ProductCartItem
                              key={product.productId}
                              item={product}
                              woodworkerId={woodworkerId}
                            />
                          ))}
                          <View style={styles.divider} />
                        </View>
                      )
                    )
                  )}
                </View>
              )}
            </ScrollView>

            {/* Footer Button */}
            <TouchableOpacity
              style={styles.viewCartButton}
              onPress={navigateToCart}
            >
              <Text style={styles.viewCartButtonText}>Xem giỏ hàng</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  cartButton: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  badgeText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContent: {
    position: "absolute",
    width: width * 0.85,
    height: "100%",
    right: 0,
    backgroundColor: appColorTheme.grey_1,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: "black",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerHeaderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  closeButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: appColorTheme.brown_2,
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: appColorTheme.brown_2,
    fontWeight: "bold",
  },
  tabContentContainer: {
    flex: 1,
    paddingBottom: 80, // Space for the bottom button
  },
  tabContentScrollContainer: {
    padding: 16,
  },
  tabContent: {
    flex: 1,
  },
  emptyCart: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#718096",
  },
  woodworkerGroup: {
    marginBottom: 24,
  },
  woodworkerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 20,
  },
  viewCartButton: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 20,
    left: 20,
    right: 20,
    backgroundColor: appColorTheme.brown_2,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  viewCartButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
