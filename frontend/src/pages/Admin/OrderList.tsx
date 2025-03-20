import { useState } from "react";
import {
  useCountTotalOrdersQuery,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
} from "../../redux/api/ordersApiSlice";
import Loader from "../../components/Loader";
import { formatDate } from "../../utils/formatString";
import { FaRegEye, FaTrash } from "react-icons/fa";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { useNavigate } from "react-router";
import Modal from "../../components/Modal";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import DeleteOrderPopup from "../../components/order/DeleteOrderPopup";

const OrderList = () => {
  const [page, setPage] = useState<number>(1);
  const [shippingStatus, setShippingStatus] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [deletingOrder, setDeletingOrder] = useState("");
  const navigate = useNavigate();

  const {
    data: orders,
    isLoading,
    refetch,
  } = useGetAllOrdersQuery({
    page,
    shippingStatus,
  });
  const { data: ordersCount } = useCountTotalOrdersQuery();
  const [deleteApiHandler, { isLoading: deleteLoading }] =
    useDeleteOrderMutation();

  const openOrder = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteApiHandler(id).unwrap();
      toast.success(res.msg);
      refetch();
      setModalOpen(false);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="text-white max-w-[1000px] mx-auto px-4 py-6 flex flex-col">
      <div className="flex justify-between items-center ">
        <p className="text-sm text-gray-400">Manage Orders</p>
        <p className="text-sm text-gray-400">
          Total Orders {ordersCount?.totalOrders}
        </p>
      </div>

      <div className="flex justify-between items-center mb-4 sm:flex-row flex-col">
        <h2 className="font-semibold text-2xl mb-2 sm:mb-0">Orders</h2>

        <div className="flex gap-3">
          <select
            onChange={(e) => setShippingStatus(e.target.value)}
            className={`bg-gray-800 rounded-lg px-2 py-1  ${
              shippingStatus === "accepted"
                ? "text text-green-500"
                : shippingStatus === "rejected" || shippingStatus === "canceled"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            <option className="bg-gray-800 text-white" value="">
              All
            </option>
            <option className="bg-gray-800 text-white" value="accepted">
              Accepted
            </option>
            <option className="bg-gray-800 text-white" value="sent">
              Sent
            </option>
            <option className="bg-gray-800 text-white" value="canceled">
              Canceled
            </option>
            <option className="bg-gray-800 text-white" value="rejected">
              Rejected
            </option>
          </select>
        </div>
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
                  {order.user &&
                    typeof order.user === "object" &&
                    order.user.username}
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
                    <FaTrash
                      onClick={() => {
                        setDeletingOrder(order._id);
                        setModalOpen(true);
                      }}
                      size={18}
                      className="text-red-500 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setPage(orders.page - 1)}
            disabled={orders.page - 1 === 0}
            className={`flex items-center gap-1 px-2 py-1 border border-gray-700 rounded-lg text-white transition-all duration-300
                   ${
                     orders.page - 1 === 0
                       ? "opacity-50 cursor-not-allowed"
                       : "hover:bg-gray-700 cursor-pointer"
                   }`}
          >
            <GrLinkPrevious /> Prev
          </button>

          <span className="text-white font-semibold">Page {orders.page}</span>

          <button
            onClick={() => setPage(orders.page + 1)}
            disabled={!orders.nextPage || orders.nbHits < 10}
            className={`flex items-center gap-1 px-2 py-1 border border-gray-700 rounded-lg text-white transition-all duration-300
                   ${
                     !orders.nextPage || orders.nbHits < 10
                       ? "opacity-50 cursor-not-allowed"
                       : "hover:bg-gray-700 cursor-pointer"
                   }`}
          >
            Next <GrLinkNext />
          </button>
        </div>
      )}
      <Modal isModalOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <DeleteOrderPopup
          deleteLoading={deleteLoading}
          onClose={() => setModalOpen(false)}
          orderToDelete={deletingOrder}
          handleDelete={handleDelete}
        />
      </Modal>
    </section>
  );
};
export default OrderList;
