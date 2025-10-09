import { getRecentCommits } from "./gitUtils.js";
import { generateAIChangelog } from "./aiGenerator.js";
import { createFile } from "./fileUtils.js";
import path from "path";
import chalk from "chalk";

/**
 * Prepare commit history string for AI prompt.
 * @param {Array<object>} commits - Array of commit objects from simple-git
 * @returns {string}
 */
function prepareCommitHistory(commits) {
  return commits
    .map(
      (commit) =>
        `- ${commit.hash} (${commit.date}): ${commit.message} [${commit.author}]`
    )
    .join("\n");
}

/**
 * Generate CHANGELOG.md content using Gemini AI
 * @param {object} options - Optional options:
 *   - previewOnly {boolean} → if true, do not save file
 *   - extraPrompt {string} → additional instructions for AI
 * @returns {string} Generated CHANGELOG content
 */
export async function generateChangelog(options = {}) {
  const { previewOnly = false, extraPrompt = "" } = options;
  const rootDir = process.cwd();

  console.log(chalk.blue("🔍 Reading git history..."));
  const commits = await getRecentCommits(20);
  if (commits.length === 0) {
    throw new Error("No commits found in the repository.");
  }

  const commitHistory = prepareCommitHistory(commits);

  console.log(chalk.blue("🤖 Generating CHANGELOG using AI..."));
  const changelogContent = await generateAIChangelog(
    commitHistory,
    extraPrompt
  );

  if (!previewOnly) {
    const changelogPath = path.join(rootDir, "CHANGELOG.md");
    createFile(rootDir, "CHANGELOG.md", changelogContent);
    console.log(chalk.green(`✅ CHANGELOG.md generated at ${changelogPath}`));
  } else {
    console.log(chalk.yellow("⚠️ Preview mode: CHANGELOG not saved to disk."));
  }

  return changelogContent;
}