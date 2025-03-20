import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../constants";
import { Order, OrderItemArg } from "../../types";

type MessageResult = {
  msg: string;
};

type OrderResult = {
  msg: string;
  orderId: string;
};

type CreateOrderArg = {
  orderItems: OrderItemArg[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  itemsPrice: number;
};

type GetMyOrdersRes = {
  nbHits: number;
  orders: Order[];
};

type UpdateStatusArg = {
  id: string;
  status: string;
};

type GetAllOrdersArg = {
  page: number;
  shippingStatus: string;
};

type GetAllOrdersRes = {
  nbHits: number;
  page: number;
  nextPage: number | null;
  orders: Order[];
};

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResult, CreateOrderArg>({
      query: (orderData) => ({
        url: `${ORDER_URL}`,
        method: "POST",
        body: orderData,
      }),
    }),
    getMyOrders: builder.query<GetMyOrdersRes, void>({
      query: () => ({
        url: `${ORDER_URL}`,
      }),
    }),
    getSingleOrder: builder.query<{ order: Order }, string>({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
      }),
    }),
    cancelOrder: builder.mutation<MessageResult, { id: string }>({
      query: ({ id }) => ({
        url: `${ORDER_URL}/${id}`,
        method: "POST",
        body: { id },
      }),
    }),
    //admin
    getAllOrders: builder.query<GetAllOrdersRes, GetAllOrdersArg>({
      query: ({ page = 1, shippingStatus = "" }) => ({
        url: `${ORDER_URL}/all?page=${page}&shippingStatus=${shippingStatus}`,
      }),
    }),
    updateOrderStatus: builder.mutation<MessageResult, UpdateStatusArg>({
      query: ({ id, status }) => ({
        url: `${ORDER_URL}/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
    }),
    deleteOrder: builder.mutation<MessageResult, string>({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    countTotalOrders: builder.query<{ totalOrders: number }, void>({
      query: () => ({
        url: `${ORDER_URL}/total-orders`,
      }),
    }),
    countTotalSales: builder.query<{ totalSales: number }, void>({
      query: () => ({
        url: `${ORDER_URL}/total-sales`,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetSingleOrderQuery,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useCountTotalOrdersQuery,
  useCountTotalSalesQuery,
} = ordersApiSlice;
