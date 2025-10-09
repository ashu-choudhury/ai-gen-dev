import { readFileContent } from "./fileUtils.js";
import { generateAICodeReview } from "./aiGenerator.js";
import chalk from "chalk";

/**
 * Reviews a specific file using AI.
 * @param {string} filePath - The path to the file to be reviewed.
 */
export async function reviewFile(filePath) {
  console.log(chalk.blue(`🔍 Reading file: ${filePath}...`));
  const fileContent = readFileContent(filePath);

  if (!fileContent) {
    throw new Error(`Could not read file or file is empty: ${filePath}`);
  }

  console.log(chalk.blue("🤖 Generating AI code review..."));
  const review = await generateAICodeReview(fileContent, filePath);

  console.log(chalk.cyan("\n💡 AI Code Review:\n"));
  console.log(review);
}