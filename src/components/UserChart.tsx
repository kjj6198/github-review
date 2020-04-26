import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { GithubUser } from "../types";
import LoadingCircle from "./LoadingCircle";

const ChartContainer = styled.div`
  flex: 1;
  margin-left: 3px;
`;

const Bar = styled.div<{ barWidth: number }>`
  display: inline-block;
  height: 10px;
  margin-right: 3px;
  /* left some space to add text */
  width: calc(${(props) => props.barWidth * 100}% - 100px);
  background-color: #aaa;
  will-change: width;
  transition: 0.6s ease-in-out width;
`;

type QueryFn = (user: GithubUser) => string;
type Props = {
  user: GithubUser;
  scale: (value: number) => number;
  countBy: any;
  query?: QueryFn;
  onDataLoaded?: (data: any, count: number) => void;
  useCountQuery?: boolean;
  calculateFn: any;
};

const COUNT_QUERY = gql`
  query CountQuery($query: String!) {
    search(type: ISSUE, first: 100, query: $query) {
      issueCount
    }
  }
`;

const PULL_REQUESTS_QUERY = gql`
  query GetPullRequestsByQuery($query: String!, $after: String) {
    search(type: ISSUE, first: 100, query: $query, after: $after) {
      issueCount
      edges {
        node {
          ... on PullRequest {
            id
            title
            createdAt
            mergedAt
            deletions
            additions
            merged
            milestone {
              id
              title
            }
            comments {
              totalCount
            }
            commits {
              totalCount
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const NUMBER_REG = /(\d)(?=(\d{3})+(?!\d))/g;
const DELIMITER = ",";

export function formatNumber(num: number, delimiter = DELIMITER) {
  const str = String(num);

  return str.replace(NUMBER_REG, `$1${delimiter}`);
}

const UserChart: React.FC<Props> = ({
  user,
  countBy,
  onDataLoaded,
  scale,
  query,
  useCountQuery,
  calculateFn,
}) => {
  const [count, setCount] = useState(0);
  const { loading, data, refetch } = useQuery(
    useCountQuery ? COUNT_QUERY : PULL_REQUESTS_QUERY,
    {
      variables: {
        query: query ? query(user) : `is:pr is:merged author:${user.login}`,
      },
      skip: !user,
    }
  );

  useEffect(() => {
    if (!loading && data) {
      if (onDataLoaded) {
        const count = useCountQuery
          ? data.search.issueCount
          : calculateFn(data.search.edges.map(({ node }: any) => node));
        setCount(count);
        onDataLoaded(data.search, count);
      }
    }
  }, [loading, data]);

  if (!user || loading || !data) {
    return <LoadingCircle width={15} />;
  }

  return (
    <ChartContainer>
      <Bar barWidth={scale(count)} />
      <span>{formatNumber(count)}</span>
    </ChartContainer>
  );
};

export default UserChart;
