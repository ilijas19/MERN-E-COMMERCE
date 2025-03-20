import { useState } from "react";
import {
  useDeleteUserByIdMutation,
  useGetAllUsersQuery,
} from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { FaSearch, FaRegEdit, FaTrash } from "react-icons/fa";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import Modal from "../../components/Modal.tsx";
import { UserDetailsType } from "../../types.ts";
import UserForm from "../../components/users/UserForm.tsx";
import DeletePopup from "../../components/users/DeletePopup.tsx";
import { isApiError } from "../../utils/isApiError.ts";
import { toast } from "react-toastify";
const UserList = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserDetailsType | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<UserDetailsType | null>(
    null
  );

  const {
    data: users,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllUsersQuery({
    page,
    username: searchTerm,
  });

  const [deleteUserApiHandler, { isLoading: deleteLoading }] =
    useDeleteUserByIdMutation();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(username);
  };

  const handleModalOpen = (user: UserDetailsType) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await deleteUserApiHandler(id).unwrap();
      setDeleteModalOpen(false);
      setModalOpen(false);
      setUserToDelete(null);
      refetch();
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <section className="text-white  max-w-[1000px] mx-auto px-4 py-2 flex flex-col">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400 ">Manage Members</p>
        <p className="text-sm text-gray-400">
          Total Members: {users?.totalUsers}
        </p>
      </div>
      <div className="flex justify-between items-center sm:flex-row flex-col">
        <h2 className="font-semibold text-2xl mb-1 sm:mb-0">Members</h2>
        <div className="relative ">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="text-white border border-gray-700 rounded-lg  px-2 py-1  text-sm outline-none "
            placeholder="Search For Member"
          />
          <FaSearch
            onClick={handleSearch}
            size={16}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200 cursor-pointer"
          />
        </div>
      </div>
      <ul className="border-t border-gray-800 mt-3">
        {users &&
          users.users.map((user) => (
            <li
              key={user._id}
              className="flex items-center gap-2 border-b border-gray-800 px-0 sm:px-4 py-3 "
            >
              <p className="font-semibold text-sm sm:text-base">
                {user.username}
              </p>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <p className="bg-gray-800 px-2 py-0.5 text-sm roudned ml-auto hidden sm:block">
                {user.isAdmin ? "Admin" : "User"}
              </p>
              <FaRegEdit
                onClick={() => handleModalOpen(user)}
                className="cursor-pointer sm:ml-1 ml-auto size-5"
              />
              <FaTrash
                className="text-red-700  cursor-pointer  size-4"
                onClick={() => {
                  setDeleteModalOpen(true);
                  setUserToDelete(user);
                }}
              />
            </li>
          ))}
      </ul>
      {users && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => handlePageChange(users.page - 1)}
            disabled={users.page - 1 === 0}
            className={`flex items-center gap-1 px-2 py-1 border border-gray-700 rounded-lg text-white transition-all duration-300
        ${
          users.page - 1 === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-700"
        }`}
          >
            <GrLinkPrevious /> Prev
          </button>

          <span className="text-white font-semibold">Page {users.page}</span>

          <button
            onClick={() => handlePageChange(users.page + 1)}
            disabled={!users.nextPage || users.nbHits < 10}
            className={`flex items-center gap-1 px-2 py-1 border border-gray-700 rounded-lg text-white transition-all duration-300
        ${
          !users.nextPage || users.nbHits < 10
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-700"
        }`}
          >
            Next <GrLinkNext />
          </button>
        </div>
      )}
      {(isLoading || isFetching) && <Loader />}
      {/* update modal */}
      <Modal isModalOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <UserForm
          user={editingUser}
          onClose={() => setModalOpen(false)}
          refetch={refetch}
          handleDeleteUser={handleDeleteUser}
        />
      </Modal>

      {/* delete modal */}
      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeletePopup
          userToDelete={userToDelete}
          setDeleteModalOpen={setDeleteModalOpen}
          handleDeleteUser={handleDeleteUser}
          deleteLoading={deleteLoading}
        />
      </Modal>
    </section>
  );
};

export default UserList;
