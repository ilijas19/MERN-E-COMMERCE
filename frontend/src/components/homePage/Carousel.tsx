import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RatingStars from "../productsPublic/RatingStars";
import { useGetTopProductsQuery } from "../../redux/api/productsApiSlice";
import { Link } from "react-router";
import Loader from "../Loader";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };
  const { data: products, isLoading } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div className="mt-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-[80%] mx-auto mt-4">
      <h2 className="font-semibold text-xl m-2">Recommended For You</h2>
      <Slider {...settings}>
        {products?.products &&
          products.products.map((product) => (
            <div key={product._id}>
              <figure className=" grid sm:grid-cols-2 grid-cols-1 rounded-xl overflow-hidden gap-1">
                <img
                  src={product.image}
                  alt="Slide 1"
                  className="w-full object-cover h-[15rem]  "
                />
                <figcaption className="p-1 pt-0 flex flex-col gap-1">
                  <p className="">{product.name}</p>
                  <RatingStars rating={product.averageRating} />
                  <p className="text-gray-400 text-sm sm:text-base">
                    {product.description}
                  </p>
                  <div className="flex  justify-between items-center mt-auto pt-2">
                    <p className="text-gray-300">$ {product.price}</p>
                    <Link
                      to={`/product/${product.id}`}
                      className="text-sm sm:text-base bg-yellow-500 text-black font-semibold  rounded px-2 py-0.5 cursor-pointer"
                    >
                      See more
                    </Link>
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default Carousel;
