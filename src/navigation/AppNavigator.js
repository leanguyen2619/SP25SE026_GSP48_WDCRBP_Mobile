import React, { useEffect } from "react";
import { Linking } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";

import AuthPage from "../screens/general/Auth/AuthPage";
import HomePage from "../screens/general/Home/HomePage";
import CartPage from "../screens/customer/Cart/ManagePage/CartPage";
import ProductsPage from "../screens/general/Product/ProductList/ProductsPage";
import ProductDetailPage from "../screens/general/Product/ProductDetail/ProductDetailPage";
import WWRegister from "../screens/general/Auth/WWRegister";
import ContractPage from "../screens/general/Contract/ContractPage";
import DesignsPage from "../screens/general/Design/DesignList/DesignsPage";
import DesignDetailPage from "../screens/general/Design/DesignDetail/DesignDetailPage";
import ServicePackUpgradeGuide from "../screens/general/Pricing/ServicePackUpgradeGuide";
import PaymentSuccessPage from "../screens/general/PaymentSuccess/PaymentSuccessPage";
import SuccessPage from "../screens/general/StatusPage/SuccessPage";
import NotFoundPage from "../screens/general/StatusPage/NotFoundPage";
import ErrorPage from "../screens/general/StatusPage/ErrorPage";
import UnauthorizedPage from "../screens/general/StatusPage/UnauthorizedPage";
import TermsPage from "../screens/general/Terms/TermsPage";
import WoodworkersPage from "../screens/general/Woodworker/WoodworkerList/WoodworkersPage";
import WoodworkerDetailPage from "../screens/general/Woodworker/WoodworkerDetail/WoodworkerDetailPage";
import WoodworkerWelcomePage from "../screens/woodworker/Welcome/WoodworkerWelcomePage";
import WWServiceOrderListPage from "../screens/woodworker/ServiceOrder/ServiceOrderList/WWServiceOrderListPage";
import CusServiceOrderListPage from "../screens/customer/ServiceOrder/ServiceOrderList/CusServiceOrderListPage";
import CusServiceOrderDetailPage from "../screens/customer/ServiceOrder/ServiceOrderDetail/MainPage/CusServiceOrderDetailPage";
import CustomerProfilePage from "../screens/customer/Profile/ManagePage/CustomerProfilePage";
import WWWalletPage from "../screens/woodworker/WalletManagement/WalletList/WWWalletPage";
import CustomerWalletPage from "../screens/customer/WalletManagement/WalletList/CustomerWalletPage";
import WoodworkerProfileManagementPage from "../screens/woodworker/ProfileManagement/ProfilePage/ManagePage/WoodworkerProfileManagementPage";
import PricingPage from "../screens/general/Pricing/PricingPage";
import WWServiceOrderDetailPage from "../screens/woodworker/ServiceOrder/ServiceOrderDetail/MainPage/WWServiceOrderDetailPage";
import PersonalizationRequestPage from "../screens/customer/PersonalizationRequest/PersonalizationRequestPage";
import DesignManagementListPage from "../screens/woodworker/DesignManagement/DesignList/DesignManagementListPage";
import PostManagementListPage from "../screens/woodworker/PostManagement/PostList/PostManagementListPage";
import ProductManagementListPage from "../screens/woodworker/ProductManagement/ProductList/ProductManagementListPage";
import CusGuaranteeOrderListPage from "../screens/customer/GuaranteeOrder/GuaranteeOrderList/CusGuaranteeOrderListPage";
import CusGuaranteeOrderDetailPage from "../screens/customer/GuaranteeOrder/GuaranteeOrderDetail/MainPage/CusGuaranteeOrderDetailPage";
import WWGuaranteeOrderListPage from "../screens/woodworker/GuaranteeOrder/GuaranteeOrderList/WWGuaranteeOrderListPage";
import WWGuaranteeOrderDetailPage from "../screens/woodworker/GuaranteeOrder/GuaranteeOrderDetail/MainPage/WWGuaranteeOrderDetailPage";
import ReviewManagementListPage from "../screens/woodworker/ReviewManagement/ReviewList/ReviewManagementListPage";
import ServiceConfiguration from "../screens/woodworker/ServiceConfiguration/ServiceConfiguration";
import GuaranteeRequestPage from "../screens/customer/GuaranteeRequest/GuaranteeRequestPage";
import CustomerComplaintPage from "../screens/customer/ComplaintManagement/ComplaintList/CustomerComplaintPage";
import WWComplaintManagementPage from "../screens/woodworker/ComplaintManagement/ComplaintList/WWComplaintManagementPage";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { auth } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;

      if (url.includes("payment-success")) {
        const urlObj = new URL(url);
        const params = urlObj.searchParams;

        const allParams = {};
        for (const [key, value] of params.entries()) {
          allParams[key] = value;
        }

        navigation.navigate("PaymentSuccess", allParams);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url && url.includes("payment-success")) {
        handleDeepLink({ url });
      }
    });

    return () => subscription.remove();
  }, [navigation]);

  const getInitialRoute = () => {
    switch (auth?.role) {
      default:
        return "Home";
    }
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{ headerShown: false }}
    >
      {/* Authentication */}
      <Stack.Screen name="Auth" component={AuthPage} />
      <Stack.Screen name="WWRegister" component={WWRegister} />

      {/* General */}
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Products" component={ProductsPage} />
      <Stack.Screen name="ProductDetail" component={ProductDetailPage} />
      <Stack.Screen name="Woodworkers" component={WoodworkersPage} />
      <Stack.Screen name="WoodworkerDetail" component={WoodworkerDetailPage} />
      <Stack.Screen name="Designs" component={DesignsPage} />
      <Stack.Screen name="DesignDetail" component={DesignDetailPage} />
      <Stack.Screen name="Pricing" component={PricingPage} />
      <Stack.Screen name="UpgradeGuide" component={ServicePackUpgradeGuide} />
      <Stack.Screen name="Contract" component={ContractPage} />
      <Stack.Screen name="Terms" component={TermsPage} />
      <Stack.Screen name="Cart" component={CartPage} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessPage} />

      {/* Customer */}
      <Stack.Screen name="CustomerProfile" component={CustomerProfilePage} />
      <Stack.Screen
        name="PersonalizationRequest"
        component={PersonalizationRequestPage}
      />
      <Stack.Screen
        name="CustomerComplaint"
        component={CustomerComplaintPage}
      />
      <Stack.Screen name="CustomerWallet" component={CustomerWalletPage} />
      <Stack.Screen
        name="CustomerServiceOrders"
        component={CusServiceOrderListPage}
      />
      <Stack.Screen
        name="CustomerServiceOrderDetail"
        component={CusServiceOrderDetailPage}
      />
      <Stack.Screen name="GuaranteeRequest" component={GuaranteeRequestPage} />
      <Stack.Screen
        name="CustomerGuaranteeOrders"
        component={CusGuaranteeOrderListPage}
      />
      <Stack.Screen
        name="CustomerGuaranteeOrderDetail"
        component={CusGuaranteeOrderDetailPage}
      />

      {/* Woodworker */}

      <Stack.Screen
        name="WoodworkerWelcome"
        component={WoodworkerWelcomePage}
      />
      <Stack.Screen
        name="DesignManagement"
        component={DesignManagementListPage}
      />
      <Stack.Screen
        name="ProductManagement"
        component={ProductManagementListPage}
      />
      <Stack.Screen name="PostManagement" component={PostManagementListPage} />
      <Stack.Screen name="ServiceConfig" component={ServiceConfiguration} />
      <Stack.Screen
        name="WWComplaintManagement"
        component={WWComplaintManagementPage}
      />
      <Stack.Screen
        name="ReviewManagement"
        component={ReviewManagementListPage}
      />
      <Stack.Screen name="WWWallet" component={WWWalletPage} />
      <Stack.Screen
        name="WoodworkerProfile"
        component={WoodworkerProfileManagementPage}
      />
      <Stack.Screen name="WWServiceOrders" component={WWServiceOrderListPage} />
      <Stack.Screen
        name="WWServiceOrderDetail"
        component={WWServiceOrderDetailPage}
      />
      <Stack.Screen
        name="WWGuaranteeOrders"
        component={WWGuaranteeOrderListPage}
      />
      <Stack.Screen
        name="WWGuaranteeOrderDetail"
        component={WWGuaranteeOrderDetailPage}
      />

      {/* Status Pages */}
      <Stack.Screen name="Success" component={SuccessPage} />
      <Stack.Screen name="NotFound" component={NotFoundPage} />
      <Stack.Screen name="Error" component={ErrorPage} />
      <Stack.Screen name="Unauthorized" component={UnauthorizedPage} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
