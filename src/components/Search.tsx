import React, { useEffect, useRef, useState } from "react";
import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { GithubUser } from "../types";

const userFields = gql`
  fragment GithubUserField on User {
    id
    name
    bio
    login
    avatarUrl
    followers {
      totalCount
    }
    following {
      totalCount
    }
    pullRequests {
      totalCount
    }
  }
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const GITHUB_USER_QUERY = gql`
  ${userFields}
  query searchGithubUser($query: String!, $after: String) {
    search(type: USER, query: $query, after: $after, first: 5) {
      edges {
        node {
          ...GithubUserField
        }
      }
    }
  }
`;

interface GraphQLResponse<T> {
  edges: {
    cursor: string;
    node: T;
  }[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
  };
}

const Search: React.FC<{ onClick?: (node: GithubUser) => void }> = ({
  onClick,
}) => {
  const [getUser, { loading, data, error }] = useLazyQuery<{
    search: GraphQLResponse<GithubUser>;
  }>(GITHUB_USER_QUERY);
  const timer = useRef<number | null>(null);

  const [val, setVal] = useState("");
  useEffect(() => {
    if (val.length >= 3) {
      timer.current = setTimeout(
        () =>
          getUser({
            variables: {
              query: val,
            },
          }),
        500
      );
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = null;
    };
  }, [val, getUser]);

  if (error) {
    return <span>error</span>;
  }

  return (
    <div>
      <input value={val} onChange={(e) => setVal(e.target.value)} />
      <ul>
        {data?.search.edges.map(({ node }) => (
          <li key={node.id}>
            <Avatar src={node.avatarUrl} alt="avatar" />
            <span>{node.name}</span>
            <span>pull request: {node.pullRequests.totalCount}</span>

            <button
              onClick={function handleClick() {
                if (onClick) {
                  onClick(node);
                }
              }}
            >
              +
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
