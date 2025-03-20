import { useGetMyOrdersQuery } from "../../redux/api/ordersApiSlice";
import Loader from "../../components/Loader";
import { formatDate } from "../../utils/formatString";
import { FaRegEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router";

const MyOrders = () => {
  const { data: orders, isLoading } = useGetMyOrdersQuery();
  const { userDetails } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const openOrder = (id: string) => {
    navigate(`/order/${id}`);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="text-white max-w-[1000px] mx-auto px-4 py-6 flex flex-col">
      <div className="flex justify-between items-center ">
        <p className="text-sm text-gray-400">Manage Orders</p>
        <p className="text-sm text-gray-400">Total Orders {orders?.nbHits}</p>
      </div>

      <div className="flex justify-between items-center mb-4 sm:flex-row flex-col">
        <h2 className="font-semibold text-2xl mb-2 sm:mb-0">My Orders</h2>

        <div className="flex gap-3"></div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg scrollbar">
        <table className=" w-full min-w-[700px] border-collapse bg-gray-900 text-white border-b border-gray-700">
          <thead>
            <tr className="bg-gray-800 border border-gray-500">
              <th className="font-semibold text-center p-3  whitespace-nowrap">
                Username
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                Price
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                Status
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap">
                Date
              </th>
              <th className="font-semibold text-center p-3 whitespace-nowrap w-[7rem]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.orders.map((order) => (
              <tr>
                <td className="border border-gray-500 p-2 py-3.5 text-nowrap text-center">
                  {userDetails?.username}
                </td>
                <td className="border border-gray-500 p-2 text-gray-400 text-nowrap text-center">
                  $ {order.itemsPrice}
                </td>
                <td
                  className={`text-center text-nowrap border border-gray-500 p-2 ${
                    order?.shippingStatus === "accepted"
                      ? "text text-green-500"
                      : order?.shippingStatus === "rejected" ||
                        order?.shippingStatus === "canceled"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {order.shippingStatus}
                </td>
                <td className="text-center text-nowrap border border-gray-500 p-2 text-gray-400">
                  {formatDate(order.createdAt)}
                </td>
                <td className="border border-gray-500 p-3 text-gray-400 text-center ">
                  <div className="flex gap-4 items-center justify-center">
                    <FaRegEye
                      size={20}
                      className="text-yellow-500 cursor-pointer"
                      onClick={() => openOrder(order._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
export default MyOrders;
