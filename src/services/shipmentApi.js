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

export const shipmentApi = createApi({
  reducerPath: "shipmentApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getShipmentsByServiceOrderId: builder.query({
      query: (serviceOrderId) => ({
        url: `/api/v1/Shipment/service-order/${serviceOrderId}`,
      }),
    }),
    updateShipmentOrderCode: builder.mutation({
      query: ({ serviceOrderId, orderCode }) => ({
        url: `/api/v1/Shipment/service-order/${serviceOrderId}`,
        method: "PUT",
        body: { orderCode },
      }),
    }),

    // New endpoints for guarantee orders
    getShipmentsByGuaranteeOrderId: builder.query({
      query: (guaranteeOrderId) => ({
        url: `/api/v1/Shipment/guarantee-order/${guaranteeOrderId}`,
      }),
    }),
    updateGuaranteeOrderShipmentOrderCode: builder.mutation({
      query: ({ guaranteeOrderId, ...body }) => ({
        url: `/api/v1/Shipment/guarantee-order/${guaranteeOrderId}`,
        method: "PUT",
        body: body,
      }),
    }),
  }),
});

export const {
  useGetShipmentsByServiceOrderIdQuery,
  useUpdateShipmentOrderCodeMutation,
  useGetShipmentsByGuaranteeOrderIdQuery,
  useUpdateGuaranteeOrderShipmentOrderCodeMutation,
} = shipmentApi;
