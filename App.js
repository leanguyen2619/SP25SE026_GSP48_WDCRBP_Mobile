// import React from 'react';
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { NavigationContainer } from "@react-navigation/native";
// import { Provider } from 'react-redux';
// import store from './src/redux/store';
// import { AuthProvider } from './src/context/AuthContext';
// import AppNavigator from './src/navigation/AppNavigator';

// const App = () => {
//   return (
//     <SafeAreaProvider>
//       <Provider store={store}> {/* ✅ This needs to wrap everything using Redux */}
//         <NavigationContainer>
//           <AuthProvider>
//             <AppNavigator />
//           </AuthProvider>
//         </NavigationContainer>
//       </Provider>
//     </SafeAreaProvider>
//   );
// };

// export default App;

import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./src/remake/store/store";
import AppNavigator from "./src/remake/navigation/AppNavigator";
import { AuthProvider } from "./src/remake/context/AuthProvider";
import { CartProvider } from "./src/remake/context/CartContext";
import { ToastProvider } from "./src/remake/components/Utility/Notify";
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
