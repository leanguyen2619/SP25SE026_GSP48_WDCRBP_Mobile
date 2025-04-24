import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../services/authApi";
import { woodworkerApi } from "../services/woodworkerApi";
import { designIdeaApi } from "../services/designIdeaApi";
import { ghnApi } from "../services/ghnApi";
import { servicePackApi } from "../services/servicePackApi";
import { walletApi } from "../services/walletApi";
import { transactionApi } from "../services/transactionApi";
import { twilioApi } from "../services/twilioApi";
import { paymentApi } from "../services/paymentApi";
import { userApi } from "../services/userApi";
import { decryptApi } from "../services/decryptApi";
import { categoryApi } from "../services/categoryApi";
import { availableServiceApi } from "../services/availableServiceApi";
import { reviewApi } from "../services/reviewApi";
import { postApi } from "../services/postApi";
import { userAddressApi } from "../services/userAddressApi";
import { serviceOrderApi } from "../services/serviceOrderApi";
import { productApi } from "../services/productApi";
import { techSpecApi } from "../services/techSpecApi";
import { orderProgressApi } from "../services/orderProgressApi";
import { orderDepositApi } from "../services/orderDepositApi";
import { contractApi } from "../services/contractApi";
import { shipmentApi } from "../services/shipmentApi";
import { quotationApi } from "../services/quotationApi";
import { configurationApi } from "../services/configurationApi";
import { guaranteeOrderApi } from "../services/guaranteeOrderApi";
import { complaintApi } from "../services/complaintApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [woodworkerApi.reducerPath]: woodworkerApi.reducer,
    [designIdeaApi.reducerPath]: designIdeaApi.reducer,
    [ghnApi.reducerPath]: ghnApi.reducer,
    [servicePackApi.reducerPath]: servicePackApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [twilioApi.reducerPath]: twilioApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [decryptApi.reducerPath]: decryptApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [availableServiceApi.reducerPath]: availableServiceApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [userAddressApi.reducerPath]: userAddressApi.reducer,
    [serviceOrderApi.reducerPath]: serviceOrderApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [techSpecApi.reducerPath]: techSpecApi.reducer,
    [orderProgressApi.reducerPath]: orderProgressApi.reducer,
    [orderDepositApi.reducerPath]: orderDepositApi.reducer,
    [contractApi.reducerPath]: contractApi.reducer,
    [shipmentApi.reducerPath]: shipmentApi.reducer,
    [quotationApi.reducerPath]: quotationApi.reducer,
    [configurationApi.reducerPath]: configurationApi.reducer,
    [guaranteeOrderApi.reducerPath]: guaranteeOrderApi.reducer,
    [complaintApi.reducerPath]: complaintApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      woodworkerApi.middleware,
      designIdeaApi.middleware,
      ghnApi.middleware,
      servicePackApi.middleware,
      walletApi.middleware,
      transactionApi.middleware,
      twilioApi.middleware,
      paymentApi.middleware,
      userApi.middleware,
      decryptApi.middleware,
      categoryApi.middleware,
      availableServiceApi.middleware,
      reviewApi.middleware,
      postApi.middleware,
      userAddressApi.middleware,
      serviceOrderApi.middleware,
      productApi.middleware,
      techSpecApi.middleware,
      orderProgressApi.middleware,
      orderDepositApi.middleware,
      contractApi.middleware,
      shipmentApi.middleware,
      quotationApi.middleware,
      configurationApi.middleware,
      guaranteeOrderApi.middleware,
      complaintApi.middleware
    ),
});
