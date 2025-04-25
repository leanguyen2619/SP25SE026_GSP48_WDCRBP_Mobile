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

export const orderProgressApi = createApi({
  reducerPath: "orderProgressApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getAllOrderProgressByOrderId: builder.query({
      query: (id) => ({
        url: `/api/v1/OderProgress/service-order/${id}`,
        method: "GET",
      }),
    }),
    getAllOrderProgressByGuaranteeOrderId: builder.query({
      query: (id) => ({
        url: `/api/v1/OderProgress/guarantee-order/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllOrderProgressByOrderIdQuery,
  useGetAllOrderProgressByGuaranteeOrderIdQuery,
} = orderProgressApi;
