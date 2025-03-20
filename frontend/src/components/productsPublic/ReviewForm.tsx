import React, { useState } from "react";
import { useAddReviewMutation } from "../../redux/api/productsApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";

type ReviewFormProps = {
  id: string;
};

const ReviewForm = ({ id }: ReviewFormProps) => {
  const [title, setTitle] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const [addReviewApiHandler, { isLoading }] = useAddReviewMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (rating < 1) {
        return toast.error("Please Provide Valid Rating");
      }
      const res = await addReviewApiHandler({
        id,
        data: {
          title,
          rating,
          comment,
        },
      }).unwrap();
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
    <form onSubmit={submitHandler} className=" w-full px-2 py-1 flex flex-col ">
      <h2 className="font-semibold text-center text-gray-400">Leave Review</h2>
      <label>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        className="bg-gray-300 rounded outline-none mb-1 text-black px-2 py-1 font-semibold"
      />
      <label>Rating</label>
      <select
        onChange={(e) => setRating(+e.target.value)}
        className="bg-gray-300 rounded outline-none mb-1 text-black px-2 py-1 font-semibold"
      >
        <option className="bg-gray-300" value="0">
          Select Rating
        </option>
        <option className="bg-gray-300" value="1">
          Bad
        </option>
        <option className="bg-gray-300" value="2">
          Ok
        </option>
        <option className="bg-gray-300" value="3">
          Good
        </option>
        <option className="bg-gray-300" value="4">
          Very Good
        </option>
        <option className="bg-gray-300" value="5">
          Excellent
        </option>
      </select>
      <label>Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="bg-gray-300 rounded outline-none mb-1 text-black px-2 py-1 font-semibold"
      />
      <button
        disabled={isLoading}
        className="bg-yellow-500 text-black font-semibold px-2 mt-2 rounded cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};
export default ReviewForm;
