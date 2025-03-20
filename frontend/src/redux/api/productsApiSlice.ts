import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { Product } from "../../types";

type MessageResult = {
  msg: string;
};

type CreateProductArg = {
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
};

type UpdateProductArg = {
  id: string;
  data: {
    name?: string;
    image?: string;
    brand?: string;
    category?: string;
    description?: string;
    price?: number;
    countInStock?: number;
  };
};
type GetAllProductsRes = {
  totalProducts: number;
  nbHits: number;
  page: number;
  nextPage: number;
  products: Product[];
};

type GetAllProductsArg = {
  page?: number;
  name?: string;
  category?: string;
  priceGte?: string;
  priceLte?: string;
};

type getNewTopProductsRes = {
  products: Product[];
};
type AddReviewArg = {
  id: string;
  data: {
    title: string;
    comment: string;
    rating: number;
  };
};

type UploadImageRes = {
  msg: string;
  url: string;
};

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<MessageResult, CreateProductArg>({
      query: (data) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateProduct: builder.mutation<MessageResult, UpdateProductArg>({
      query: ({ id, data }) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation<MessageResult, string>({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getAllProducts: builder.query<GetAllProductsRes, GetAllProductsArg>({
      query: ({ page = 1, name, category, priceGte, priceLte }) => ({
        url: `${PRODUCT_URL}?name=${name || ""}&category=${
          category || ""
        }&price[gte]=${priceGte || ""}&price[lte]=${priceLte || ""}&page=${
          page || 1
        }`,
      }),
    }),
    getSingleProduct: builder.query<{ product: Product }, string>({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
      }),
    }),
    getTopProducts: builder.query<getNewTopProductsRes, void>({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
      }),
    }),
    getNewProducts: builder.query<getNewTopProductsRes, void>({
      query: () => ({
        url: `${PRODUCT_URL}/new`,
      }),
    }),
    addReview: builder.mutation<MessageResult, AddReviewArg>({
      query: ({ id, data }) => ({
        url: `${PRODUCT_URL}/review/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    toggleFavoriteProduct: builder.mutation<MessageResult, string>({
      query: (id) => ({
        url: `${PRODUCT_URL}/favorite/${id}`,
        method: "POST",
      }),
    }),
    getFavoriteProducts: builder.query<{ favorites: Product[] }, void>({
      query: () => ({
        url: `${PRODUCT_URL}/favorite`,
      }),
    }),
    uploadProductImage: builder.mutation<UploadImageRes, FormData>({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useAddReviewMutation,
  useToggleFavoriteProductMutation,
  useGetFavoriteProductsQuery,
  useUploadProductImageMutation,
} = productsApiSlice;
