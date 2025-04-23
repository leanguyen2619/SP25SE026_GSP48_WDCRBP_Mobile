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
export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: asyncStorageBaseQuery,
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPostById: builder.query({
      query: (id) => ({
        url: `/api/v1/posts/${id}`,
        method: "GET",
      }),
    }),
    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/posts/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/api/v1/posts/${id}`,
        method: "DELETE",
      }),
    }),
    getAllPosts: builder.query({
      query: () => ({
        url: `/api/v1/posts`,
        method: "GET",
      }),
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: `/api/v1/posts`,
        method: "POST",
        body: data,
      }),
    }),
    getWoodworkerPosts: builder.query({
      query: (wwId) => ({
        url: `/api/v1/posts/woodworker/${wwId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetAllPostsQuery,
  useCreatePostMutation,
  useGetWoodworkerPostsQuery,
} = postApi;
