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

export const designIdeaApi = createApi({
  reducerPath: "designIdeaApi",
  baseQuery: asyncStorageBaseQuery,
  tagTypes: ["DesignIdea"],
  endpoints: (builder) => ({
    addDesignIdea: builder.mutation({
      query: (data) => ({
        url: "/api/v1/designIdea/addDesignIdea",
        method: "POST",
        body: data,
      }),
    }),

    updateDesignIdea: builder.mutation({
      query: (data) => ({
        url: `/api/v1/designIdea/updateDesignIdea`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteDesignIdea: builder.mutation({
      query: (designIdeaId) => ({
        url: `/api/v1/designIdea/${designIdeaId}`,
        method: "DELETE",
      }),
    }),

    getDesignIdeaVariant: builder.query({
      query: (designId) =>
        `/api/v1/designIdea/getDesignIdeaVariantByDesignId/${designId}`,
    }),

    getDesignById: builder.query({
      query: (id) => `/api/v1/designIdea/getDesignById/${id}`,
    }),

    getAllDesignIdeasByWoodworker: builder.query({
      query: (wwId) => `/api/v1/designIdea/getAllDesignIdeasByWWId/${wwId}`,
    }),

    getAllDesignIdeas: builder.query({
      query: () => "/api/v1/designIdea/getAllDesignIdea",
    }),
  }),
});

export const {
  useAddDesignIdeaMutation,
  useUpdateDesignIdeaMutation,
  useDeleteDesignIdeaMutation,
  useGetDesignIdeaVariantQuery,
  useGetDesignByIdQuery,
  useGetAllDesignIdeasByWoodworkerQuery,
  useGetAllDesignIdeasQuery,
} = designIdeaApi;
