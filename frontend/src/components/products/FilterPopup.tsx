import { useState } from "react";
import { Filters } from "../../types";

export type FilterPopupProps = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onClose: () => void;
  categories: { _id: string; name: string }[];
};

const FilterPopup = ({
  filters,
  setFilters,
  onClose,
  categories,
}: FilterPopupProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    setFilters({ ...localFilters, page: 1 });
    onClose();
  };

  const resetFilters = () => {
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
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center mx-4"
    >
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-white text-lg font-semibold mb-3">Filters</h2>
        <div className="space-y-4">
          <div>
            <label className="text-white">Name</label>
            <input
              type="text"
              value={localFilters.name}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, name: e.target.value })
              }
              className="w-full p-2 bg-gray-700 text-white rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="text-white">Category</label>
            <select
              value={localFilters.category}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, category: e.target.value })
              }
              className="w-full p-2 bg-gray-700 text-white rounded-lg outline-none"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.priceGte}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, priceGte: e.target.value })
                }
                className="w-1/2 p-2 bg-gray-700 text-white rounded-lg outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.priceLte}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, priceLte: e.target.value })
                }
                className="w-1/2 p-2 bg-gray-700 text-white rounded-lg outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-2.5">
          <button
            onClick={onClose}
            className="cursor-pointer px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => resetFilters()}
            className="cursor-pointer px-3 py-1 bg-red-700 text-white rounded-lg hover:bg-red-600"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
