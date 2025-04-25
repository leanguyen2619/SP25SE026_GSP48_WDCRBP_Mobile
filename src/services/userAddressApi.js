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

export const userAddressApi = createApi({
  reducerPath: "userAddressApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getAllUserAddresses: builder.query({
      query: () => ({
        url: `/api/v1/useraddresses/`,
        method: "GET",
      }),
    }),
    getUserAddressById: builder.query({
      query: (id) => ({
        url: `/api/v1/useraddresses/${id}`,
        method: "GET",
      }),
    }),
    getUserAddressesByUserId: builder.query({
      query: (userId) => ({
        url: `/api/v1/useraddresses/user/${userId}`,
        method: "GET",
      }),
    }),
    createUserAddress: builder.mutation({
      query: (data) => ({
        url: `/api/v1/useraddresses/create`,
        method: "POST",
        body: data,
      }),
    }),
    updateUserAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/useraddresses/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteUserAddress: builder.mutation({
      query: (id) => ({
        url: `/api/v1/useraddresses/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllUserAddressesQuery,
  useGetUserAddressByIdQuery,
  useGetUserAddressesByUserIdQuery,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} = userAddressApi;
