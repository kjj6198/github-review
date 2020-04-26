import { PullRequest } from "./types";

export default function countCommits(pullRequests: PullRequest[]) {
  let count = 0;
  pullRequests.forEach(function countCommitFn(pr) {
    count += pr.commits.totalCount;
  });

  return count;
}

export function countComments(pullRequests: PullRequest[]) {
  let count = 0;
  pullRequests.forEach(function countCommitFn(pr) {
    count += pr.comments.totalCount;
  });

  return count;
}
