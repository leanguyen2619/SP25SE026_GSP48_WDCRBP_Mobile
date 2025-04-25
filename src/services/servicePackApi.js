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

export const servicePackApi = createApi({
  reducerPath: "servicePackApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getAllServicePacks: builder.query({
      query: () => ({
        url: "/api/v1/service-pack/list",
        method: "GET",
      }),
    }),
    getServicePackDetail: builder.query({
      query: (id) => ({
        url: `/api/v1/service-pack/detail/${id}`,
        method: "GET",
      }),
    }),
    createServicePack: builder.mutation({
      query: (data) => ({
        url: "/api/v1/service-pack/create",
        method: "POST",
        body: data,
      }),
    }),
    updateServicePack: builder.mutation({
      query: (data) => ({
        url: "/api/v1/service-pack/update",
        method: "PUT",
        body: data,
      }),
    }),
    deleteServicePack: builder.mutation({
      query: (id) => ({
        url: `/api/v1/service-pack/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllServicePacksQuery,
  useGetServicePackDetailQuery,
  useCreateServicePackMutation,
  useUpdateServicePackMutation,
  useDeleteServicePackMutation,
} = servicePackApi;
