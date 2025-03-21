import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PricingScreen from '../screens/PricingScreen';
import HomeScreen from '../screens/Customer/HomeScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import CartScreen from '../screens/Customer/CartScreen';
import DesignScreen from '../screens/Customer/DesignScreen';
import WoodworkerScreen from '../screens/Customer/WoodworkerScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Pricing" component={PricingScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Design" component={DesignScreen} />
        <Stack.Screen name="Woodworker" component={WoodworkerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 