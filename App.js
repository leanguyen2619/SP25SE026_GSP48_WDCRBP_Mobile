import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthProvider";
import { CartProvider } from "./src/context/CartContext";
import { ToastProvider } from "./src/components/Utility/Notify";
import { Provider } from "react-redux";

const App = () => {
  return (
    <>
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer>
            <CartProvider>
              <AuthProvider>
                <AppNavigator />
              </AuthProvider>
            </CartProvider>
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>

      <ToastProvider />
    </>
  );
};

export default App;
