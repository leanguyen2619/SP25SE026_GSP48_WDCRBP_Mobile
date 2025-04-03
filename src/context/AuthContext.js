import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null); // ⬅️ Added userId state

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const id = decodedToken?.userId; // ⬅️ lowercase 'userId'
        const role = decodedToken?.role;

        if (id) {
          await AsyncStorage.setItem('userId', id.toString()); // ⬅️ Store userId in AsyncStorage
          setUserId(id); // ⬅️ Set userId in state
        }

        setUserToken(token);
        setUserRole(role);
        console.log('userId from token is:', id);
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
      const id = decodedToken?.userId;

      if (!role) {
        throw new Error('Invalid token: no role found');
      }

      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('userId', id.toString()); // ⬅️ Save userId
      setUserToken(token);
      setUserRole(role);
      setUserId(id); // ⬅️ Save to state
      return role;
    } catch (error) {
      console.log('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'userId']);
      setUserToken(null);
      setUserRole(null);
      setUserId(null); // ⬅️ Clear userId
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const checkAccess = (requiredRole) => {
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
      userId, // ⬅️ Expose userId
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
