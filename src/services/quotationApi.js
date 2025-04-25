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
export const quotationApi = createApi({
  reducerPath: "quotationApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    saveQuotationDetails: builder.mutation({
      query: (data) => ({
        url: `/api/v1/quotation/save-quotation-details`,
        method: "POST",
        body: data,
      }),
    }),
    getByServiceOrder: builder.mutation({
      query: (data) => ({
        url: `/api/v1/quotation/get-by-service-order`,
        method: "POST",
        body: data,
      }),
    }),
    saveQuotationDetailsForGuarantee: builder.mutation({
      query: (data) => ({
        url: `/api/v1/quotation/guarantee-order/save-quotation-details`,
        method: "POST",
        body: data,
      }),
    }),
    getByGuaranteeOrder: builder.mutation({
      query: (data) => ({
        url: `/api/v1/quotation/guarantee-order/get-by-service-order`,
        method: "POST",
        body: data,
      }),
    }),
    acceptGuaranteeQuotations: builder.mutation({
      query: (data) => ({
        url: `/api/v1/quotation/guarantee-order/accept`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useSaveQuotationDetailsMutation,
  useGetByServiceOrderMutation,
  useGetByGuaranteeOrderMutation,
  useSaveQuotationDetailsForGuaranteeMutation,
  useAcceptGuaranteeQuotationsMutation,
} = quotationApi;
