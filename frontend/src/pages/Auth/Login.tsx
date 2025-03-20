import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { RootState } from "../../redux/store";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginApiHandler, { isLoading }] = useLoginMutation();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await loginApiHandler({ email, password }).unwrap();
      toast.success(res.msg);
      dispatch(setCredentials(res.tokenUser));
      navigate("/");
    } catch (error: unknown) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className=" max-w-[500px] mx-auto">
      <h2 className="text-white text-center font-semibold text-lg mt-4">
        Sign In
      </h2>
      <form
        onSubmit={submitFormHandler}
        className="text-white flex flex-col gap-1 mx-8"
      >
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-800 "
        />
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent  focus:outline-none focus:ring-1 focus:ring-blue-800 text-white transition"
        />
        <button
          disabled={isLoading}
          className="bg-blue-800 px-3 py-1 mt-3 rounded font-semibold cursor-pointer hover:bg-blue-900 transition-all duration-200"
        >
          Sign In
        </button>
        <p className="mt-2 text-sm">
          New Member?{" "}
          <Link className="text-blue-500 hover:underline" to={"/register"}>
            Register...
          </Link>
        </p>
        {isLoading && <Loader />}
      </form>
    </div>
  );
};
export default Login;
