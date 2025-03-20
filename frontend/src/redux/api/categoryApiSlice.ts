import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";
import { Category, Product } from "../../types";
type MessageResult = {
  msg: string;
};

//
type CreateArg = {
  name: string;
};
type GetAllCategoriesRes = {
  categories: Category[];
};
type UpdateCategoryArg = {
  id: string;
  data: {
    name: string;
  };
};
export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<MessageResult, CreateArg>({
      query: ({ name }) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: { name },
      }),
    }),
    getAllCategories: builder.query<GetAllCategoriesRes, void>({
      query: () => ({
        url: `${CATEGORY_URL}`,
      }),
    }),
    getSingleCategory: builder.query<{ category: Category }, string>({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
      }),
    }),
    updateCategory: builder.mutation<MessageResult, UpdateCategoryArg>({
      query: ({ id, data }) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteCategory: builder.mutation<MessageResult, string>({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getTop3Categories: builder.query<{ categories: Category[] }, void>({
      query: () => ({
        url: `${CATEGORY_URL}/top3`,
      }),
    }),
    getTopProductsByCategory: builder.query<{ products: Product[] }, string>({
      query: (id) => ({
        url: `${CATEGORY_URL}/products/${id}`,
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetTop3CategoriesQuery,
  useGetTopProductsByCategoryQuery,
} = categoryApiSlice;
