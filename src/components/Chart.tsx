import React, { useRef, useState, useMemo } from "react";
import { GithubUser } from "../types";
import GithubAvatar from "./GithubAvatar";
import Box from "./Box";
import styled from "styled-components";
import UserChart from "./UserChart";
import { buildScale, findMinMax } from "../utils";

type QueryFn = (user: GithubUser) => string;
type Props = {
  title: string;
  users: GithubUser[];
  calculateFn?: any;
  query?: QueryFn;
  useCountQuery?: boolean;
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

const Chart: React.FC<Props> = ({
  title,
  users,
  calculateFn,
  query,
  useCountQuery,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [counts, setCount] = useState<number[]>([]);

  const scale = useMemo(() => {
    const max = findMinMax(counts).max;
    const scale = buildScale(
      0,
      max
    )({
      min: 0,
      max: chartRef.current ? chartRef.current.clientWidth - 180 : 0,
    });
    return scale;
  }, [counts, chartRef]);

  return (
    <Box>
      <h3>{title}</h3>
      <div ref={chartRef}>
        {users.map((u) => (
          <Wrapper key={u.id}>
            <GithubAvatar login={u.login} avatarUrl={u.avatarUrl} />
            <UserChart
              user={u}
              countBy={calculateFn}
              scale={scale}
              query={query}
              calculateFn={calculateFn}
              useCountQuery={useCountQuery}
              onDataLoaded={(data, count) =>
                setCount((c) => [...c, useCountQuery ? data.issueCount : count])
              }
            />
          </Wrapper>
        ))}
      </div>
    </Box>
  );
};

export default Chart;
