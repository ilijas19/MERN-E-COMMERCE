type DeletePopupProps = {
  orderToDelete: string;
  onClose: () => void;
  handleDelete: (id: string) => Promise<void>;
  deleteLoading: boolean;
};

const DeleteOrderPopup = ({
  orderToDelete,
  onClose,
  handleDelete,
  deleteLoading,
}: DeletePopupProps) => {
  return (
    <div className="pt-4 pb-2 px-4 rounded-lg text-white  mx-auto ">
      <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
      <p className="text-gray-400">
        Are you sure you want to delete{" "}
        <span className="text-red-400 font-semibold">{orderToDelete}</span>?
      </p>
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          disabled={deleteLoading}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
          onClick={() => handleDelete(orderToDelete)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
export default DeleteOrderPopup;
