import React, { useState, useEffect } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import Search from "./components/Search";
import options from "./config/options";
import ReviewOption from "./components/ReviewOptions";
import { GithubUser } from "./types";
import Chart from "./components/Chart";
import countLongTimePR from "./calculator/countLongTimePR";
import countCriticizingPR from "./calculator/countCriticizingPR";
import countCommits, { countComments } from "./calculator/countCommit";
import countContribution from "./calculator/countContribution";
import styled from "styled-components";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
});

const Container = styled.div`
  width: 95%;
  max-width: 1280px;
  margin: auto;
  padding: 15px;
`;

const ChartWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
`;

function App() {
  const [users, setUser] = useState<Map<string, GithubUser>>(new Map());

  return (
    <ApolloProvider client={client}>
      <Container className="App">
        <Search
          onClick={(node) => {
            if (!users.has(node.id)) {
              setUser((map) => new Map(map.set(node.id, node)));
            } else {
              users.delete(node.id);
              setUser(new Map(users));
            }
          }}
        />
        <div>
          {Array.from(users).map(([key, user]) => (
            <div key={key}>{user.name}</div>
          ))}
        </div>
        {/* <div>
          {Object.keys(options).map((key) => (
            <ReviewOption
              key={key}
              name={options[key].name}
              description={options[key].description}
            />
          ))}
        </div> */}
        <ChartWrapper>
          <Chart
            users={Array.from(users.values())}
            title={options.LONG_TIME_PR.name}
            calculateFn={countLongTimePR}
          />
          <Chart
            users={Array.from(users.values())}
            title={options.CREATED.name}
            query={(user) => `author:${user.login} is:merged is:pr`}
            useCountQuery
          />
          <Chart
            users={Array.from(users.values())}
            title={options.REQUESTED.name}
            query={(user) => `is:merged is:pr review-requested:${user.login}`}
            useCountQuery
          />

          <Chart
            users={Array.from(users.values())}
            title={options.REVIEWED.name}
            query={(user) => `is:merged is:pr reviewed-by:${user.login}`}
            useCountQuery
          />

          <Chart
            users={Array.from(users.values())}
            title={options.CRITICIZING.name}
            query={(user) => `is:merged is:pr author:${user.login}`}
            calculateFn={countCriticizingPR}
          />

          <Chart
            users={Array.from(users.values())}
            title={options.COMMITS.name}
            query={(user) => `is:merged is:pr author:${user.login}`}
            calculateFn={countCommits}
          />

          <Chart
            users={Array.from(users.values())}
            title={options.COMMENTS.name}
            query={(user) => `is:merged is:pr author:${user.login}`}
            calculateFn={countComments}
          />

          <Chart
            users={Array.from(users.values())}
            title={options.CONTRIBUTION.name}
            query={(user) => `is:merged is:pr author:${user.login}`}
            calculateFn={countContribution}
          />
        </ChartWrapper>
      </Container>
    </ApolloProvider>
  );
}

export default App;
