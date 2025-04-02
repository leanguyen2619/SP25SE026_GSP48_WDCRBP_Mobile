import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';
import PricingScreen from '../screens/PricingScreen';
import HomeScreen from '../screens/Customer/HomeScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import CartScreen from '../screens/Customer/CartScreen';
import DesignScreen from '../screens/Customer/DesignScreen';
import WoodworkerScreen from '../screens/Woodworker/WoodworkerScreen';
import WoodworkerDetailScreen from '../screens/Woodworker/WoodworkerDetailScreen';
import WoodworkerProfileScreen from '../screens/Woodworker/WoodworkerProfileScreen';
import WoodworkerRegistration from '../screens/Woodworker/WoodworkerRegistration';
import WoodworkerDashboard from '../screens/Woodworker/WoodworkerDashboard';
import AdminScreen from '../screens/Admin/AdminScreen';
import WoodworkerRegistrationManagement from '../screens/Admin/WoodworkerRegistrationManagement';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AdminDashboard"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Pricing" component={PricingScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Design" component={DesignScreen} />
        <Stack.Screen name="Woodworker" component={WoodworkerScreen} />
        <Stack.Screen name="WoodworkerDetail" component={WoodworkerDetailScreen} />
        <Stack.Screen name="WoodworkerProfile" component={WoodworkerProfileScreen} />
        <Stack.Screen 
          name="WoodworkerRegistration" 
          component={WoodworkerRegistration}
        />
        <Stack.Screen 
          name="WoodworkerDashboard" 
          component={WoodworkerDashboard}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="WoodworkerRegistrationManagement" 
          component={WoodworkerRegistrationManagement}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 