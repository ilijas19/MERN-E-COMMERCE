import { useDispatch, useSelector } from "react-redux";
import Steps from "../../components/order/Steps";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreateOrderMutation } from "../../redux/api/ordersApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { OrderItemArg } from "../../types";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import OrderTable from "./OrderTable";
const Summary = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const { userDetails } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrderApiHandler, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/cart");
    }
  }, [cart]);

  const confirmOrder = async () => {
    try {
      const orderItemArg: OrderItemArg[] = cart.cartItems.map((item) => ({
        product: item._id,
        qty: item.qty,
      }));
      const { address, city, postalCode, country, phoneNumber } =
        cart.shippingAddress;
      const res = await createOrderApiHandler({
        orderItems: orderItemArg,
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
          phoneNumber,
        },
        itemsPrice: cart.itemsPrice,
      }).unwrap();
      toast.success(res.msg);
      dispatch(clearCartItems());
      navigate(`/order/${res.orderId}`);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went wrong");
      }
    }
  };

  return (
    <section className="max-w-[1000px] mx-auto">
      <Steps step1 step2 step3 />
      <OrderTable cartItems={cart.cartItems} />
      <h2 className="text-white font-semibold text-lg my-2 text-center">
        Order Summary
      </h2>
      <div className="px-4">
        <ul className="w-full text-white border border-gray-500">
          <li className="flex sm:flex-row flex-col w-full ">
            <div className="bg-gray-950 sm:border-r sm:border-b-0 border-b border-r-0 border-gray-500 w-full font-semibold sm:text-lg stext-base px-3 py-3 flex items-center text-yellow-500">
              User Info
            </div>
            <div className="bg-gray-950 w-full text-gray-200 p-2 sm:text-base text-sm">
              <p>
                <span className="font-semibold">Name</span> :{" "}
                {userDetails?.username}
              </p>
              <p>
                <span className="font-semibold">Email</span> :{" "}
                {userDetails?.email}
              </p>
            </div>
          </li>
          <li className="flex sm:flex-row flex-col w-full border border-gray-500 border-x-0">
            <div className="bg-gray-950 sm:border-r sm:border-b-0 border-b border-r-0 border-gray-500 w-full font-semibold sm:text-lg stext-base px-3 py-3 flex items-center text-yellow-500">
              Shipping details
            </div>
            <div className="bg-gray-950 w-full text-gray-200 p-2 sm:text-base text-sm">
              <p>
                <span className="font-semibold">Address</span> :{" "}
                {cart.shippingAddress.address}
              </p>
              <p>
                <span className="font-semibold">Phone Number</span> :{" "}
                {cart.shippingAddress.phoneNumber}
              </p>
              <p>
                <span className="font-semibold">City</span> :{" "}
                {cart.shippingAddress.city}
              </p>
              <p>
                <span className="font-semibold">Country</span> :{" "}
                {cart.shippingAddress.country}
              </p>
              <p>
                <span className="font-semibold">Postal Code</span> :{" "}
                {cart.shippingAddress.postalCode}
              </p>
            </div>
          </li>
          <li className="flex sm:flex-row flex-col w-full ">
            <div className="bg-gray-950 sm:border-r sm:border-b-0 border-b border-r-0 border-gray-500 w-full font-semibold sm:text-lg stext-base px-3 py-3 flex items-center text-yellow-500">
              Summary
            </div>
            <div className="bg-gray-950 w-full text-gray-200 p-2 sm:text-base text-sm">
              <p>
                <span className="font-semibold">Total Price : </span>$
                {cart.itemsPrice}
              </p>
              <p>
                <span className="font-semibold">Payment Method : </span>On
                Delivery
              </p>
            </div>
          </li>
        </ul>
        <button
          disabled={isLoading}
          onClick={confirmOrder}
          className="w-full text-black bg-yellow-500 mt-4 rounded cursor-pointer font-semibold py-1 hover:bg-yellow-400 transition-all duration-300"
        >
          Confirm Order
        </button>
      </div>
    </section>
  );
};
export default Summary;
