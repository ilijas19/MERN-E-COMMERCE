import { useEffect, useState } from "react";
import { useGetTop3CategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useGetTopProductsByCategoryQuery } from "../../redux/api/categoryApiSlice";
import ProductCardL from "../productsPublic/ProductCardL";

const TopCategories = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");

  const { data: categories, isLoading } = useGetTop3CategoriesQuery();

  const { data: products } = useGetTopProductsByCategoryQuery(
    activeCategoryId,
    {
      skip: !activeCategoryId,
    }
  );

  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
  };

  useEffect(() => {
    if (categories?.categories) {
      setActiveCategoryId(categories.categories[0]._id);
    }
  }, [categories]);
  return (
    <div className="px-4 mx-auto mt-10">
      <h2 hidden={isLoading} className="text-end font-semibold  text-xl mb-2">
        Top Categories
      </h2>
      <hr className="text-gray-900" />
      <div className="flex sm:flex-row flex-col sm:justify-around items-center gap-1 mt-1 mb-2  ">
        {categories?.categories &&
          categories.categories.map((category) => (
            <p
              onClick={() => handleCategoryChange(category._id)}
              key={category._id}
              className={`${
                category._id === activeCategoryId
                  ? "text-yellow-500 font-semibold"
                  : "text-gray-300"
              } cursor-pointer`}
            >
              {category.name}
            </p>
          ))}
      </div>
      <ul className="grid sm:grid-cols-2 grid-cols-1 sm:gap-16 gap-5 w-full place-items-center mt-6 mb-6">
        {products &&
          products.products.map((product) => (
            <ProductCardL key={product._id} product={product} />
          ))}
      </ul>
    </div>
  );
};
export default TopCategories;
