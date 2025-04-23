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

export const complaintApi = createApi({
  reducerPath: "complaintApi",
  baseQuery: asyncStorageBaseQuery,
  endpoints: (builder) => ({
    getAllComplaints: builder.query({
      query: () => ({
        url: "/api/v1/complaints",
        method: "GET",
      }),
    }),
    getUserComplaints: builder.query({
      query: (userId) => ({
        url: `/api/v1/complaints/user/${userId}`,
        method: "GET",
      }),
    }),
    getServiceOrderComplaints: builder.query({
      query: (id) => ({
        url: `/api/v1/complaints/service-order/${id}`,
        method: "GET",
      }),
    }),
    createComplaint: builder.mutation({
      query: (data) => ({
        url: "/api/v1/complaints",
        method: "POST",
        body: data,
      }),
    }),
    updateComplaintWoodworker: builder.mutation({
      query: (data) => ({
        url: "/api/v1/complaints/woodworker",
        method: "PUT",
        body: data,
      }),
    }),
    updateComplaintStaff: builder.mutation({
      query: (data) => ({
        url: "/api/v1/complaints/staff",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllComplaintsQuery,
  useGetUserComplaintsQuery,
  useGetServiceOrderComplaintsQuery,
  useCreateComplaintMutation,
  useUpdateComplaintWoodworkerMutation,
  useUpdateComplaintStaffMutation,
} = complaintApi;
