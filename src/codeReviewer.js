import { readFileContent } from "./fileUtils.js";
import { generateAICodeReview } from "./aiGenerator.js";
import { getStagedFiles } from "./gitUtils.js";
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

/**
 * Reviews all staged files using AI.
 */
export async function reviewStagedFiles() {
  console.log(chalk.blue("🔍 Finding staged files..."));
  const stagedFiles = await getStagedFiles();

  if (stagedFiles.length === 0) {
    throw new Error(
      "No staged changes found to review. Stage your changes first using 'git add'."
    );
  }

  console.log(
    chalk.blue(
      `🤖 Found ${stagedFiles.length} staged file(s). Generating AI code review for each...`
    )
  );

  for (const filePath of stagedFiles) {
    console.log(chalk.yellow(`\n--- Reviewing: ${filePath} ---`));
    try {
      const fileContent = readFileContent(filePath);
      if (!fileContent || fileContent.trim() === "") {
        console.log(chalk.gray(`Skipping empty or binary file: ${filePath}`));
        continue;
      }
      const review = await generateAICodeReview(fileContent, filePath);
      console.log(chalk.cyan(review));
    } catch (error) {
      console.error(
        chalk.red(`❌ Failed to review ${filePath}: ${error.message}`)
      );
    }
  }
}