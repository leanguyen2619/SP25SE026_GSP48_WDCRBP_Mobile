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

export const serviceOrderApi = createApi({
  reducerPath: "serviceOrderApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    sendServiceOrderFeedback: builder.mutation({
      query: (data) => ({
        url: `/api/v1/service-orders/feedback`,
        method: "POST",
        body: data,
      }),
    }),

    createPersonalOrder: builder.mutation({
      query: (data) => ({
        url: "/api/v1/service-orders/createPersonalOrder",
        method: "POST",
        body: data,
      }),
    }),

    createCustomizeOrder: builder.mutation({
      query: (data) => ({
        url: "/api/v1/service-orders/createCustomizeOrder",
        method: "POST",
        body: data,
      }),
    }),

    createSaleOrder: builder.mutation({
      query: (data) => ({
        url: "/api/v1/service-orders/createSaleOrder",
        method: "POST",
        body: data,
      }),
    }),

    acceptServiceOrder: builder.mutation({
      query: (data) => ({
        url: `/api/v1/service-orders/accept`,
        method: "POST",
        body: data,
      }),
    }),

    getServiceOrders: builder.query({
      query: ({ id, role }) => ({
        url: "/api/v1/service-orders/listOrder",
        params: { id, role },
      }),
    }),

    getServiceOrderById: builder.query({
      query: (id) => ({
        url: `/api/v1/service-orders/${id}`,
      }),
    }),

    addProductImage: builder.mutation({
      query: ({ serviceId, body }) => ({
        url: `/api/v1/service-orders/addProductImage`,
        method: "POST",
        params: { serviceId },
        body: body, // This will be the array of objects
      }),
    }),

    addFinishProductImage: builder.mutation({
      query: ({ serviceId, body }) => ({
        url: `/api/v1/service-orders/finish-product-image`,
        method: "POST",
        params: { serviceId },
        body: body,
      }),
    }),
  }),
});

export const {
  useSendServiceOrderFeedbackMutation,
  useCreatePersonalOrderMutation,
  useCreateCustomizeOrderMutation,
  useCreateSaleOrderMutation,
  useAcceptServiceOrderMutation,
  useGetServiceOrdersQuery,
  useGetServiceOrderByIdQuery,
  useAddProductImageMutation,
  useAddFinishProductImageMutation,
} = serviceOrderApi;
