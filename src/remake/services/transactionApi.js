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

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getAllTransactions: builder.query({
      query: () => ({
        url: "/api/v1/transaction/all",
        method: "GET",
      }),
    }),
    getTransactionById: builder.query({
      query: (transactionId) => ({
        url: `/api/v1/transaction/${transactionId}`,
        method: "GET",
      }),
    }),
    getUserTransactions: builder.query({
      query: (userId) => ({
        url: `/api/v1/transaction/user/${userId}`,
        method: "GET",
      }),
    }),
    getTransactionStatus: builder.query({
      query: () => ({
        url: "/api/v1/transaction/status",
        method: "GET",
      }),
    }),
    updateTransactionStatus: builder.mutation({
      query: (data) => ({
        url: "/api/v1/transaction/update-status",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetUserTransactionsQuery,
  useGetTransactionStatusQuery,
  useUpdateTransactionStatusMutation,
} = transactionApi;
