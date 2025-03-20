import { CartProduct } from "../../types";

type OrderTableProps = {
  cartItems: CartProduct[];
};

const OrderTable = ({ cartItems }: OrderTableProps) => {
  return (
    <div className="w-full overflow-x-auto px-4">
      <table className="text-white w-full max-w-[700px] min-w-[500px] overflow-x-scroll mx-auto  border border-gray-500 rounded">
        <thead className="font-semibold">
          <tr className=" ">
            <td className="p-1 border border-gray-500 w-30 ">Image</td>
            <td className="p-1 border border-gray-500">Product</td>
            <td className="p-1 border border-gray-500 w-30 ">Price</td>
            <td className="p-1 border border-gray-500 w-30 ">Quantity</td>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {cartItems &&
            cartItems.map((item) => (
              <tr key={item._id}>
                <td className=" place-items-center p-1.5 border border-gray-500">
                  <img
                    src={item.image}
                    alt=""
                    className="bg-gray-500 w-20 h-10 object-cover rounded"
                  />
                </td>
                <td className="  p-1.5 border border-gray-500">
                  <p>{item.name}</p>
                </td>
                <td className=" place-items-center p-1.5 border border-gray-500">
                  <p>${item.price}</p>
                </td>
                <td className=" place-items-center p-1.5 border border-gray-500">
                  <p>{item.qty}</p>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default OrderTable;
