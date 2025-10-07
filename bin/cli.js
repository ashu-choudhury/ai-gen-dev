#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { generateCommitMessage } from "../src/index.js";
import { generateReadme } from "../src/readmeGenerator.js";
import { setApiKey } from "../src/config.js";

const program = new Command();

program
  .name("ai-gen-dev")
  .description("AI-powered developer automation toolkit")
  .version("1.3.1");

// ----- Configure API Key -----
program
  .command("config")
  .description("Configure Gemini API key")
  .argument("<key>", "Gemini API key")
  .action(async (key) => {
    try {
      await setApiKey(key);
      console.log(chalk.green("✅ API key saved successfully"));
    } catch (err) {
      console.error(chalk.red("❌ Failed to save API key:", err.message));
    }
  });

// ----- Generate commit message (default command) -----
program
  .command("git")
  .description("Generate commit message")
  .option("-c, --commit", "Automatically commit with generated message")
  .option("-m, --message <text>", "Optional short instruction for AI to focus on")
  .action(async (options) => {
    try {
      await generateCommitMessage(options.commit, options.message || "");


    } catch (error) {
      console.error(chalk.red("❌ Error:", error.message));
      process.exit(1);
    }
  });

// ----- Generate README -----
program
  .command("readme")
  .description("Generate README.md for the project")
  .option("-c, --create", "Automatically save README.md to project root")
  .option("-m, --message <text>", "Optional short instruction for AI to focus on")
  .action(async (options) => {
    try {
      const readmeContent = await generateReadme(process.cwd(), {
        previewOnly: !options.create,
        extraPrompt: options.message || ""
      });

      if (!options.create) {
        console.log("\n💡 Generated README preview:\n");
        console.log(chalk.cyan(readmeContent));
        console.log("\nUse '-c' to save this README.md in project root.");
      } else {
        console.log(chalk.green("\n✅ README.md generated and saved successfully."));
      }
    } catch (err) {
      console.error(chalk.red("❌ Failed to generate README:", err.message));
      process.exit(1);
    }
  });
// ----- Future Commands Placeholder -----
// e.g., changelog generator, version bumping, etc.

program.parse();
