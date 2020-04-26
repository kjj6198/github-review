import countLongTimePR from "../countLongTimePR";
import countCommit from "../countCommit";
import countCriticizingPR from "../countCriticizingPR";
import countContribution from "../countContribution";

const prs = [
  {
    mergedAt: new Date("2020-04-06").toDateString(),
    createdAt: new Date("2020-04-02").toDateString(),
    commits: { totalCount: 10 },
    comments: { totalCount: 10 },
    additions: 100,
    deletions: 100,
  },
  {
    mergedAt: new Date("2020-04-10").toDateString(),
    createdAt: new Date("2020-04-02").toDateString(),
    commits: { totalCount: 11 },
    comments: { totalCount: 11 },
    additions: 100,
    deletions: 100,
  },
  {
    mergedAt: new Date("2020-04-04").toDateString(),
    createdAt: new Date("2020-04-03").toDateString(),
    commits: { totalCount: 1 },
    comments: { totalCount: 12 },
    additions: 100,
    deletions: 100,
  },
];

describe("countLongTimePR", () => {
  it("should count long pr 2", () => {
    expect(countLongTimePR(prs)).toBe(2);
  });
});

describe("countCommit", () => {
  it("commit count should be 22", () => {
    expect(countCommit(prs)).toBe(22);
  });
});

describe("countCriticizing", () => {
  it("should be 3", () => {
    expect(countCriticizingPR(prs)).toBe(3);
  });
});

describe("count contributions", () => {
  it("commit count should be 22", () => {
    expect(countContribution(prs)).toEqual({
      additions: 300,
      deletions: 300,
    });
  });
});
