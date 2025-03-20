import { FaEdit, FaTrash } from "react-icons/fa";
import { useGetAllProductsQuery } from "../../redux/api/productsApiSlice";
import Loader from "../../components/Loader";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { useState } from "react";
import Modal from "../../components/Modal";
import { Filters, Product } from "../../types";
import UpdateProductForm from "../../components/products/UpdateProductForm";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApiSlice";
import DeleteProductPopup from "../../components/products/DeleteProductPopup";
import FilterPopup from "../../components/products/FilterPopup";
import AddProductPopup from "../../components/products/AddProductPopup";
import { useNavigate } from "react-router";

const ProductList = () => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [updatingProduct, setUpdatingProduct] = useState<Product | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  //filter popup
  const [isFilterPopupOpen, setFilterPopupOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    category: "",
    priceGte: "",
    priceLte: "",
    page: 1,
  });
  //product popuo
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  //products
  const {
    data: products,
    isLoading,
    refetch,
  } = useGetAllProductsQuery({
    ...filters,
  });
  //categories
  const { data: categories } = useGetAllCategoriesQuery();

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page: page });
  };

  const handleUpdateModal = (product: Product) => {
    setUpdatingProduct(product);
    setUpdateModalOpen(true);
  };

  const handleDeleteModal = (product: Product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  const navigate = useNavigate();
  const openProduct = (id: string) => {
    navigate(`/product/${id}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="text-white max-w-[1000px] mx-auto px-4 py-6 flex flex-col">
      <div className="flex justify-between items-center ">
        <p className="text-sm text-gray-400">Manage products</p>
        <p className="text-sm text-gray-400">
          Total Products: {products?.totalProducts}
        </p>
      </div>

      <div className="flex justify-between items-center mb-4 sm:flex-row flex-col">
        <h2 className="font-semibold text-2xl mb-2 sm:mb-0">Products</h2>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setAddModalOpen(true);
            }}
            className="bg-gray-800 border border-gray-700 font-semibold rounded-lg cursor-pointer hover:bg-gray-700 transition-colors  sm:text-base text-sm sm:px-3 px-2 sm:py-1 py-0.5"
          >
            Add Product
          </button>
          <button
            onClick={() => {
              setFilterPopupOpen(true);
            }}
            className="bg-gray-800 border border-gray-700 font-semibold rounded-lg cursor-pointer hover:bg-gray-700 transition-colors sm:text-base text-sm sm:px-3 px-2 sm:py-1 py-0.5 "
          >
            Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg scrollbar">
        <table className=" w-full border-collapse bg-gray-900 text-white border-b border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                Image
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                Name
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                Category
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                Brand
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                Price
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                In Stock
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-800 transition-colors border-t border-gray-700"
                >
                  <td className="border-gray-700 p-3 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="bg-white h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td
                    onClick={() => openProduct(product._id)}
                    className="border-gray-700 p-3 text-center whitespace-nowrap hover:underline cursor-pointer"
                  >
                    {product.name}
                  </td>
                  <td className=" border-gray-700 p-3 text-center whitespace-nowrap">
                    {product.category.name}
                  </td>
                  <td className=" border-gray-700 p-3 text-center whitespace-nowrap">
                    {product.brand}
                  </td>
                  <td className=" border-gray-700 p-3 text-center whitespace-nowrap">
                    $ {product.price}
                  </td>
                  <td className=" border-gray-700 p-3 text-center whitespace-nowrap">
                    {product.countInStock}
                  </td>
                  <td className=" border-gray-700 p-3">
                    <div className="flex justify-center items-center space-x-4">
                      <FaEdit
                        onClick={() => {
                          handleUpdateModal(product);
                        }}
                        size={18}
                        className="text-yellow-500 cursor-pointer hover:text-yellow-400 transition-colors"
                      />
                      <FaTrash
                        onClick={() => {
                          handleDeleteModal(product);
                        }}
                        size={18}
                        className="text-red-600 cursor-pointer hover:text-red-500 transition-colors"
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {products && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => handlePageChange(products.page - 1)}
            disabled={products.page - 1 === 0}
            className={`flex items-center gap-1 px-2 py-1 border border-gray-700 rounded-lg text-white transition-all duration-300
             ${
               products.page - 1 === 0
                 ? "opacity-50 cursor-not-allowed"
                 : "hover:bg-gray-700 cursor-pointer"
             }`}
          >
            <GrLinkPrevious /> Prev
          </button>

          <span className="text-white font-semibold">Page {products.page}</span>

          <button
            onClick={() => handlePageChange(products.page + 1)}
            disabled={!products.nextPage || products.nbHits < 7}
            className={`flex items-center gap-1 px-2 py-1 border border-gray-700 rounded-lg text-white transition-all duration-300
             ${
               !products.nextPage || products.nbHits < 7
                 ? "opacity-50 cursor-not-allowed"
                 : "hover:bg-gray-700 cursor-pointer"
             }`}
          >
            Next <GrLinkNext />
          </button>
        </div>
      )}
      <Modal
        isModalOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      >
        <UpdateProductForm
          product={updatingProduct}
          onClose={() => setUpdateModalOpen(false)}
          refetch={refetch}
          categories={categories?.categories || []}
        />
      </Modal>

      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeleteProductPopup
          product={deletingProduct}
          onClose={() => setDeleteModalOpen(false)}
          refetch={refetch}
        />
      </Modal>

      {isFilterPopupOpen && (
        <FilterPopup
          filters={filters}
          setFilters={setFilters}
          onClose={() => setFilterPopupOpen(false)}
          categories={categories?.categories || []}
        />
      )}

      <Modal
        isModalOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
      >
        <AddProductPopup
          onClose={() => setAddModalOpen(false)}
          refetch={refetch}
          categories={categories?.categories || []}
        />
      </Modal>
    </section>
  );
};

export default ProductList;
