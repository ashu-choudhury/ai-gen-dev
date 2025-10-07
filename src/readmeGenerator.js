import { scanProject } from "./projectScanner.js";
import { generateAIReadme } from "./aiGenerator.js"; // Dedicated AI method for README
import { createFile } from "./fileUtils.js";
import path from "path";
import chalk from "chalk";

/**
 * Prepare project overview string for AI prompt.
 * Sends full content of all code/text files.
 * @param {object} projectJson - { filePath: content }
 * @returns {string}
 */
function prepareProjectOverview(projectJson) {
  let overview = "Project Overview:\n\n";
  for (const [filePath, content] of Object.entries(projectJson)) {
    overview += `File: ${filePath}\n`;
    overview += content + "\n\n"; // Full content
  }
  return overview;
}

/**
 * Generate README.md content using Gemini AI
 * @param {string} rootDir - Root folder of project
 * @param {object} options - Optional options:
 *   - previewOnly {boolean} → if true, do not save file
 *   - extraPrompt {string} → additional instructions for AI
 * @returns {string} Generated README content
 */
export async function generateReadme(rootDir = process.cwd(), options = {}) {
  const { previewOnly = false, extraPrompt = "" } = options;

  console.log(chalk.blue("🔍 Scanning project..."));
  const projectJson = await scanProject(rootDir);

  const projectOverview = prepareProjectOverview(projectJson);

  console.log(chalk.blue("🤖 Generating README using AI..."));
  const readmeContent = await generateAIReadme(projectOverview, extraPrompt);

  if (!previewOnly) {
    const readmePath = path.join(rootDir, "README.md");
    createFile(rootDir, "README.md", readmeContent);
    console.log(chalk.green(`✅ README.md generated at ${readmePath}`));
  } else {
    console.log(chalk.yellow("⚠️ Preview mode: README not saved to disk."));
  }

  return readmeContent;
}

/**
 * Utility function: preview README in console without saving
 */
export async function previewReadme(rootDir = process.cwd(), extraPrompt = "") {
  return generateReadme(rootDir, { previewOnly: true, extraPrompt });
}
