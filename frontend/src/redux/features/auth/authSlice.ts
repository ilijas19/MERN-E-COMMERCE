import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserType, UserDetailsType, AuthStateType } from "../../../types";

const initialState: AuthStateType = {
  currentUser: null,
  userDetails: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserType>) => {
      state.currentUser = action.payload;
    },
    setUserDetails: (state, action: PayloadAction<UserDetailsType>) => {
      state.userDetails = action.payload;
    },
    toggleFromFavorite: (state, action: PayloadAction<{ id: string }>) => {
      if (state.userDetails && state.userDetails.favorites) {
        const isFavorite = state.userDetails.favorites.some(
          (fav) => fav === action.payload.id
        );

        if (isFavorite) {
          state.userDetails.favorites = state.userDetails.favorites.filter(
            (fav) => fav !== action.payload.id
          );
        } else {
          state.userDetails.favorites.push(action.payload.id);
        }
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.userDetails = null;
    },
  },
});

export const { setCredentials, setUserDetails, logout, toggleFromFavorite } =
  authSlice.actions;
export default authSlice.reducer;
