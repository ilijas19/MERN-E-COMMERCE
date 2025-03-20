import { toast } from "react-toastify";
import { useDeleteProductMutation } from "../../redux/api/productsApiSlice";
import { Product } from "../../types";
import { isApiError } from "../../utils/isApiError";

type DeleteProductProps = {
  product: Product | null;
  onClose: () => void;
  refetch: () => void;
};

const DeleteProductPopup = ({
  product,
  onClose,
  refetch,
}: DeleteProductProps) => {
  const [deleteApiHandler, { isLoading }] = useDeleteProductMutation();
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteApiHandler(id).unwrap();
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

  return (
    <div className="pt-4 pb-2 px-4 rounded-lg text-white  mx-auto ">
      <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
      <p className="text-gray-400">
        Are you sure you want to delete{" "}
        <span className="text-red-400 font-semibold">{product?.name}</span>?
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
          onClick={() => handleDelete(product?._id ?? "")}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
export default DeleteProductPopup;
