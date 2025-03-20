import { useState } from "react";
import { Category, Filters } from "../../types";
import { IoMdClose } from "react-icons/io";

type FilterMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[] | [];
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

const FilterMenu = ({
  isOpen,
  onClose,
  categories,
  filters,
  setFilters,
}: FilterMenuProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilters({ ...localFilters, page: 1 });
    onClose();
  };

  const handleResetFilters = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilters({ name: "", category: "", priceGte: "", priceLte: "", page: 1 });
    setLocalFilters({
      name: "",
      category: "",
      priceGte: "",
      priceLte: "",
      page: 1,
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className={`fixed inset-0 bg-black transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } duration-300`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-gray-200 h-screen w-[18rem] absolute left-0 top-0 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <IoMdClose
          onClick={onClose}
          size={20}
          className="absolute right-2 top-2 text-red-700 cursor-pointer"
        />
        <h2 className="font-bold text-lg text-center mt-8">Filters</h2>
        <form className="px-5 ">
          <label className="font-semibold">Name</label>
          <input
            value={localFilters.name}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, name: e.target.value })
            }
            type="text"
            placeholder="Name"
            className="border border-gray-500 rounded w-full px-2 mb-2 py-0.5 outline-none"
          />
          <label className="font-semibold">Categories</label>
          <select
            value={localFilters.category}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, category: e.target.value })
            }
            className="w-full border outline-none border-gray-500 text-gray-700 px-1 rounded py-0.5 mb-2"
          >
            <option className="t-300" value="">
              Filter By Category
            </option>
            {categories.map((category) => (
              <option
                key={category._id}
                className="font-semibold"
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
          <label className="font-semibold">Price Range</label>
          <div className="flex gap-3 mb-2">
            <input
              value={localFilters.priceGte}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, priceGte: e.target.value })
              }
              type="number"
              placeholder="Min"
              className="border border-gray-500 rounded w-full px-2  py-0.5 outline-none"
            />
            <input
              value={localFilters.priceLte}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, priceLte: e.target.value })
              }
              type="number"
              placeholder="Max"
              className="border border-gray-500 rounded w-full px-2  py-0.5 outline-none"
            />
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full bg-gray-900 text-white font-semibold rounded py-0.5 mb-2 cursor-pointer hover:bg-gray-800 transition-all duration-300 mt-2"
          >
            Apply
          </button>
          <button
            onClick={handleResetFilters}
            className={`w-full bg-red-700 text-white font-semibold rounded py-0.5 mb-2 cursor-pointer hover:bg-red-800  transition-all duration-300`}
          >
            Reset{" "}
          </button>
        </form>
      </div>
    </div>
  );
};
export default FilterMenu;
