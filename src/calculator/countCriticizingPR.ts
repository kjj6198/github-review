import { PullRequest } from "./types";

export default function countCriticizingPR(pullRequests: PullRequest[]) {
  let count = 0;
  pullRequests.forEach(function countCommitFn(pr) {
    if (pr.comments.totalCount) {
      count += 1;
    }
  });

  return count;
}
