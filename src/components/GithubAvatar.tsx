import React from "react";
import Avatar from "./Avatar";

type Props = {
  login: string;
  avatarUrl: string;
};
const GithubAvatar: React.FC<Props> = ({ login, avatarUrl }) => {
  return (
    <a href={`https://github.com/${login}`} title={login}>
      <Avatar src={avatarUrl} />
    </a>
  );
};

export default GithubAvatar;
