import React, { useState } from "react";
import { useCreateCategoryMutation } from "../../redux/api/categoryApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";

type AddCategoryProps = {
  onClose: () => void;
  refetch: () => void;
};

const AddCategoryForm = ({ onClose, refetch }: AddCategoryProps) => {
  const [name, setName] = useState<string>("");

  const [createCategoryApi, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await createCategoryApi({ name }).unwrap();
      toast.success(res.msg);
      refetch();
      onClose();
    } catch (error) {
      if (isApiError(error)) {
        toast.success(error.data.msg);
      } else {
        toast.success("Something Went Wrong");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 sm:px-4">
      <h2 className="font-semibold text-center">Add Category</h2>
      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="border border-gray-600 rounded px-2 py-1 outline-none"
      />
      <div className="flex justify-between mt-2">
        <button className="bg-gray-950 px-3 py-0.5 rounded hover:bg-gray-900 transition-all duration-200 cursor-pointer font-semibold">
          Create
        </button>
        <button
          disabled={isLoading}
          className="bg-red-900 px-3 py-0.5 rounded  hover:bg-red-800 transition-all duration-300 cursor-pointer font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
export default AddCategoryForm;
