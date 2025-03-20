import { Navigate, Outlet } from "react-router";
import { useGetUserProfileQuery } from "../redux/api/usersApiSlice";
import Loader from "./Loader";
import { setUserDetails } from "../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const PrivateRoute = () => {
  const { data: user, isLoading } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: false, // Force refetch on mount
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(setUserDetails(user.user));
    }
  }, [user, dispatch]);

  if (isLoading) {
    return <Loader size="large" />;
  }

  if (user) {
    return <Outlet />;
  }

  return <Navigate to={"/login"} replace />;
};
export default PrivateRoute;
