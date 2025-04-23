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

export const contractApi = createApi({
  reducerPath: "contractApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getContractByServiceOrderId: builder.query({
      query: (id) => ({
        url: `/api/v1/Contract/getContractByserviceorderId/${id}`,
        method: "GET",
      }),
    }),

    createContractCustomize: builder.mutation({
      query: (data) => ({
        url: "/api/v1/Contract/createContractCustomize",
        method: "POST",
        body: data,
      }),
    }),

    cusSignContract: builder.mutation({
      query: (data) => ({
        url: `/api/v1/Contract/customer-sign`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetContractByServiceOrderIdQuery,
  useCreateContractCustomizeMutation,
  useCusSignContractMutation,
} = contractApi;
