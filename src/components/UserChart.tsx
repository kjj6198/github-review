import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/react-hooks";
import { GithubUser, GithubSearchResponse } from "../types";
import LoadingCircle from "./LoadingCircle";
import { COUNT_QUERY, PULL_REQUESTS_QUERY } from "../queries";

const ChartContainer = styled.div`
  flex: 1;
  margin-left: 3px;
`;

const Bar = styled.div<{ barWidth: number }>`
  display: inline-block;
  height: 10px;
  margin-right: 3px;
  /* left some space to add text */
  max-width: calc(100% - 80px);
  width: ${(props) => props.barWidth * 100}%;
  background-color: #aaa;
  will-change: width;
  transition: 0.6s ease-in-out width;
  background-image: linear-gradient(90deg, #fff, ${(props) => props.color});
`;

type QueryFn = (user: GithubUser) => string;
type Props = {
  user: GithubUser;
  scale: (value: number) => number;
  countBy: any;
  query?: QueryFn;
  color?: string;
  onDataLoaded?: (data: any, count: number) => void;
  useCountQuery?: boolean;
  calculateFn: any;
};

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
  color,
}) => {
  const [count, setCount] = useState(0);
  const { loading, data } = useQuery<GithubSearchResponse<GithubUser[]>>(
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
  }, [loading, data, useCountQuery, calculateFn]);

  if (!user || loading || !data) {
    return <LoadingCircle width={15} />;
  }

  return (
    <ChartContainer>
      <Bar color={color} barWidth={scale(count)} />
      <span>{formatNumber(count)}</span>
    </ChartContainer>
  );
};

export default UserChart;
