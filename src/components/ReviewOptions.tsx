import React from "react";

type Props = {
  name: string;
  description: string;
};
const ReviewOption: React.FC<Props> = ({ name, description }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  );
};

export default ReviewOption;
