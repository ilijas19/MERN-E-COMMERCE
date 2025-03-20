import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Navigation from "./pages/layout/Navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/features/auth/authSlice";
import { useGetCurrentUserQuery } from "./redux/api/usersApiSlice";
import { useEffect } from "react";
import Loader from "./components/Loader";

const App = () => {
  const dispatch = useDispatch();

  const { data: user, isLoading, isError } = useGetCurrentUserQuery();
  useEffect(() => {
    if (isLoading) return;
    if (isError) {
      return;
    }
    if (user) {
      dispatch(setCredentials(user.currentUser));
    } else {
      return;
    }
  }, [user]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <ToastContainer />
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
