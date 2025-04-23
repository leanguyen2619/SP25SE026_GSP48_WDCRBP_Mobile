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

export const orderDepositApi = createApi({
  reducerPath: "orderDepositApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getAllOrderDepositByOrderId: builder.query({
      query: (id) => ({
        url: `/api/v1/OrderDeposit/service-order/${id}`,
        method: "GET",
      }),
    }),
    getAllOrderDepositByGuaranteeOrderId: builder.query({
      query: (id) => ({
        url: `/api/v1/OrderDeposit/guarantee-order/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllOrderDepositByOrderIdQuery,
  useGetAllOrderDepositByGuaranteeOrderIdQuery,
} = orderDepositApi;
