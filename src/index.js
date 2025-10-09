import chalk from "chalk";
import { checkGitRepo, getDiff, getCommitSha, commitMessage } from "./gitUtils.js";
import { generateAICommitMessage } from "./aiGenerator.js";

/**
 * Generate a git commit message with optional user instructions.
 * @param {boolean} autoCommit - if true, automatically commit
 * @param {string} userMessage - optional short message for AI focus
 */
export async function generateCommitMessage(autoCommit = false, userMessage = "") {
  await checkGitRepo();

  const diff = await getDiff();
  const sha = await getCommitSha();

  // Generate commit message using modular AI function
  const message = await generateAICommitMessage(diff, sha, userMessage);

  if (autoCommit) {
    await commitMessage(message);
    console.log(chalk.green(`✅ Committed with message:\n${message}`));
  } else {
    console.log(chalk.blue(`💡 Suggested commit message:\n${message}`));
  }

  return message;
}
