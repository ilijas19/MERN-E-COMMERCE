import { useNavigate, useParams } from "react-router";
import {
  useCancelOrderMutation,
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
} from "../../redux/api/ordersApiSlice";
import Loader from "../../components/Loader";
import OrderTable from "./OrderTable";
import { CartProduct } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { id } = useParams();
  const { userDetails } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const {
    data: order,
    isLoading,
    refetch,
    isError,
  } = useGetSingleOrderQuery(id ?? "");

  const [cancelApiHandler, { isLoading: cancelLoading }] =
    useCancelOrderMutation();
  const [updateStatusApiHandler, { isLoading: updateStatusLoading }] =
    useUpdateOrderStatusMutation();

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    navigate("/");
  }
  const cartItems: CartProduct[] = order?.order.orderItems
    ? order.order.orderItems
        .map((item) => {
          if (typeof item.product === "object") {
            return { ...item.product, qty: item.qty };
          }
        })
        .filter((item): item is CartProduct => item !== undefined)
    : [];

  const cancelHandler = async () => {
    try {
      const res = await cancelApiHandler({ id: id ?? "" }).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      const res = await updateStatusApiHandler({
        id: id ?? "",
        status: status,
      }).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <h2 className="text-white text-center text-lg font-semibold py-2">
        Order
      </h2>
      <OrderTable cartItems={cartItems} />
      <div className="px-4 mt-4">
        <h2 className="text-white font-semibold text-lg">Order Details</h2>
        <ul className="w-full text-white border border-gray-500 ">
          <li className="flex sm:flex-row flex-col w-full ">
            <div className="bg-gray-950 sm:border-r sm:border-b-0 border-b border-r-0 border-gray-500 w-full font-semibold sm:text-lg stext-base px-3 py-3 flex items-center text-yellow-500">
              User Info
            </div>
            <div className="bg-gray-950 w-full text-gray-200 p-2 sm:text-base text-sm">
              <p>
                <span className="font-semibold">Name</span> :{" "}
                {order && typeof order.order.user === "object"
                  ? order.order.user.username
                  : ""}
              </p>
              <p>
                <span className="font-semibold">Email</span> :{" "}
                {order && typeof order.order.user === "object"
                  ? order.order.user.email
                  : ""}
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
                {order && order.order.shippingAddress.address}
              </p>
              <p>
                <span className="font-semibold">Phone Number</span> :{" "}
                {order && order?.order.shippingAddress.phoneNumber}
              </p>
              <p>
                <span className="font-semibold">City</span> :{" "}
                {order && order.order.shippingAddress.city}
              </p>
              <p>
                <span className="font-semibold">Country</span> :{" "}
                {order && order.order.shippingAddress.country}
              </p>
              <p>
                <span className="font-semibold">Postal Code</span> :{" "}
                {order && order.order.shippingAddress.postalCode}
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
                {order && order.order.itemsPrice}
              </p>
              <p>
                <span className="font-semibold">Payment Method : </span>On
                Delivery
              </p>
              <p>
                <span className="font-semibold">Status : </span>
                <span
                  className={`${
                    order?.order.shippingStatus === "accepted"
                      ? "text text-green-500"
                      : order?.order.shippingStatus === "rejected" ||
                        order?.order.shippingStatus === "canceled"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {order && order.order.shippingStatus}
                </span>
              </p>
            </div>
          </li>
        </ul>
        {userDetails?.isAdmin === true ? (
          <>
            <button
              onClick={() => handleStatusChange("sent")}
              disabled={updateStatusLoading}
              className="w-full text-black bg-yellow-500 mt-4 rounded cursor-pointer font-semibold py-1 hover:bg-yellow-400 transition-all duration-300"
            >
              Mark As Sent
            </button>
            <button
              onClick={() => handleStatusChange("rejected")}
              disabled={updateStatusLoading}
              className="w-full text-white bg-red-600 mt-3 rounded cursor-pointer font-semibold py-1 hover:bg-red-500 transition-all duration-300"
            >
              Reject Order
            </button>
          </>
        ) : (
          <button
            onClick={cancelHandler}
            disabled={cancelLoading}
            className="w-full text-white bg-red-600 mt-4 rounded cursor-pointer font-semibold py-1 hover:bg-red-500 transition-all duration-300"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};
export default OrderDetails;
// http://localhost:5173/order/67d7e95274449889eebc9945
