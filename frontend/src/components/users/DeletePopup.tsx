import { UserDetailsType } from "../../types";

type DeletePopupProps = {
  userToDelete: UserDetailsType;
  setDeleteModalOpen: (boleean: boolean) => void;
  handleDeleteUser: (id: string) => Promise<void>;
  deleteLoading: boolean;
};

const DeletePopup = ({
  userToDelete,
  setDeleteModalOpen,
  handleDeleteUser,
  deleteLoading,
}: DeletePopupProps) => {
  return (
    <div className="pt-4 pb-2 px-4 rounded-lg text-white  mx-auto ">
      <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
      <p className="text-gray-400">
        Are you sure you want to delete{" "}
        <span className="text-red-400 font-semibold">
          {userToDelete?.username}
        </span>
        ?
      </p>
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700 cursor-pointer"
          onClick={() => setDeleteModalOpen(false)}
        >
          Cancel
        </button>
        <button
          disabled={deleteLoading}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 cursor-pointer"
          onClick={() => handleDeleteUser(userToDelete?._id ?? "")}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
export default DeletePopup;
