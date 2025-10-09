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

export async function getRecentCommits(count = 20) {
  try {
    const log = await git.log({
      n: count,
      format: {
        hash: "%h",
        date: "%ar",
        message: "%s",
        author: "%an",
      },
    });
    return log.all;
  } catch (err) {
    throw new Error("❌ Could not retrieve git history.");
  }
}

export async function getStagedFiles() {
  const diff = await git.diff(["--staged", "--name-only"]);
  if (!diff) {
    return [];
  }
  return diff.split("\n").filter((file) => file.trim() !== "");
}