import { useState } from "react";
import Loader from "../../components/Loader";
import ProductCard from "../../components/productsPublic/ProductCard";
import { useGetFavoriteProductsQuery } from "../../redux/api/productsApiSlice";

const Favorites = () => {
  const { data: favorites, isLoading } = useGetFavoriteProductsQuery();
  const [page, setPage] = useState(1);
  const limit = 8;

  if (isLoading) {
    return <Loader />;
  }
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedFavorites = favorites?.favorites.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <section className=" max-w-[1000px] mx-auto">
      <h2 className="text-center text-white m-2 font-semibold text-xl">
        Favorites
      </h2>
      <ul className="p-2 flex flex-wrap gap-4 justify-center">
        {paginatedFavorites &&
          paginatedFavorites.map((favorite) => (
            <ProductCard key={favorite._id} product={favorite} />
          ))}
      </ul>
      {/* Pagination Controls */}
      <div
        hidden={favorites?.favorites && favorites.favorites.length < 10}
        className="flex justify-center my-4 gap-1 "
      >
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 mx-1 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!favorites || endIndex >= favorites.favorites.length}
          className="px-3 py-1 mx-1 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </section>
  );
};
export default Favorites;
