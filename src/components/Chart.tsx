import React, { useRef, useState, useMemo } from "react";
import { GithubUser, PullRequest } from "../types";
import GithubAvatar from "./GithubAvatar";
import Box from "./Box";
import styled from "styled-components";
import UserChart from "./UserChart";
import { buildScale, findMinMax } from "../utils";

type QueryFn = (user: GithubUser) => string;
type Props = {
  title: string;
  description: string;
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
  description,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<
    Map<string, { edges: { node: PullRequest }[] }>
  >(new Map());
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
      <p>{description}</p>
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
              onDataLoaded={(data, count) => {
                setCount((c) => [
                  ...c,
                  useCountQuery ? data.issueCount : count,
                ]);
                setData((d) => {
                  d.set(u.login, data);
                  return new Map(d);
                });
              }}
            />
          </Wrapper>
        ))}
      </div>
      <section>
        <h4>查看細節</h4>
        {Array.from(data).map(([key, val]) => {
          return (
            <details style={{ maxHeight: "200px", overflowY: "scroll" }}>
              <summary>{key}</summary>
              {val.edges.map(({ node }) => (
                <p>{node.title}</p>
              ))}
            </details>
          );
        })}
      </section>
    </Box>
  );
};

export default Chart;
