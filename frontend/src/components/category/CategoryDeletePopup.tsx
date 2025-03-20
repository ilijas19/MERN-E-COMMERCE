import { Category } from "../../types";
import { useDeleteCategoryMutation } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { isApiError } from "../../utils/isApiError";

type CategoryDeleteProps = {
  categoryToDelete: Category | null;
  onClose: () => void;
  refetch: () => void;
};

const CategoryDeletePopup = ({
  categoryToDelete,
  onClose,
  refetch,
}: CategoryDeleteProps) => {
  const [deleteApiHandler, { isLoading }] = useDeleteCategoryMutation();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteApiHandler(id).unwrap();
      toast.success(res.msg);
      onClose();
      refetch();
    } catch (error) {
      if (isApiError(error)) {
        toast.success(error.data.msg);
      } else {
        toast.success("Something Went Wrong");
      }
    }
  };

  return (
    <div className="pt-4 pb-2 px-4 rounded-lg text-white  mx-auto ">
      <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
      <p className="text-gray-400">
        Are you sure you want to delete{" "}
        <span className="text-red-400 font-semibold">
          {categoryToDelete?.name}
        </span>
        ?
      </p>
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700 cursor-pointer"
          onClick={() => onClose()}
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 cursor-pointer"
          onClick={() => handleDelete(categoryToDelete?._id ?? "")}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
export default CategoryDeletePopup;
