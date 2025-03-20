import { Category } from "../../types";
import { useUpdateCategoryMutation } from "../../redux/api/categoryApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useState } from "react";

type UpdateCategoryFormProps = {
  category: Category | null;
  onClose: () => void;
  refetch: () => void;
};

const UpdateCategoryForm = ({
  category,
  onClose,
  refetch,
}: UpdateCategoryFormProps) => {
  const [name, setName] = useState<string>(category?.name ?? "");

  const [updateApiHandler, { isLoading }] = useUpdateCategoryMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updateApiHandler({
        id: category!._id,
        data: { name },
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

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-1">
      <h2 className="text-center font-semibold text-lg ">Category Form</h2>
      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Name"
        className="outline-none border border-gray-600 rounded px-3 py-1"
      />
      <label>Created At</label>
      <input
        type="text"
        placeholder={category?.createdAt?.toString()}
        disabled
        className="outline-none border border-gray-600 rounded px-3 py-1"
      />

      <button
        disabled={isLoading}
        type="submit"
        className="bg-gray-900 rounded mt-2 py-0.5 text-lg cursor-pointer hover:bg-gray-950 transition-all duration-300"
      >
        Save
      </button>
    </form>
  );
};
export default UpdateCategoryForm;
