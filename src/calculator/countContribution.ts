import { PullRequest } from "./types";

export default function countContribution(pullRequests: PullRequest[]) {
  let additions = 0;
  // let deletions = 0;

  pullRequests.forEach(function countCommitFn(pr) {
    additions += pr.additions;
    // deletions += pr.deletions;
  });

  return additions;
}
