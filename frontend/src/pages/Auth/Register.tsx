import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import { isApiError } from "../../utils/isApiError";
import Loader from "../../components/Loader";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [registerApiHandler, { isLoading }] = useRegisterMutation();

  const navigate = useNavigate();

  const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await registerApiHandler({
        username,
        email,
        password,
      }).unwrap();
      toast.success(res.msg);
      navigate("/login");
    } catch (error: unknown) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <div className=" max-w-[500px] mx-auto">
      <h2 className="text-white text-center font-semibold text-lg mt-4">
        Register
      </h2>
      <form
        onSubmit={submitFormHandler}
        className="text-white flex flex-col gap-1 mx-8"
      >
        <label htmlFor="username">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-800 "
        />
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
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent  focus:outline-none focus:ring-1 focus:ring-blue-800 text-white transition"
        />
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-800 px-3 py-1 mt-3 rounded font-semibold cursor-pointer hover:bg-blue-900 transition-all duration-200"
        >
          Register
        </button>
        <p className="mt-2 text-sm">
          Already a Member?{" "}
          <Link className="text-blue-500 hover:underline" to={"/login"}>
            Login...
          </Link>
        </p>
        {isLoading && <Loader />}
      </form>
    </div>
  );
};
export default Register;
