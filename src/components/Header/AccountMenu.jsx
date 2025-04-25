import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import useAuth from "../../hooks/useAuth.js";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { appColorTheme } from "../../config/appconfig.js";
import CartSidebar from "../../screens/customer/Cart/ManagePage/CartSidebar.jsx";

export default function AccountMenu() {
  const { auth, setAuth } = useAuth();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = () => {
    setAuth(null);
    setMenuVisible(false);
    navigation.navigate("Auth");
  };

  const navigateToProfile = () => {
    setMenuVisible(false);

    let profilePath = "Auth";
    switch (auth?.role) {
      case "Woodworker":
        profilePath = "WoodworkerProfile";
        break;
      case "Customer":
        profilePath = "CustomerProfile";
        break;
      case "Staff":
        profilePath = "Staff";
        break;
      case "Admin":
        profilePath = "Admin";
        break;
      case "Moderator":
        profilePath = "Mod";
        break;
    }

    navigation.navigate(profilePath);
  };

  const navigateToWoodworkerProfile = () => {
    setMenuVisible(false);
    navigation.navigate("WoodworkerPublic", { id: auth?.wwId });
  };

  if (!auth?.token) {
    return (
      <View style={styles.loginContainer}>
        <CartSidebar />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Auth")}
        >
          <Feather name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {auth?.role === "Customer" && <CartSidebar />}

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => setMenuVisible(true)}
      >
        <View style={styles.profileButtonContent}>
          {auth?.avatarLink ? (
            <Image source={{ uri: auth.avatarLink }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={18} color="#666" />
            </View>
          )}
          <Text style={styles.userName}>{auth.EmployeeName}</Text>
          <Feather name="chevron-down" size={18} color="black" />
        </View>
      </TouchableOpacity>

      {/* Profile Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={navigateToProfile}
            >
              <Feather name="user" size={20} color="black" />
              <Text style={styles.menuItemText}>Quản lý thông tin</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Feather name="log-out" size={20} color="black" />
              <Text style={styles.menuItemText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginText: {
    fontSize: 18,
  },
  woodworkerOptions: {
    marginRight: 20,
  },
  viewWorkshopText: {
    color: appColorTheme.brown_2,
    marginTop: 5,
  },
  profileButton: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  profileButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContent: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 70,
    marginRight: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#eee",
  },
});
