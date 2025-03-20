import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Steps from "../../components/order/Steps";
import { saveShippingAddress } from "../../redux/features/cart/cartSlice";

const Shipping = () => {
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cart]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const shippingAddress = {
      address,
      city,
      postalCode,
      country,
      phoneNumber,
    };
    dispatch(saveShippingAddress(shippingAddress));
    navigate("/summary");
  };

  return (
    <section className="flex flex-col items-center max-w-[600px] mx-auto px-3">
      <Steps step1 step2 />
      <form
        onSubmit={handleSubmit}
        className="text-white flex flex-col w-full sm:gap-0.5"
      >
        <label>Address</label>
        <input
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          className="border border-gray-700 outline-none rounded py-1 px-3 mb-2"
          placeholder="Enter Address"
        />
        <label>Phone Number</label>
        <input
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="text"
          className="border border-gray-700 outline-none rounded py-1 px-3 mb-2"
          placeholder="Enter Phone Number"
        />
        <label>City</label>
        <input
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          type="text"
          className="border border-gray-700 outline-none rounded py-1 px-3 mb-2"
          placeholder="Enter City"
        />
        <label>Postal Code</label>
        <input
          required
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          type="text"
          className="border border-gray-700 outline-none rounded py-1 px-3 mb-2"
          placeholder="Enter Postal Code"
        />
        <label>Country</label>
        <input
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          type="text"
          className="border border-gray-700 outline-none rounded py-1 px-3 mb-2"
          placeholder="Enter Country"
        />
        <button className="bg-yellow-500 text-black font-semibold rounded mt-1 py-0.5 cursor-pointer hover:bg-yellow-400 transition-all duration-300">
          Continue
        </button>
      </form>
    </section>
  );
};
export default Shipping;
