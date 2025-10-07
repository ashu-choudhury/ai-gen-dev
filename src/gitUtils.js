import simpleGit from "simple-git";
import chalk from "chalk";

const git = simpleGit();

export async function checkGitRepo() {
  try {
    await git.revparse(["--is-inside-work-tree"]);
  } catch {
    throw new Error("❌ Not a git repository. Please run inside a git repo.");
  }
}

export async function getDiff() {
  const diff = await git.diff(["--staged"]);
  if (!diff) {
    throw new Error(
      "⚠️ No staged changes found. Stage your changes using:\n" +
        "┌───────────────────────────────────────────────┐\n" +
        "│ git add <file>                                │\n" +
        "│ git add .                                     │\n" +
        "└───────────────────────────────────────────────┘"
    );
  }
  return diff;
}

export async function getCommitSha() {
  try {
    return await git.revparse(["--short", "HEAD"]);
  } catch {
    return "new-commit";
  }
}

export async function commitMessage(message) {
  await git.commit(message);
  console.log(chalk.green(`✅ Committed with message:\n${message}`));
}
