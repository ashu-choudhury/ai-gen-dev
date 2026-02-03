import chalk from "chalk";
import path from "path";
import { generateAIPullRequest } from "./aiGenerator.js";
import { getRecentCommits, getStagedDiff, getStagedFiles } from "./gitUtils.js";
import { createFile, ensureDirectory } from "./fileUtils.js";

/**
 * Generate a pull request title/body using AI.
 * @param {object} options - Optional options:
 *   - previewOnly {boolean} → if true, do not save file
 *   - extraPrompt {string} → additional instructions for AI
 *   - outputPath {string} → override output template path
 * @returns {{title: string, body: string, raw: string}}
 */
export async function generatePullRequest(options = {}) {
  const {
    previewOnly = false,
    extraPrompt = "",
    outputPath = ".github/pull_request_template.md",
  } = options;

  console.log(chalk.blue("🔍 Gathering staged changes..."));
  const [diff, commits, files] = await Promise.all([
    getStagedDiff(),
    getRecentCommits(10),
    getStagedFiles(),
  ]);

  if (!diff) {
    throw new Error(
      "⚠️ No staged changes found. Stage your changes using:\n" +
        "┌───────────────────────────────────────────────┐\n" +
        "│ git add <file>                                │\n" +
        "│ git add .                                     │\n" +
        "└───────────────────────────────────────────────┘"
    );
  }

  console.log(chalk.blue("🤖 Generating PR description using AI..."));
  const raw = await generateAIPullRequest({
    diff,
    commits,
    files,
    userMessage: extraPrompt,
  });

  const [titleLine, ...bodyLines] = raw.split(/\r?\n/);
  const title = titleLine?.trim() || "Update changes";
  const body = bodyLines.join("\n").trim();

  if (!previewOnly) {
    const resolvedOutputPath = path.resolve(process.cwd(), outputPath);
    ensureDirectory(path.dirname(resolvedOutputPath));
    createFile(path.dirname(resolvedOutputPath), path.basename(resolvedOutputPath), `${title}\n\n${body}\n`);
    console.log(
      chalk.green(`✅ PR template generated at ${resolvedOutputPath}`)
    );
  } else {
    console.log(chalk.yellow("⚠️ Preview mode: PR template not saved to disk."));
  }

  return { title, body, raw };
}
