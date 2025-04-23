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

export const guaranteeOrderApi = createApi({
  reducerPath: "guaranteeOrderApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getGuaranteeOrders: builder.query({
      query: (params) => ({
        url: `/api/v1/guarantee-orders`,
        method: "GET",
        params,
      }),
    }),
    createGuaranteeOrder: builder.mutation({
      query: (data) => ({
        url: `/api/v1/guarantee-orders`,
        method: "POST",
        body: data,
      }),
    }),
    submitFeedback: builder.mutation({
      query: (data) => ({
        url: `/api/v1/guarantee-orders/feedback`,
        method: "POST",
        body: data,
      }),
    }),
    acceptGuaranteeOrder: builder.mutation({
      query: (data) => ({
        url: `/api/v1/guarantee-orders/accept`,
        method: "POST",
        body: data,
      }),
    }),
    confirmReceiveProduct: builder.mutation({
      query: (data) => ({
        url: `/api/v1/guarantee-orders/receive-confirmation`,
        method: "POST",
        body: data,
      }),
    }),
    finishConfirmation: builder.mutation({
      query: (data) => ({
        url: `/api/v1/guarantee-orders/finish-confirmation`,
        method: "POST",
        body: data,
      }),
    }),
    getGuaranteeOrderById: builder.query({
      query: (id) => `/api/v1/guarantee-orders/${id}`,
    }),
    acceptFreeGuaranteeOrder: builder.mutation({
      query: (guaranteeOrderId) => ({
        url: `/api/v1/guarantee-orders/accept-free`,
        method: "POST",
        params: { guaranteeOrderId },
      }),
    }),
  }),
});

export const {
  useGetGuaranteeOrdersQuery,
  useCreateGuaranteeOrderMutation,
  useSubmitFeedbackMutation,
  useAcceptGuaranteeOrderMutation,
  useGetGuaranteeOrderByIdQuery,
  useConfirmReceiveProductMutation,
  useFinishConfirmationMutation,
  useAcceptFreeGuaranteeOrderMutation,
} = guaranteeOrderApi;
