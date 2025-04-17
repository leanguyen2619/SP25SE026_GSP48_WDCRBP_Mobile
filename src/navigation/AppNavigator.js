import React, { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationContainerRef } from '@react-navigation/native';
import { decrypt } from '../utils/AESUtil';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';
import ProductScreen from '../screens/Customer/ProductScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import PricingScreen from '../screens/PricingScreen';
import CartScreen from '../screens/Customer/CartScreen';
import DesignIdeaScreen from '../screens/Customer/DesignIdeaScreen';
import DesignIdeaDetailScreen from '../screens/Customer/DesignIdeaDetailScreen';
import WoodworkerScreen from '../screens/Customer/WoodworkerScreen';
import WoodworkerDetailScreen from '../screens/Customer/WoodworkerDetailScreen';
import WoodworkerProfileScreen from '../screens/Woodworker/WoodworkerProfileScreen';
import WalletScreen from '../screens/Payment/WalletScreen';
import PaymentSuccessScreen from '../screens/Payment/PaymentSuccessScreen';
import WoodworkerRegistration from '../screens/Woodworker/WoodworkerRegistration';
import WoodworkerDashboard from '../screens/Woodworker/WoodworkerDashboard';
import AdminScreen from '../screens/Admin/AdminScreen';
import WoodworkerRegistrationManagement from '../screens/Admin/WoodworkerRegistrationManagement';
import WoodworkerRegistrationDetail from '../screens/Admin/WoodworkerRegistrationDetail';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userRole, isLoading } = useAuth();
  const navigationRef = useNavigationContainerRef();

  const getInitialRoute = () => {
    if (!userRole) return 'Login';
    switch (userRole) {
      case 'Admin': return 'AdminDashboard';
      case 'Woodworker': return 'WoodworkerDashboard';
      case 'Customer': return 'Product';
      default: return 'Login';
    }
  };

  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      if (!url) return;

      const parsed = Linking.parse(url);
      const { hostname, queryParams } = parsed;
      console.log('🔗 Deep Link Received:', url);
      console.log('📦 Host:', hostname);
      console.log('🧾 Query Params:', queryParams);

      // Optional: Decrypt params if your backend encrypted them
      const decryptIfNeeded = (val) => {
        try {
          return decrypt(val);
        } catch (e) {
          return val;
        }
      };

      const transactionId = decryptIfNeeded(queryParams.TransactionId);
      const walletId = decryptIfNeeded(queryParams.WalletId);
      const orderDepositId = decryptIfNeeded(queryParams.OrderDepositId);
      const woodworkerId = decryptIfNeeded(queryParams.WoodworkerId);
      const servicePackId = decryptIfNeeded(queryParams.ServicePackId);

      if (hostname === 'payment-success' || hostname === 'wallet-topup-success' || hostname === 'service-pack-success') {
        navigationRef.navigate('PaymentSuccess', {
          transactionId,
          walletId,
          orderDepositId,
          woodworkerId,
          servicePackId,
        });
      } else {
        Alert.alert('Unrecognized deep link', url);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  if (isLoading) return null;

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{ headerShown: false }}
    >
      {/* Auth */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />

      {/* Customer */}
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Pricing" component={PricingScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Design" component={DesignIdeaScreen} />
      <Stack.Screen name="DesignDetail" component={DesignIdeaDetailScreen} />
      <Stack.Screen name="Woodworker" component={WoodworkerScreen} />
      <Stack.Screen name="WoodworkerDetail" component={WoodworkerDetailScreen} />
      <Stack.Screen name="WoodworkerProfile" component={WoodworkerProfileScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />

      {/* Payment */}
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />

      {/* Woodworker */}
      <Stack.Screen name="WoodworkerRegistration" component={WoodworkerRegistration} />
      <Stack.Screen name="WoodworkerDashboard" component={WoodworkerDashboard} />

      {/* Admin */}
      <Stack.Screen name="AdminDashboard" component={AdminScreen} />
      <Stack.Screen name="WoodworkerRegistrationManagement" component={WoodworkerRegistrationManagement} />
      <Stack.Screen name="WoodworkerRegistrationDetail" component={WoodworkerRegistrationDetail} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
