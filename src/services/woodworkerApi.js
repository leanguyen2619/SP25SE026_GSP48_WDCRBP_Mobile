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

export const woodworkerApi = createApi({
  reducerPath: "woodworkerApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    listWoodworkers: builder.query({
      query: () => "/api/v1/ww",
    }),

    getWoodworkerById: builder.query({
      query: (wwId) => `/api/v1/ww/${wwId}`,
    }),

    getWoodworkerByUserId: builder.query({
      query: (userId) => `/api/v1/ww/user/${userId}`,
    }),

    getInactiveWoodworkers: builder.query({
      query: () => "/api/v1/ww/inactive",
    }),

    registerWoodworker: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ww/ww-register",
        method: "POST",
        body: data,
      }),
    }),

    updateWoodworkerStatus: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ww/ww-update-status",
        method: "PUT",
        body: data,
      }),
    }),

    updateWoodworkerPublicStatus: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ww/update-public-status",
        method: "PUT",
        body: data,
      }),
    }),

    addServicePack: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ww/addServicePack",
        method: "PUT",
        body: data,
      }),
    }),

    addServicePackById: builder.mutation({
      query: ({ wwId, ...data }) => ({
        url: `/api/v1/ww/addServicePack/${wwId}`,
        method: "POST",
        body: data,
      }),
    }),

    updateWoodworkerProfile: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ww/update-woodworker-profile",
        method: "PUT",
        body: data,
      }),
    }),

    updateWarrantyPolicy: builder.mutation({
      query: (data) => ({
        url: "/api/v1/ww/update-warranty-policy",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useListWoodworkersQuery,
  useGetWoodworkerByUserIdQuery,
  useGetWoodworkerByIdQuery,
  useGetInactiveWoodworkersQuery,
  useRegisterWoodworkerMutation,
  useUpdateWoodworkerStatusMutation,
  useUpdateWoodworkerPublicStatusMutation,
  useAddServicePackMutation,
  useAddServicePackByIdMutation,
  useUpdateWoodworkerProfileMutation,
  useUpdateWarrantyPolicyMutation,
} = woodworkerApi;
