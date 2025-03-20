import { Link } from "react-router";
import { CartProduct } from "../../types";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/features/cart/cartSlice";

type CartProductProps = {
  product: CartProduct;
};

const CartProductCard = ({ product }: CartProductProps) => {
  const [qty, setQty] = useState<number>(product.qty);
  const dispatch = useDispatch();

  const handleQtyChange = (qty: number) => {
    if (qty > product.countInStock || qty <= 0) return;
    setQty(qty);
    dispatch(addToCart({ ...product, qty }));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product._id));
  };

  return (
    <li className="sm:max-w-[100%] max-w-[25rem] w-full rounded-lg overflow-hidden flex sm:flex-row flex-col gap-2 shadow shadow-gray-800">
      <img
        src={product.image}
        alt={product.name}
        className="bg-gray-900 sm:w-[40%] h-[12rem] object-cover "
      />
      <div className="grow flex flex-col">
        <Link
          to={`/product/${product._id}`}
          className=" text-yellow-500 font-semibold"
        >
          Name : {product.name}
        </Link>
        <p className="text-gray-400 sm:text-base text-sm">
          Category :{" "}
          <span className="font-semibold text-white">
            {product.category.name}
          </span>
        </p>
        <p className="text-gray-400 sm:text-base text-sm">
          Brand :{" "}
          <span className="font-semibold text-white">{product.brand}</span>
        </p>
        <div
          className="mt-auto flex items-center justify-between mb-0.5 pt-3 pb-1
        "
        >
          <p className="text-gray-400 sm:text-base text-sm ">
            Price :{" "}
            <span className="font-semibold text-white">${product.price}</span>
          </p>
          <div className="flex items-center gap-2 mr-2">
            <p className="text-white text-sm">Count :</p>
            <input
              value={qty}
              onChange={(e) => handleQtyChange(+e.target.value)}
              type="number"
              className="border border-gray-800 text-white w-10  px-1 h-5"
            />
            <FaTrash
              onClick={handleRemoveFromCart}
              size={17}
              className="text-red-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </li>
  );
};
export default CartProductCard;
