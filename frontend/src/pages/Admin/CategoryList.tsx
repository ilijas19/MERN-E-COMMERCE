import { FaRegEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApiSlice";
import Loader from "../../components/Loader";
import { formatDate } from "../../utils/formatString";
import { useState } from "react";
import Modal from "../../components/Modal";
import { Category } from "../../types";
import UpdateCategoryForm from "../../components/category/UpdateCategoryForm";
import CategoryDeletePopup from "../../components/category/CategoryDeletePopup";
import AddCategoryForm from "../../components/category/AddCategoryForm";

const UserList = () => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);

  const { data: categories, isLoading, refetch } = useGetAllCategoriesQuery();

  const handleUpdateModalOpen = (category: Category) => {
    setEditingCategory(category);
    setUpdateModalOpen(true);
  };

  const handleDeleteModalOpen = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="text-white  max-w-[800px] mx-auto px-4 py-2 flex flex-col">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400 ">Manage Categories</p>
      </div>
      <div className="flex justify-between items-center flex-row">
        <h2 className="font-semibold text-2xl mb-1 sm:mb-0">Categories</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="relative border border-gray-400 bg-gray-800 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:bg-gray-900 transition-all duration-300 text-sm"
        >
          Add Category <FaPlus size={12} className="mt-0.5" />
        </button>
      </div>
      <ul className="border-t border-gray-800 mt-3">
        {categories?.categories.map((category) => (
          <li
            key={category._id}
            className="flex items-center gap-2 border-b border-gray-800 px-0 sm:px-4 py-3 "
          >
            <p className="font-semibold ">{category.name}</p>
            <p className="text-gray-500 text-sm ml-auto">
              Added: {formatDate(category.createdAt ?? "")}
            </p>
            <FaRegEdit
              className="cursor-pointer sm:ml-1  size-5"
              onClick={() => handleUpdateModalOpen(category)}
            />
            <FaTrash
              onClick={() => handleDeleteModalOpen(category)}
              className="text-red-700  cursor-pointer  size-4"
            />
          </li>
        ))}
      </ul>
      <Modal
        isModalOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      >
        <UpdateCategoryForm
          category={editingCategory}
          onClose={() => setUpdateModalOpen(false)}
          refetch={refetch}
        />
      </Modal>

      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <CategoryDeletePopup
          categoryToDelete={categoryToDelete}
          onClose={() => setDeleteModalOpen(false)}
          refetch={refetch}
        />
      </Modal>

      <Modal
        isModalOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
      >
        <AddCategoryForm
          onClose={() => setAddModalOpen(false)}
          refetch={refetch}
        />
      </Modal>
    </section>
  );
};

export default UserList;
