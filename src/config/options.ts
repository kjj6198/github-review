const options: {
  [key: string]: {
    name: string;
    description: string;
  };
} = {
  LONG_TIME_PR: {
    name: "🧐 搾時 Pull Request",
    description: "超過 3 天以上未 merged",
  },
  CONTRIBUTION: {
    name: "👍 貢獻",
    description: "貢獻的程式碼總數（增加及刪除）",
  },
  COMMITS: {
    name: "Commit 數",
    description: "Commit 的數量",
  },
  COMMENTS: {
    name: "留言數",
    description: "每個自己提交的 PR 中的留言數",
  },
  REVIEWED: {
    name: "👍 Reviewed PR",
    description:
      "Reviewed 過的 PR 總數（包含 approve, comment, requested change)",
  },
  CREATED: {
    name: "👍 提交 PR 總數",
    description: "提交的 PR 總數，只計算已 merged",
  },
  REQUESTED: {
    name: "👎 無回應的 Pull Request 數",
    description: "別人在 Pull Request 當中要求 Review，但你沒有回應",
  },
  CRITICIZING: {
    name: "🙌 有爭議的 Pull Request",
    description: "Comment 數大於 10",
  },
} as const;

export default options;
