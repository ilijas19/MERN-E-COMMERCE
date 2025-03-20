import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useToggleFavoriteProductMutation } from "../../redux/api/productsApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toggleFromFavorite } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

type AddToFavoriteProps = {
  productId: string;
  favorites: string[] | undefined;
};

const AddToFavorite = ({ productId, favorites }: AddToFavoriteProps) => {
  const isFavorite = favorites?.some((fav) => fav === productId);

  const dispatch = useDispatch();
  const [toggleApiHandler, { isLoading: toggleLoading }] =
    useToggleFavoriteProductMutation();

  const toggleFavorite = async (id: string) => {
    try {
      const res = await toggleApiHandler(id).unwrap();
      dispatch(toggleFromFavorite({ id }));
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <FaHeart
      className={`${isFavorite ? "text-red-600" : "text-white"} ${
        toggleLoading
          ? "pointer-events-none cursor-auto"
          : "pointer-events-auto cursor-pointer"
      }`}
      onClick={() => toggleFavorite(productId)}
    />
  );
};
export default AddToFavorite;
