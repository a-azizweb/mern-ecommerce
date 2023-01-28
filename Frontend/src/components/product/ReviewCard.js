import React from 'react';

import ProfilePng from '../../images/profilePng.png';
import DummyProfile from '../../images/DummyProfile.png';
import { Rating } from '@material-ui/lab';
import { useSelector } from 'react-redux';

const ReviewCard = ({ review }) => {
  const { user } = useSelector((state) => state.user);
  const options = {
    size: 'medium',
    value: review.rating,

    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="reviewCard">
      <img src={DummyProfile} alt="User" />
      <div className="reviewContent">
        <div className="name">
          <p>{review.name}</p>
          <Rating {...options} />
        </div>
        <span className="reviewCardComment">{review.comment}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
