import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useAuth from "../hooks/useAuth";

import AuthPage from "../pages/general/Auth/AuthPage";
import HomePage from "../pages/general/Home/HomePage";
import CartPage from "../pages/customer/Cart/ManagePage/CartPage";
import ProductsPage from "../pages/general/Product/ProductList/ProductsPage";
import ProductDetailPage from "../pages/general/Product/ProductDetail/ProductDetailPage";
import WWRegister from "../pages/general/Auth/WWRegister";
import ContractPage from "../pages/general/Contract/ContractPage";
import DesignsPage from "../pages/general/Design/DesignList/DesignsPage";
import DesignDetailPage from "../pages/general/Design/DesignDetail/DesignDetailPage";
import Pricing from "../pages/general/Pricing/Pricing";
import ServicePackUpgradeGuide from "../pages/general/Pricing/ServicePackUpgradeGuide";
import PaymentSuccessPage from "../pages/general/PaymentSuccess/PaymentSuccessPage";
import SuccessPage from "../pages/general/StatusPage/SuccessPage";
import NotFoundPage from "../pages/general/StatusPage/NotFoundPage";
import ErrorPage from "../pages/general/StatusPage/ErrorPage";
import UnauthorizedPage from "../pages/general/StatusPage/UnauthorizedPage";
import TermsPage from "../pages/general/Terms/TermsPage";
import WoodworkersPage from "../pages/general/Woodworker/WoodworkerList/WoodworkersPage";
import WoodworkerDetailPage from "../pages/general/Woodworker/WoodworkerDetail/WoodworkerDetailPage";
import WoodworkerWelcomePage from "../pages/woodworker/Welcome/WoodworkerWelcomePage";
import WWServiceOrderListPage from "../pages/woodworker/ServiceOrder/ServiceOrderList/WWServiceOrderListPage";
// import WWServiceOrderDetailPage from "../pages/woodworker/ServiceOrder/ServiceOrderDetail/MainPage/WWServiceOrderDetailPage";
import WoodworkerLayout from "../layouts/WoodworkerLayout";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { auth } = useAuth();

  const getInitialRoute = () => {
    switch (auth?.role) {
      case "Woodworker":
        return "WoodworkerWelcome";
      case "Customer":
        return "Home";
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
      <Stack.Screen name="Pricing" component={Pricing} />
      <Stack.Screen name="UpgradeGuide" component={ServicePackUpgradeGuide} />
      <Stack.Screen name="Contract" component={ContractPage} />
      <Stack.Screen name="Terms" component={TermsPage} />
      <Stack.Screen name="Cart" component={CartPage} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessPage} />

      {/* Customer */}
      {/* <Stack.Screen name="CustomerProfile" component={CustomerProfilePage} /> */}
      {/* <Stack.Screen
        name="PersonalizationRequest"
        component={PersonalizationRequestPage}
      /> */}
      {/* <Stack.Screen
        name="CustomerComplaint"
        component={CustomerComplaintPage}
      /> */}
      {/* <Stack.Screen name="CustomerWallet" component={CustomerWalletPage} /> */}
      {/* <Stack.Screen
        name="CustomerServiceOrders"
        component={CusServiceOrderListPage}
      /> */}
      {/* <Stack.Screen
        name="CustomerServiceOrderDetail"
        component={CusServiceOrderDetailPage}
      /> */}
      {/* <Stack.Screen name="GuaranteeRequest" component={GuaranteeRequestPage} /> */}
      {/* <Stack.Screen
        name="CustomerGuaranteeOrders"
        component={CusGuaranteeOrderListPage}
      /> */}
      {/* <Stack.Screen
        name="CustomerGuaranteeOrderDetail"
        component={CusGuaranteeOrderDetailPage}
      /> */}

      {/* Woodworker */}
      <Stack.Screen
        name="WoodworkerWelcome"
        component={WoodworkerWelcomePage}
      />
      {/* <Stack.Screen
        name="DesignManagement"
        component={DesignManagementListPage}
      /> */}
      {/* <Stack.Screen
        name="ProductManagement"
        component={ProductManagementListPage}
      /> */}
      {/* <Stack.Screen name="PostManagement" component={PostManagementListPage} /> */}
      {/* <Stack.Screen name="ServiceConfig" component={ServiceConfiguration} /> */}
      {/* <Stack.Screen
        name="WWComplaintManagement"
        component={WWComplaintManagementPage}
      /> */}
      {/* <Stack.Screen
        name="ReviewManagement"
        component={ReviewManagementListPage}
      /> */}
      {/* <Stack.Screen name="WWWallet" component={WWWalletPage} /> */}
      {/* <Stack.Screen
        name="WoodworkerProfile"
        component={WoodworkerProfileManagementPage}
      /> */}
      <Stack.Screen name="WWServiceOrders" component={WWServiceOrderListPage} />
      {/* <Stack.Screen
        name="WWServiceOrderDetail"
        component={(props) => (
          <WoodworkerLayout>
            <WWServiceOrderDetailPage {...props} />
          </WoodworkerLayout>
        )}
      /> */}
      {/* <Stack.Screen
        name="WWGuaranteeOrders"
        component={WWGuaranteeOrderListPage}
      /> */}
      {/* <Stack.Screen
        name="WWGuaranteeOrderDetail"
        component={WWGuaranteeOrderDetailPage}
      /> */}

      {/* Status Pages */}
      <Stack.Screen name="Success" component={SuccessPage} />
      <Stack.Screen name="NotFound" component={NotFoundPage} />
      <Stack.Screen name="Error" component={ErrorPage} />
      <Stack.Screen name="Unauthorized" component={UnauthorizedPage} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
