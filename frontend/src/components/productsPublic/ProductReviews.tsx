import { useState } from "react";
import { Review } from "../../types";
import { formatDate } from "../../utils/formatString";
import RatingStars from "./RatingStars";

type ProductReviewsProps = {
  reviews: Review[] | [];
};

const ProductReviews = ({ reviews }: ProductReviewsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(reviews.length / reviewsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ul>
      <h2 className="text-center font-semibold mt-2 mb-2 text-gray-400">
        Reviews
      </h2>
      {currentReviews.map((review) => (
        <li
          key={review._id}
          className="bg-gray-900 rounded p-2 flex flex-col gap-1 mb-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="">{review.title}</h3>
            <p className="text-gray-400">{formatDate(review.createdAt)}</p>
          </div>
          {<RatingStars rating={review.rating} />}
          <p className="text-gray-300">{review.comment}</p>
        </li>
      ))}
      <div className="flex justify-center gap-3" hidden={reviews.length === 0}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Prev
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage)}
          className={`px-3 py-1 rounded ${
            currentPage === Math.ceil(reviews.length / reviewsPerPage)
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </ul>
  );
};

export default ProductReviews;
