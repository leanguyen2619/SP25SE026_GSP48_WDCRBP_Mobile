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

export const twilioApi = createApi({
  reducerPath: "twilioApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    startVerification: builder.mutation({
      query: (data) => ({
        url: "/api/v1/otp/start-verification",
        method: "POST",
        body: data,
      }),
    }),
    checkVerification: builder.mutation({
      query: (data) => ({
        url: "/api/v1/otp/check-verification",
        method: "POST",
        body: data,
      }),
    }),
    fetchVerification: builder.query({
      query: (sid) => ({
        url: `/api/v1/otp/fetch-verification/${sid}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useStartVerificationMutation,
  useCheckVerificationMutation,
  useFetchVerificationQuery,
} = twilioApi;
