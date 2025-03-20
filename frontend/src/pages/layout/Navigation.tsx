import { FaBars, FaHome } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineShoppingCart, AiOutlineShopping } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router";
import { FaRegHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { userDetails } = useSelector((state: RootState) => state.auth);

  const [logoutApiHandler] = useLogoutMutation();

  const handleLogoutHandler = async () => {
    try {
      const res = await logoutApiHandler().unwrap();
      dispatch(logout());

      toast.success(res.msg);
      navigate("/login", { replace: true });
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };
  useEffect(() => {}, [userDetails]);
  return (
    <nav className="border-b border-gray-700">
      {/* menu */}
      <div
        className={`fixed bg-gray-950  top-0 h-screen z-50 border-r border-gray-700  ${
          isSidebarOpen ? "w-44 left-0" : "w-0 -left-44"
        } transition-all duration-300`}
      >
        <IoMdClose
          onClick={() => setSidebarOpen(false)}
          size={22}
          className="text-white absolute right-2 top-2 cursor-pointer"
        />
        <ul className=" h-full p-6 mt-6 flex flex-col gap-6">
          <Link
            className="text-white flex items-center w-fit gap-2 cursor-pointer hover:translate-x-2 hover:underline  transition-all duration-300"
            to={"/"}
          >
            <FaHome size={24} />
            <p>Home</p>
          </Link>
          <Link
            className="text-white flex items-center w-fit gap-2 cursor-pointer hover:translate-x-2 hover:underline  transition-all duration-300"
            to={"/shop"}
          >
            <AiOutlineShopping size={24} />
            <p>Shop</p>
          </Link>
          <Link
            className="text-white flex items-center w-fit gap-2 cursor-pointer hover:translate-x-2 hover:underline  transition-all duration-300"
            to={"/cart"}
          >
            <AiOutlineShoppingCart size={24} />
            <p>Cart</p>
          </Link>
          <Link
            className="text-white flex items-center w-fit gap-2 cursor-pointer hover:translate-x-2 hover:underline  transition-all duration-300"
            to={"/favorites"}
          >
            <FaRegHeart size={24} />
            <p>Favorites</p>
          </Link>
          <div className="text-white mt-auto mb-6 flex items-center gap-2 self-center relative">
            {/* Profile Menu */}
            <div
              className={`absolute border-gray-700 rounded border w-fit px-2 flex flex-col gap-1 bg-gray-800 text-gray-200 p-1 bottom-6 left-1/2 transform -translate-x-1/2 ${
                isMenuOpen
                  ? "pointer-events-auto opacity-100"
                  : "opacity-0 pointer-events-none"
              } transition-all duration-300`}
            >
              {currentUser ? (
                <>
                  {currentUser.isAdmin && (
                    <>
                      <Link
                        onClick={() => {
                          setSidebarOpen(false);
                          setMenuOpen(false);
                        }}
                        to={"/admin/products"}
                        className="hover:bg-gray-600 p-1 rounded cursor-pointer"
                      >
                        Products
                      </Link>
                      <Link
                        onClick={() => {
                          setSidebarOpen(false);
                          setMenuOpen(false);
                        }}
                        to={"/admin/category"}
                        className="hover:bg-gray-600 p-1 rounded cursor-pointer"
                      >
                        Category
                      </Link>
                      <Link
                        onClick={() => {
                          setSidebarOpen(false);
                          setMenuOpen(false);
                        }}
                        to={"/admin/orders"}
                        className="hover:bg-gray-600 p-1 rounded cursor-pointer"
                      >
                        Orders
                      </Link>
                      <Link
                        onClick={() => {
                          setSidebarOpen(false);
                          setMenuOpen(false);
                        }}
                        to={"/admin/users"}
                        className="hover:bg-gray-600 p-1 rounded cursor-pointer"
                      >
                        Users
                      </Link>
                    </>
                  )}
                  {!currentUser.isAdmin && (
                    <Link
                      onClick={() => {
                        setSidebarOpen(false);
                        setMenuOpen(false);
                      }}
                      to={"/myOrders"}
                      className="hover:bg-gray-600 p-1 rounded cursor-pointer"
                    >
                      Orders
                    </Link>
                  )}
                  <Link
                    onClick={() => {
                      setSidebarOpen(false);
                      setMenuOpen(false);
                    }}
                    to={"/profile"}
                    className="hover:bg-gray-600 p-1 rounded cursor-pointer"
                  >
                    Profile
                  </Link>
                  <p
                    onClick={() => {
                      setSidebarOpen(false);
                      setMenuOpen(false);
                      handleLogoutHandler();
                    }}
                    className="hover:bg-gray-600 p-1 rounded cursor-pointer"
                  >
                    Logout
                  </p>
                </>
              ) : (
                <>
                  <Link
                    onClick={() => {
                      setSidebarOpen(false);
                      setMenuOpen(false);
                    }}
                    to={"/login"}
                    className="hover:bg-gray-600 p-1 rounded cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    onClick={() => {
                      setSidebarOpen(false);
                      setMenuOpen(false);
                    }}
                    to={"/register"}
                    className="hover:bg-gray-600 p-1 rounded cursor-pointer"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Username and Menu Toggle */}
            <p>{currentUser ? currentUser.username : "Guest"}</p>
            <FaBars
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="cursor-pointer"
            />
          </div>
        </ul>
      </div>

      {/* navigation */}
      <div className="flex items-center justify-between sm:gap-8 gap-4 sm:px-8 px-4  py-4">
        <FaBars
          onClick={() => setSidebarOpen(true)}
          size={24}
          className="text-gray-300 cursor-pointer"
        />

        <div className="flex items-center sm:gap-4 gap-3">
          <Link to={"/cart"}>
            <AiOutlineShoppingCart
              size={24}
              className="text-gray-300 cursor-pointer"
            />
          </Link>
          <Link to={"/profile"}>
            <AiOutlineUser size={24} className="text-gray-300 cursor-pointer" />
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
