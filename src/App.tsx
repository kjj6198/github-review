import React, { useState } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import Search from "./components/Search";
import { GithubUser } from "./types";
import Chart from "./components/Chart";
import countLongTimePR from "./calculator/countLongTimePR";
import countCriticizingPR from "./calculator/countCriticizingPR";
import countCommits, { countComments } from "./calculator/countCommit";
import countContribution from "./calculator/countContribution";
import styled from "styled-components";
import { useTranslation } from "./components/LanguageProvider";

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
  const { t } = useTranslation();

  return (
    <ApolloProvider client={client}>
      <Container>
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
        <ChartWrapper>
          <Chart
            users={Array.from(users.values())}
            title={t("long_time.name")}
            description={t("long_time.description", 10)}
            calculateFn={countLongTimePR}
          />
          <Chart
            users={Array.from(users.values())}
            title={t("created.name")}
            description={t("created.description")}
            query={(user) => `author:${user.login} is:merged is:pr`}
            useCountQuery
          />
          <Chart
            users={Array.from(users.values())}
            title={t("requested.name")}
            description={t("requested.description")}
            query={(user) => `is:merged is:pr review-requested:${user.login}`}
            useCountQuery
          />

          <Chart
            users={Array.from(users.values())}
            title={t("reviewed.name")}
            description={t("reviewed.description")}
            query={(user) => `is:merged is:pr reviewed-by:${user.login}`}
            useCountQuery
          />

          <Chart
            users={Array.from(users.values())}
            title={t("criticizing.name")}
            description={t("criticizing.description")}
            query={(user) => `is:merged is:pr author:${user.login}`}
            calculateFn={countCriticizingPR}
          />

          <Chart
            users={Array.from(users.values())}
            title={t("commits.name")}
            description={t("commits.description")}
            query={(user) => `is:merged is:pr author:${user.login}`}
            calculateFn={countCommits}
          />

          <Chart
            users={Array.from(users.values())}
            title={t("comments.title")}
            description={t("comments.description")}
            query={(user) => `is:merged is:pr author:${user.login}`}
            calculateFn={countComments}
          />

          <Chart
            users={Array.from(users.values())}
            title={t("contribution.name")}
            description={t("contribution.description")}
            query={(user) => `is:merged is:pr author:${user.login}`}
            calculateFn={countContribution}
          />
        </ChartWrapper>
      </Container>
    </ApolloProvider>
  );
}

export default App;
