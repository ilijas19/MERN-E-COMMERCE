import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

type User = {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  favorites: any[];
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
};

type LoginArguments = {
  email: string;
  password: string;
};

type LoginResult = {
  msg: string;
  tokenUser: {
    username: string;
    email: string;
    userId: string;
    isAdmin: boolean;
  };
};

type RegisterArguments = {
  username: string;
  email: string;
  password: string;
};

type RegisterResult = {
  msg: string;
};

type LogoutResult = {
  msg: string;
};

type GetCurrentUserResult = {
  currentUser: {
    username: string;
    email: string;
    userId: string;
    isAdmin: boolean;
  };
};

type GetUserProfileResult = {
  user: User;
};

type UpdateProfileArg = {
  username?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

type UpdateProfileRes = {
  msg: string;
};

type GetSingleUserRes = {
  user: User;
};

type GetAllUsersArg = {
  page?: number;
  username?: string;
};

type GetAllUsersRes = {
  nbHits: number;
  page: number;
  nextPage: boolean;
  users: User[];
  totalUsers: number;
};

type DelUserByIdRes = {
  msg: string;
};

type UpdUserByIdArg = {
  id: string;
  data: {
    username: string;
    email: string;
  };
};

type UpdUserByIdRes = {
  msg: string;
};

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResult, LoginArguments>({
      query: ({ email, password }) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation<RegisterResult, RegisterArguments>({
      query: ({ username, email, password }) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: { username, email, password },
      }),
    }),
    logout: builder.mutation<LogoutResult, void>({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    getCurrentUser: builder.query<GetCurrentUserResult, void>({
      query: () => ({
        url: `${USERS_URL}/me`,
      }),
    }),
    getUserProfile: builder.query<GetUserProfileResult, void>({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
    }),
    updateProfile: builder.mutation<UpdateProfileRes, UpdateProfileArg>({
      query: (data) => ({
        url: `${USERS_URL}/updateMe`,
        method: "PATCH",
        body: data,
      }),
    }),
    getAllUsers: builder.query<GetAllUsersRes, GetAllUsersArg>({
      query: ({ page = 1, username = "" }) => ({
        url: `${USERS_URL}?page=${page}&username=${username}`,
      }),
    }),
    getSingleUser: builder.query<GetSingleUserRes, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
    }),
    deleteUserById: builder.mutation<DelUserByIdRes, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    updateUserById: builder.mutation<UpdUserByIdRes, UpdUserByIdArg>({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useDeleteUserByIdMutation,
  useUpdateUserByIdMutation,
} = usersApiSlice;
