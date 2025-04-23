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

export const availableServiceApi = createApi({
  reducerPath: "availableServiceApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getAvailableServiceByWwId: builder.query({
      query: (wwId) => ({
        url: `/api/v1/AvailableService/woodworker/${wwId}`,
        method: "GET",
      }),
    }),
    updateAvailableServiceByWwId: builder.mutation({
      query: (data) => ({
        url: `/api/v1/AvailableService`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAvailableServiceByWwIdQuery,
  useUpdateAvailableServiceByWwIdMutation,
} = availableServiceApi;
