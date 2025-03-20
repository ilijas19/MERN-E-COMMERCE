import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

type RatingStarsProps = {
  rating: number;
};

const RatingStars = ({ rating }: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: fullStars }, (_, i) => (
        <FaStar size={13} key={`full-${i}`} className="text-yellow-500" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
      {Array.from({ length: emptyStars }, (_, i) => (
        <FaRegStar size={13} key={`empty-${i}`} className="text-yellow-500" />
      ))}
    </div>
  );
};

export default RatingStars;
