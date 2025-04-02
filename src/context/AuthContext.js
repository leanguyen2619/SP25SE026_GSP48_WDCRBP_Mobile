import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Kiểm tra token và role khi app khởi động
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const role = decodedToken?.role;
        setUserToken(token);
        setUserRole(role);
      }
    } catch (error) {
      console.log('Error loading storage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const role = decodedToken?.role;
      
      if (!role) {
        throw new Error('Invalid token: no role found');
      }

      await AsyncStorage.setItem('accessToken', token);
      setUserToken(token);
      setUserRole(role);
      return role;
    } catch (error) {
      console.log('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      setUserToken(null);
      setUserRole(null);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const checkAccess = (requiredRole) => {
    console.log('Checking access:', { userRole, requiredRole });
    if (!userToken || !userRole) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục');
      return false;
    }
    
    if (userRole !== requiredRole) {
      Alert.alert('Lỗi', 'Bạn không có quyền truy cập trang này');
      return false;
    }
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      isLoading,
      userToken,
      userRole,
      signIn,
      signOut,
      checkAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 