import { Product } from "../../types";
import RatingStars from "./RatingStars";
import AddToFavorite from "./AddToFavorite";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router";
type ProductCardProps = {
  product: Product;
  onSlider?: boolean;
};

const ProductCard = ({ product, onSlider }: ProductCardProps) => {
  const { userDetails } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const openProduct = (id: string) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="text-white rounded-lg overflow-hidden mb-2 border border-gray-900">
      <div className="relative">
        <img
          onClick={() => {
            if (onSlider) {
              return;
            }
            openProduct(product._id);
          }}
          src={product.image}
          alt={product.name}
          className={`w-[12rem] h-[11rem] object-cover bg-gray-900 ${
            onSlider ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
          }`}
        />
        <div className="absolute top-2 right-2">
          <AddToFavorite
            productId={product._id}
            favorites={userDetails?.favorites}
          />
        </div>
      </div>

      <div className="p-1 flex flex-col gap-0.5">
        <div>
          <p
            className="cursor-pointer"
            onClick={() => openProduct(product._id)}
          >
            {product.name}
          </p>
        </div>
        <RatingStars rating={product.averageRating} />
        <p className="text-sm text-gray-400 mt-1.5">${product.price}</p>
      </div>
    </div>
  );
};
export default ProductCard;
