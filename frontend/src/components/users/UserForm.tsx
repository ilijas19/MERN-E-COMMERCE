import { useEffect, useState } from "react";
import { UserDetailsType } from "../../types";
import { formatDate } from "../../utils/formatString";
import { useUpdateUserByIdMutation } from "../../redux/api/usersApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";

type UserFormProps = {
  user: UserDetailsType;
  onClose: () => void;
  refetch: () => void;
  handleDeleteUser?: (id: string) => Promise<void>;
};

const UserForm = ({ user, onClose, refetch }: UserFormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [updateApiHandler, { isLoading }] = useUpdateUserByIdMutation();

  const submitHandler = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await updateApiHandler({
        id: user?._id || "",
        data: { username, email },
      }).unwrap();

      toast.success(res.msg);
      refetch();
      onClose();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, []);

  return (
    <form className="text-white flex flex-col">
      <h2 className="self-center text-xl font-semibold">User</h2>
      <label>Username</label>
      <input
        type="text"
        className="border border-gray-400 rounded px-3 outline-none py-1 mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>Email</label>
      <input
        type="text"
        className="border border-gray-400 rounded px-3 outline-none py-1 mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Role</label>
      <input
        disabled
        placeholder={`${user?.isAdmin ? "Admin" : "User"}`}
        type="text"
        className="border border-gray-400 rounded px-3 outline-none py-1 mb-2"
      />
      <label>Joined</label>
      <input
        disabled
        placeholder={formatDate(user?.createdAt ?? "")}
        type="text"
        className="border border-gray-400 rounded px-3 outline-none py-1 mb-2"
      />
      <label>Id</label>
      <input
        disabled
        placeholder={user?._id}
        type="text"
        className="border border-gray-400 rounded px-3 outline-none py-1 mb-2"
      />
      <div className="flex justify-between mt-2">
        <button
          disabled={isLoading}
          onClick={submitHandler}
          className="bg-gray-900 px-3 py-0.5 font-semibold hover:bg-gray-950 transition-all duration-300 cursor-pointer rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};
export default UserForm;
