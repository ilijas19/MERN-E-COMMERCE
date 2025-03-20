import { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import FilterMenu from "../../components/shop/FilterMenu";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useGetAllProductsQuery } from "../../redux/api/productsApiSlice";
import Loader from "../../components/Loader";
import ProductCardL from "../../components/productsPublic/ProductCardL";
import { Filters } from "../../types";

const Shop = () => {
  const [isFilterMenuOpen, setFilterMenuOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    category: "",
    priceGte: "",
    priceLte: "",
    page: 1,
  });

  const { data: categories } = useGetAllCategoriesQuery();
  const { data: products, isLoading: productsLoading } =
    useGetAllProductsQuery(filters);

  return (
    <section className="flex flex-col max-w-[1100px]  mx-auto items-center px-6">
      <h2 className="text-white font-semibold text-xl text-center my-2">
        Shop
      </h2>
      <button
        onClick={() => setFilterMenuOpen(true)}
        className="bg-gray-100 w-[80%] rounded cursor-pointer  grid grid-cols-3 place-items-center px-4 py-1 hover:bg-gray-200 transition-all duration-300"
      >
        <div className="w-full">
          <IoFilterOutline size={18} className="font-bold" />
        </div>
        <p className="font-semibold">Filters</p>
      </button>
      <FilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        categories={categories?.categories || []}
        filters={filters}
        setFilters={setFilters}
      />
      <ul className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-x-8 gap-y-6 mt-8 w-full place-items-center">
        {productsLoading && <Loader />}
        {products &&
          products.products.map((product) => (
            <ProductCardL key={product._id} product={product} />
          ))}
      </ul>
      <div className="mb-6 mt-6 flex gap-2" hidden={products?.nbHits === 0}>
        <button
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          disabled={filters.page === 1}
          className="px-3 py-1 mx-1 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          disabled={!products?.nextPage}
          className="px-3 py-1 mx-1 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      {products?.nbHits === 0 && (
        <p className="text-white">No Products Found</p>
      )}
    </section>
  );
};
export default Shop;
