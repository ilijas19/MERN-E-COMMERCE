import { Outlet, Navigate } from "react-router";
import { useGetUserProfileQuery } from "../redux/api/usersApiSlice";
import Loader from "./Loader";
const AdminRoute = () => {
  const { data: user, isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (user) {
    if (user.user.isAdmin) {
      return <Outlet />;
    } else {
      return <Navigate to={"/"} />;
    }
  } else {
    return <Navigate to={"/login"} />;
  }
};
export default AdminRoute;
