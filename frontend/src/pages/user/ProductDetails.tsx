import { useParams } from "react-router";
import { useGetSingleProductQuery } from "../../redux/api/productsApiSlice";
import Loader from "../../components/Loader";
import RatingStars from "../../components/productsPublic/RatingStars";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { formatDate } from "../../utils/formatString";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import AddToFavorite from "../../components/productsPublic/AddToFavorite";
import ReviewForm from "../../components/productsPublic/ReviewForm";
import ProductReviews from "../../components/productsPublic/ProductReviews";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useGetSingleProductQuery(id ?? "");
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [qty, setQty] = useState<number>(1);
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();

  const toggleDescription = () => {
    setIsDescriptionOpen((prev) => !prev);
  };

  //add to cart functionality
  const decrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };
  const increment = () => {
    if (qty < (product?.product.countInStock ?? 1)) {
      setQty(qty + 1);
    }
  };
  const addToCartHandler = () => {
    if (!product?.product) return;
    dispatch(addToCart({ ...product.product, qty }));
    toast.success("Added To Cart");
  };

  //favorites functionality
  const { userDetails } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="text-white px-4">
      <figure className="grid sm:grid-cols-2 grid-cols-1 max-w-[1000px] mx-auto mt-4 gap-4 px-2 ">
        <img
          src={product?.product.image}
          alt="image"
          className="rounded-lg w-full sm:h-[27rem] h-[20rem] object-cover"
        />
        <figcaption className="px-2 h-full flex flex-col py-4 pb-0">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">{product?.product.category.name}</p>
            <AddToFavorite
              productId={product?.product._id ?? ""}
              favorites={userDetails?.favorites}
            />
          </div>

          <h2 className="text-2xl font-semibold">{product?.product.name}</h2>
          <div className="flex gap-1 items-center">
            <RatingStars rating={product?.product.averageRating || 0} /> (
            {product?.product.numReviews})
          </div>
          <hr className="text-gray-700 my-1" />
          <div>
            <p
              className="flex justify-between items-center cursor-pointer "
              onClick={toggleDescription}
            >
              Description{" "}
              {isDescriptionOpen ? (
                <IoIosArrowUp size={19} />
              ) : (
                <IoIosArrowDown size={19} />
              )}
            </p>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isDescriptionOpen
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-400 mt-2 max-h-[500px] mb-2">
                {product?.product.description}
              </p>
            </div>
          </div>

          <hr className="text-gray-700 my-1 mt-auto" />
          <div className="flex justify-between ">
            <p className="font-bold mt-1">$ {product?.product.price}</p>
            <p className="text-gray-400">
              In stock : {product?.product.countInStock}
            </p>
          </div>

          <div className="mt-2 flex justify-between ">
            <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={decrement}
                className="bg-black-800 text-yellow-500 px-3 py-0.5 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                -
              </button>
              <span className=" text-yellow-500 px-3 py-0.5">{qty}</span>
              <button
                onClick={increment}
                className="bg-black-800 text-yellow-500  px-3 py-0.5 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
            <button
              onClick={addToCartHandler}
              className="bg-yellow-500 text-black font-semibold px-1 rounded flex items-center gap-2 cursor-pointer"
            >
              Add To Cart <FaShoppingCart />
            </button>
          </div>
          <p className="text-gray-600 mt-1 self-end">
            Added on {formatDate(product?.product.createdAt ?? "")}
          </p>
        </figcaption>
        <div className="sm:col-span-2 col-span-1 sm:justify-around sm:flex  ">
          <ul className=" flex sm:flex-col justify-center gap-8 ">
            <li
              onClick={() => setActiveTab(1)}
              className={`${
                activeTab === 1 ? "font-bold" : "font-normal"
              } cursor-pointer`}
            >
              Leave Review
            </li>
            <li
              onClick={() => setActiveTab(2)}
              className={`${
                activeTab === 2 ? "font-bold" : "font-normal"
              } cursor-pointer`}
            >
              Reviews
            </li>
          </ul>
          <div className="sm:w-[60%] h-[20rem] w-full">
            {activeTab === 1 && <ReviewForm id={product?.product._id ?? ""} />}
            {activeTab === 2 && (
              <ProductReviews reviews={product?.product.reviews || []} />
            )}
          </div>
        </div>
      </figure>
    </section>
  );
};

export default ProductDetails;
