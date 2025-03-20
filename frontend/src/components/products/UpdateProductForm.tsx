import React, { useState } from "react";
import { Category, Product } from "../../types";
import {
  useUploadProductImageMutation,
  useUpdateProductMutation,
} from "../../redux/api/productsApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import Loader from "../Loader";

type UpdateProductFormProps = {
  product: Product | null;
  onClose: () => void;
  refetch: () => void;
  categories: Category[];
};

const UpdateProductForm = ({
  product,
  onClose,
  refetch,
  categories,
}: UpdateProductFormProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>(product!.name);
  const [brand, setBrand] = useState<string>(product!.brand);
  const [category, setCategory] = useState<string>(product!.category._id);
  const [description, setDescription] = useState<string>(product!.description);
  const [price, setPrice] = useState<number>(product!.price);
  const [countInStock, setCountInStock] = useState<number>(
    product!.countInStock
  );

  const [uploadApiHandler, { isLoading: uploadImageLoading }] =
    useUploadProductImageMutation();
  const [updateApiHandler, { isLoading: updateProductLoading }] =
    useUpdateProductMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      try {
        const res = await uploadApiHandler(formData).unwrap();
        toast.success(res.msg);
        setImageUrl(res.url || null);
      } catch (error) {
        if (isApiError(error)) {
          toast.error(error.data.msg);
        } else {
          toast.error("Something Went Wrong");
        }
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updateApiHandler({
        id: product!._id,
        data: {
          name,
          brand,
          category,
          description,
          price,
          countInStock,
          image: imageUrl || "",
        },
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
    <form onSubmit={handleUpdate} className="flex flex-col gap-1">
      <h2 className="font-semibold text-center">Update Product</h2>
      <p>Image</p>
      <div className="border border-gray-600 rounded px-2 py-1 flex items-center">
        <label htmlFor="image-upload" className="grow">
          Upload Image
        </label>
        <input
          disabled={uploadImageLoading}
          onChange={handleImageUpload}
          hidden
          id="image-upload"
          type="file"
          className="border border-gray-600 rounded px-2 py-1"
        />
        {uploadImageLoading && <Loader size="small" />}
        {imageUrl && imageUrl !== "" && (
          <div className="flex items-center gap-1 ml-1">
            <img
              src={imageUrl}
              alt="img"
              className="bg-white h-5 w-5 object-contain"
            />
          </div>
        )}
      </div>

      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="border border-gray-600 rounded px-2 py-1 outline-none"
      />

      <label>Brand</label>
      <input
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        type="text"
        className="border border-gray-600 rounded px-2 py-1 outline-none"
      />

      <label>Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-600 rounded px-2 py-1 outline-none bg-gray-800"
      >
        {categories.map((cat) => (
          <option className="bg-gray-800" key={cat.name} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-600 rounded px-2 py-1 outline-none"
      />

      <div className="flex justify-between gap-2">
        <div className="flex flex-col w-[50%]">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            type="number"
            className="border border-gray-600 rounded px-2 py-1 outline-none"
          />
        </div>
        <div className="flex flex-col w-[50%]">
          <label>Count In Stock</label>
          <input
            value={countInStock}
            onChange={(e) => setCountInStock(Number(e.target.value))}
            type="number"
            className="border border-gray-600 rounded px-2 py-1 outline-none"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <button
          disabled={updateProductLoading}
          className="bg-gray-900 font-semibold px-3 py-0.5 rounded hover:bg-gray-950 transition-all duration-300 cursor-pointer"
        >
          Save
        </button>
        <button className="bg-red-900 font-semibold px-3 py-0.5 rounded hover:bg-red-950 transition-all duration-300 cursor-pointer">
          Close
        </button>
      </div>
      {updateProductLoading && <Loader />}
    </form>
  );
};
export default UpdateProductForm;
