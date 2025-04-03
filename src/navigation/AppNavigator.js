import React from 'react';
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
import WoodworkerScreen from '../screens/Customer/WoodworkerScreen';
import WoodworkerDetailScreen from '../screens/Woodworker/WoodworkerDetailScreen';
import WoodworkerProfileScreen from '../screens/Woodworker/WoodworkerProfileScreen';
import WoodworkerRegistration from '../screens/Woodworker/WoodworkerRegistration';
import WoodworkerDashboard from '../screens/Woodworker/WoodworkerDashboard';
import AdminScreen from '../screens/Admin/AdminScreen';
import WoodworkerRegistrationManagement from '../screens/Admin/WoodworkerRegistrationManagement';
import WoodworkerRegistrationDetail from '../screens/Admin/WoodworkerRegistrationDetail';
import ProductScreen from '../screens/Customer/ProductScreen';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userRole, isLoading } = useAuth();

  // Xác định màn hình khởi đầu dựa trên role
  const getInitialRoute = () => {
    if (!userRole) return 'Login';
    switch (userRole) {
      case 'Admin':
        return 'AdminDashboard';
      case 'Woodworker':
        return 'WoodworkerDashboard';
      case 'Customer':
        return 'Home';
      default:
        return 'Login';
    }
  };

  if (isLoading) {
    return null; // hoặc loading screen
  }

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Auth screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />

      {/* Customer screens */}
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Pricing" component={PricingScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Design" component={DesignScreen} />
      <Stack.Screen name="Woodworker" component={WoodworkerScreen} />
      <Stack.Screen name="WoodworkerDetail" component={WoodworkerDetailScreen} />
      <Stack.Screen name="WoodworkerProfile" component={WoodworkerProfileScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />

      
      {/* Woodworker screens */}
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

      {/* Admin screens */}
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
      <Stack.Screen 
        name="WoodworkerRegistrationDetail" 
        component={WoodworkerRegistrationDetail}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 