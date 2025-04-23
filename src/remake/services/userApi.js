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

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getUserInformation: builder.query({
      query: (id) => ({
        url: `/api/v1/user/getUserInformationById/${id}`,
        method: "GET",
      }),
    }),
    updateUserInformation: builder.mutation({
      query: (data) => ({
        url: `/api/v1/user/update-profile`,
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/api/v1/user/change-password/${userId}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserInformationQuery,
  useUpdateUserInformationMutation,
  useChangePasswordMutation,
} = userApi;
