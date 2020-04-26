import { gql } from "apollo-boost";

export const userFields = gql`
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

export const GITHUB_USER_QUERY = gql`
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

export const COUNT_QUERY = gql`
  query CountQuery($query: String!) {
    search(type: ISSUE, first: 100, query: $query) {
      issueCount
      edges {
        node {
          ... on PullRequest {
            id
            title
          }
        }
      }
    }
  }
`;

export const PULL_REQUESTS_QUERY = gql`
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
