import React, { useState } from "react";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { Category } from "../../types";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productsApiSlice";
import Loader from "../Loader";

type AddProductProps = {
  onClose: () => void;
  refetch: () => void;
  categories: Category[] | [];
};

const AddProductPopup = ({ onClose, refetch, categories }: AddProductProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [countInStock, setCountInStock] = useState<number>(0);

  const [uploadImageApiHandler, { isLoading: uploadImageLoading }] =
    useUploadProductImageMutation();
  const [createProductApiHandler, { isLoading: createProductLoading }] =
    useCreateProductMutation();

  const uploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const res = await uploadImageApiHandler(formData);
        setImageUrl(res.data?.url ?? "");
        toast.success(res.data?.msg);
      } catch (error) {
        if (isApiError(error)) {
          toast.success(error.data.msg);
        } else {
          toast.success("Something Went Wrong");
        }
      }
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!imageUrl || imageUrl === "") {
        return toast.error("Image must be provided");
      }
      const res = await createProductApiHandler({
        name,
        brand,
        category,
        description,
        price,
        countInStock,
        image: imageUrl,
      }).unwrap();
      toast.success(res.msg);
      onClose();
      refetch();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col ">
      <h2 className="font-semibold text-center">Create Product</h2>
      <p>Image</p>
      <div className="flex items-center border border-gray-600 rounded px-2 py-1 mb-1">
        <label
          htmlFor="image-upload"
          className="grow cursor-pointer text-gray-400"
        >
          {imageUrl && imageUrl !== "" ? "Uploaded" : "Upload image"}
        </label>
        <input
          disabled={uploadImageLoading}
          onChange={uploadHandler}
          hidden
          type="file"
          id="image-upload"
        />
        {uploadImageLoading && <Loader size="small" />}
        {imageUrl && imageUrl !== "" && (
          <img
            src={imageUrl}
            alt="img"
            className="h-5 w-5 bg-white object-cover"
          />
        )}
      </div>
      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="border border-gray-600 rounded outline-none px-2 py-1 mb-1"
      />

      <label>Brand</label>
      <input
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        type="text"
        className="border border-gray-600 rounded outline-none px-2 py-1 mb-1"
      />

      <label>Category</label>
      <select
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-600 rounded outline-none px-2 py-1 mb-1"
      >
        <option className="bg-gray-800" value="">
          Select Category
        </option>
        {categories.map((category) => (
          <option
            key={category._id}
            className="bg-gray-800"
            value={category._id}
          >
            {category.name}
          </option>
        ))}
      </select>

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-600 rounded outline-none px-2 py-1 mb-1"
      />

      <label>Price</label>
      <input
        value={price}
        onChange={(e) => setPrice(+e.target.value)}
        type="number"
        className="border border-gray-600 rounded outline-none px-2 py-1 mb-1"
      />

      <label>Count In Stock</label>
      <input
        value={countInStock}
        onChange={(e) => setCountInStock(+e.target.value)}
        type="number"
        className="border border-gray-600 rounded outline-none px-2 py-1 mb-1"
      />
      <div className="flex justify-between mt-2">
        <button
          type="submit"
          disabled={createProductLoading}
          className="bg-gray-900 px-2 py-0.5 rounded cursor-pointer font-semibold hover:bg-gray-950 transition-all duration-300"
        >
          Create
        </button>
        <button
          onClick={onClose}
          className="bg-red-800 px-2 py-0.5 rounded cursor-pointer font-semibold hover:bg-red-900 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
      {createProductLoading && <Loader />}
    </form>
  );
};
export default AddProductPopup;
