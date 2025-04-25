import { useEffect, useRef } from "react";
import { useRefreshTokenMutation } from "../services/authApi";
import useAuth from "./useAuth";
import Cookies from "js-cookie";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const [refreshToken] = useRefreshTokenMutation();
  const refreshTimeoutRef = useRef(null);

  const handleRefreshToken = async () => {
    try {
      const result = await refreshToken().unwrap();
      const cookieAuth = Cookies.get("auth");
      const currentAuth = cookieAuth ? JSON.parse(cookieAuth) : null;

      // Cập nhật auth mới với refresh token cũ
      const newAuth = {
        ...result,
        refreshToken: currentAuth?.refreshToken,
      };

      // Lưu auth mới vào cookie và context
      Cookies.set("auth", JSON.stringify(newAuth));
      setAuth(newAuth);

      // Lên lịch refresh token tiếp theo (55 giây = 55000ms)
      scheduleRefreshToken();
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // Nếu refresh thất bại, xóa auth và chuyển về trang login
      Cookies.remove("auth");
      setAuth(null);
      window.location.href = "/login";
    }
  };

  const scheduleRefreshToken = () => {
    // Xóa timeout cũ nếu có
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Đặt timeout mới (55 giây)
    refreshTimeoutRef.current = setTimeout(handleRefreshToken, 55000);
  };

  useEffect(() => {
    const cookieAuth = Cookies.get("auth");
    if (cookieAuth) {
      // Bắt đầu chu kỳ refresh token
      scheduleRefreshToken();
    }

    return () => {
      // Cleanup khi component unmount
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return { handleRefreshToken };
};
