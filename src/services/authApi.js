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

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    loginWithPassword: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    loginWithOTP: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/login-otp",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    refreshToken: builder.mutation({
      query: async () => {
        try {
          const authData = await AsyncStorage.getItem("auth");
          const auth = authData ? JSON.parse(authData) : null;

          return {
            url: "/api/v1/auth/refresh-token",
            method: "POST",
            headers: {
              Authorization: `Bearer ${auth?.refreshToken}`,
            },
          };
        } catch (error) {
          console.error("Error retrieving refresh token:", error);
          return {
            url: "/api/v1/auth/refresh-token",
            method: "POST",
          };
        }
      },
    }),
    sendOTP: builder.mutation({
      query: (email) => ({
        url: `/api/v1/auth/send-otp?email=${email}`,
        method: "POST",
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/verification-otp",
        method: "POST",
        body: data,
      }),
    }),
    getUserInformation: builder.query({
      query: (id) => `/api/v1/user/getUserInformationById/${id}`,
    }),
    resetPassword: builder.mutation({
      query: (postData) => ({
        url: `/api/v1/auth/reset-password?email=${postData.email}&otp=${postData.otp}`,
        method: "POST",
        body: {
          newPassword: postData.newPassword,
          confirmPassword: postData.confirmPassword,
        },
      }),
    }),
  }),
});

export const {
  useLoginWithPasswordMutation,
  useLoginWithOTPMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
  useGetUserInformationQuery,
  useResetPasswordMutation,
} = authApi;
