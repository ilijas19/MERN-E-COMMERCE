import { Link } from "react-router";
import Carousel from "../../components/homePage/Carousel";
import TopCategories from "../../components/homePage/TopCategories";
const Home = () => {
  return (
    <div className="text-white max-w-[1000px] mx-auto">
      <Carousel />
      <TopCategories />
      <div className="flex justify-center">
        <Link to={"/shop"} className=" my-4  text-yellow-500">
          Go To Shop{" "}
        </Link>
      </div>
    </div>
  );
};
export default Home;
