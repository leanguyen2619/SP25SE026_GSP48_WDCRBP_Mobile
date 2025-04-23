import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load auth data from AsyncStorage on initial render
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("auth");
        if (storedAuth) {
          setAuth(JSON.parse(storedAuth));
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load auth from AsyncStorage:", error);
        setIsLoaded(true);
      }
    };

    loadAuth();
  }, []);

  // Save or remove auth data when it changes
  useEffect(() => {
    if (isLoaded) {
      const updateAuth = async () => {
        try {
          if (auth) {
            await AsyncStorage.setItem("auth", JSON.stringify(auth));
          } else {
            await AsyncStorage.removeItem("auth");
          }
        } catch (error) {
          console.error("Failed to update auth in AsyncStorage:", error);
        }
      };

      updateAuth();
    }
  }, [auth, isLoaded]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
