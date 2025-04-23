import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a custom baseQuery function that retrieves auth token from AsyncStorage
const asyncStorageBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: async (headers, { getState }) => {
    try {
      // Get auth data from AsyncStorage asynchronously
      const authData = await AsyncStorage.getItem("auth");
      const auth = authData ? JSON.parse(authData) : null;

      if (auth?.token) {
        headers.set("authorization", `Bearer ${auth.token}`);
      }
      return headers;
    } catch (error) {
      console.error("Error retrieving auth from AsyncStorage:", error);
      return headers;
    }
  },
});

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    topUpWallet: builder.mutation({
      query: (data) => ({
        url: "/api/v1/payment/top-up-wallet",
        method: "POST",
        body: data,
      }),
    }),
    payServicePack: builder.mutation({
      query: (data) => ({
        url: "/api/v1/payment/pay-service-pack",
        method: "POST",
        body: data,
      }),
    }),
    createPayment: builder.mutation({
      query: (data) => ({
        url: "/api/v1/payment/create-payment",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useTopUpWalletMutation,
  usePayServicePackMutation,
  useCreatePaymentMutation,
} = paymentApi;
