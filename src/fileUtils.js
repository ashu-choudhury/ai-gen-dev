import fs from "fs";
import path from "path";
import chalk from "chalk";

/**
 * Get the root folder of the git repository.
 */
export function getGitRoot() {
  return process.cwd(); // Assuming CLI runs inside git repo
}

/**
 * Create a new file with given content.
 * @param {string} filePath - Optional relative path; defaults to git root
 * @param {string} fileName - Name of the file to create
 * @param {string} content - Content to write into the file
 */
export function createFile(filePath, fileName, content = "") {
  const dir = filePath ? path.resolve(filePath) : getGitRoot();
  const fullPath = path.join(dir, fileName);

  try {
    fs.mkdirSync(dir, { recursive: true }); // Ensure folder exists
    fs.writeFileSync(fullPath, content, { flag: "w" });
    console.log(chalk.green(`✅ File created: ${fullPath}`));
    return fullPath;
  } catch (err) {
    console.error(chalk.red(`❌ Failed to create file: ${err.message}`));
    throw err;
  }
}

/**
 * Append content to an existing file.
 * @param {string} filePath - Path to the file
 * @param {string} content - Content to append
 */
export function appendToFile(filePath, content) {
  const fullPath = path.resolve(filePath);
  try {
    fs.appendFileSync(fullPath, content + "\n");
    console.log(chalk.green(`✅ Content appended to: ${fullPath}`));
    return fullPath;
  } catch (err) {
    console.error(chalk.red(`❌ Failed to append to file: ${err.message}`));
    throw err;
  }
}

/**
 * Placeholder for future file utilities.
 * Examples:
 * - readFileContent(filePath)
 * - updateFileContent(filePath, transformFunction)
 * - deleteFile(filePath)
 */
export const fileUtils = {
  createFile,
  appendToFile,
};
