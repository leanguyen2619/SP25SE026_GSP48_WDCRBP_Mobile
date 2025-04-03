import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'; 
import store from './src/redux/store'; 
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}> {/* ✅ This needs to wrap everything using Redux */}
        <NavigationContainer>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
