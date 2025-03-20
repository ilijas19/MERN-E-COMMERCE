import { Link } from "react-router";
import { Product } from "../../types";
import RatingStars from "./RatingStars";

type ProductCardLProps = {
  product: Product;
};

const ProductCardL = ({ product }: ProductCardLProps) => {
  return (
    <li className="sm:max-w-[350px] max-w-[300px]  w-full rounded-lg overflow-hidden text-gray-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-full bg-gray-900 sm:h-[15rem] h-[13rem] object-cover"
      />
      <div className="bg-gray-950 flex flex-col gap-1">
        <p className="sm:text-lg text-base font-semibold">{product.name}</p>
        <p className="text-gray-400 sm:text-base text-sm">
          {product.description}
        </p>
        <RatingStars rating={product.averageRating} />
        <div className="flex justify-between items-center">
          <p className="sm:text-base text-sm">$ {product.price}</p>
          <Link
            className="font-semibold bg-yellow-500 text-black px-2 "
            to={`/product/${product._id}`}
          >
            See More
          </Link>
        </div>
      </div>
    </li>
  );
};
export default ProductCardL;
