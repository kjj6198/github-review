import { PullRequest } from "./types";

const TRHREE_DAYS = 1000 * 60 * 60 * 24 * 5;

// definition: mergedAt - createdAt >= threshold
export default function countLongTimePR(
  pullRequests: PullRequest[],
  threshold = TRHREE_DAYS
) {
  let count = 0;
  for (let i = 0; i < pullRequests.length; i++) {
    if (
      new Date(pullRequests[i].mergedAt).getTime() -
        new Date(pullRequests[i].createdAt).getTime() >=
      threshold
    ) {
      count += 1;
    }
  }

  return count;
}
