import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CartProductCard from "../../components/shop/CartProductCard";
import { Link } from "react-router";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);

  return (
    <section className="max-w-[1100px] mx-auto flex flex-col items-center">
      <h2 className="text-white font-semibold text-xl text-center my-3">
        Shopping Cart
      </h2>
      <ul className="w-full flex flex-col px-8 items-center gap-6">
        {cart.cartItems.map((item) => (
          <CartProductCard key={item._id} product={item} />
        ))}
        {cart.cartItems.length === 0 ? (
          <div className="flex gap-2 ">
            <p className="text-white  font-semibold">Cart Is Empty... </p>
            <Link className="text-yellow-500 font-semibold" to={"/shop"}>
              Go To Shop?
            </Link>
          </div>
        ) : (
          <div className="w-full flex flex-col">
            <p className="text-white self-start mt-4 mb-1">
              Items : <span>({cart.cartItems.length})</span>
            </p>
            <p className="text-white self-start ">
              Total :{" "}
              <span className="text-yellow-500">${cart.itemsPrice}</span>
            </p>
            <Link
              to={"/shipping"}
              className="bg-yellow-500 w-full rounded-lg mt-2 py-1 font-semibold cursor-pointer hover:bg-black hover:text-yellow-500 border border-yellow-500 transition-all duration-400 text-center"
            >
              Proceed To Checkout
            </Link>
          </div>
        )}
      </ul>
    </section>
  );
};
export default Cart;
