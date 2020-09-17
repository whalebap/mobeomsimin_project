import React from "react";
import "./StarRating.css";

const StarRating = ({ ratingValue, ratingClick }) => {
  return (
    <>
      <span className="rating" value={ratingValue}>
        <input
          id="rating5"
          type="radio"
          name="rating"
          value="5"
          onClick={ratingClick}
        />
        <label for="rating5">5</label>
        <input
          id="rating4"
          type="radio"
          name="rating"
          value="4"
          onClick={ratingClick}
        />
        <label for="rating4">4</label>
        <input
          id="rating3"
          type="radio"
          name="rating"
          value="3"
          onClick={ratingClick}
        />
        <label for="rating3">3</label>
        <input
          id="rating2"
          type="radio"
          name="rating"
          value="2"
          onClick={ratingClick}
        />
        <label for="rating2">2</label>
        <input
          id="rating1"
          type="radio"
          name="rating"
          value="1"
          onClick={ratingClick}
        />
        <label for="rating1">1</label>
      </span>
    </>
  );
};

export default StarRating;
