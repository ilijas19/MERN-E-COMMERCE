import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import React, { useEffect, useState } from "react";
import { useUpdateProfileMutation } from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { formatDate } from "../../utils/formatString";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { Link } from "react-router";

const Profile = () => {
  const { userDetails } = useSelector((state: RootState) => state.auth);
  const [updateApiHandler, { isLoading }] = useUpdateProfileMutation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [isPasswordTabOpen, setPasswordTabOpen] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updateApiHandler({
        username,
        email,
        oldPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      }).unwrap();
      console.log(res);
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast("Something Went Wrong");
      }
    }
  };

  const toggleProfileTab = () => {
    setPasswordTabOpen(!isPasswordTabOpen);

    if (isPasswordTabOpen) {
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }

    if (!isPasswordTabOpen) {
      setUsername(userDetails?.username || "");
      setEmail(userDetails?.email || "");
    }
  };

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || "");
      setEmail(userDetails.email || "");
    }
  }, [userDetails]);

  return (
    <section className="text-white max-w-[500px] mx-auto">
      <h2 className="text-center font-semibold text-lg mt-4">
        {isPasswordTabOpen ? "Change Password" : "Profile Info"}
      </h2>
      <form
        onSubmit={submitFormHandler}
        className="text-white flex flex-col gap-1 mx-8"
      >
        {isPasswordTabOpen ? (
          <>
            <label htmlFor="oldPassword">Old Password</label>
            <input
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              type="password" // Use type="password" for password fields
              className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
            <label htmlFor="newPassword">New Password</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              type="password"
              className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
          </>
        ) : (
          <>
            <label htmlFor="username">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
            <label htmlFor="createdAt">Created At</label>
            <input
              disabled
              placeholder={formatDate(userDetails?.createdAt ?? "")}
              type="text"
              className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
            <label htmlFor="role">Role</label>
            <input
              disabled
              placeholder={userDetails?.isAdmin ? "Admin" : "User"}
              type="text"
              className="w-full border border-gray-700 rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
          </>
        )}

        <div className="flex justify-between">
          <button
            disabled={isLoading}
            className="bg-blue-800 px-3 py-1 mt-3 rounded font-semibold cursor-pointer hover:bg-blue-900 transition-all duration-200"
          >
            Update
          </button>
          <Link
            to={"/myOrders"}
            className="bg-blue-800 px-3 py-1 mt-3 rounded font-semibold cursor-pointer hover:bg-blue-900 transition-all duration-200"
          >
            My Orders
          </Link>
        </div>
        <p
          onClick={toggleProfileTab}
          className="mt-2 text-sm text-blue-500 hover:underline cursor-pointer"
        >
          {isPasswordTabOpen ? "Update Profile Info" : "Change Password..."}
        </p>
        {isLoading && <Loader />}
      </form>
    </section>
  );
};

export default Profile;
