import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../../hooks/useAuth.js";

const RequireAuth = ({ allowedRoles, children }) => {
  const { auth } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const hasAccess = Array.isArray(allowedRoles)
      ? allowedRoles.includes(auth?.role)
      : auth?.role === allowedRoles;

    if (!hasAccess) {
      if (auth?.role) {
        // Người dùng đã đăng nhập nhưng không có quyền truy cập
        navigation.replace("Unauthorized");
      } else {
        // Người dùng chưa đăng nhập
        navigation.replace("Auth");
      }
    }
  }, [auth, allowedRoles, navigation]);

  const hasAccess = Array.isArray(allowedRoles)
    ? allowedRoles.includes(auth?.role)
    : auth?.role === allowedRoles;

  // Chỉ hiển thị children nếu người dùng có quyền truy cập
  return hasAccess ? children : null;
};

export default RequireAuth;
