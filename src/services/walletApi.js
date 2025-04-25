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

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getUserWallet: builder.query({
      query: (userId) => ({
        url: `/api/v1/wallet/user/${userId}`,
        method: "GET",
      }),
    }),
    updateWallet: builder.mutation({
      query: (data) => ({
        url: "/api/v1/wallet/update",
        method: "PUT",
        body: data,
      }),
    }),
    servicePackPayment: builder.mutation({
      query: (data) => ({
        url: "/api/v1/wallet/service/pack/payment",
        method: "POST",
        body: data,
      }),
    }),
    orderPayment: builder.mutation({
      query: (data) => ({
        url: "/api/v1/wallet/order/payment",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserWalletQuery,
  useUpdateWalletMutation,
  useServicePackPaymentMutation,
  useOrderPaymentMutation,
} = walletApi;
