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

export const configurationApi = createApi({
  reducerPath: "configurationApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    updateConfiguration: builder.mutation({
      query: (data) => ({
        url: `/api/v1/configuration/update`,
        method: "PUT",
        body: data,
      }),
    }),
    getConfigurationByDescription: builder.mutation({
      query: (data) => ({
        url: `/api/v1/configuration/getByDescription`,
        method: "POST",
        body: data,
      }),
    }),
    getAllConfigurations: builder.query({
      query: () => ({
        url: `/api/v1/configuration/getAll`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useUpdateConfigurationMutation,
  useGetConfigurationByDescriptionMutation,
  useGetAllConfigurationsQuery,
} = configurationApi;
