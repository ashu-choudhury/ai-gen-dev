import simpleGit from "simple-git";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey } from "./config.js";

const git = simpleGit();

async function checkGitRepo() {
  try {
    await git.revparse(["--is-inside-work-tree"]);
  } catch (error) {
    throw new Error("Not a git repository");
  }
}

async function getDiff() {
  const diff = await git.diff(["--staged"]);
  if (!diff) {
    throw new Error(
      "No staged changes found. Stage your changes using:\n" +
        "┌───────────────────────────────────────────────┐\n" +
        "│ git add                            OR         │\n" +
        "│ git add .                          OR         │\n" +
        "│ git add <file>                                │\n" +
        "└───────────────────────────────────────────────┘"
    );
  }
  return diff;
}

async function generateCommitMessage(autoCommit = false) {
  await checkGitRepo();
  const diff = await getDiff();

  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" }); // Used for token count

  const prompt = `Generate a concise, meaningful git commit message for the following changes. 
Follow the Conventional Commits format (type(scope): description). 
The message should be under 50 characters.
Changes:
${diff}`;

  // Check token count before generating content
  const tokenCount = await model.countTokens(prompt);
  
  // If token count is greater than or equal to 1M, switch to pro model
  const finalModel = tokenCount.totalTokens >= 1000000 ? 
    (console.log(chalk.yellow(`Switching to pro model: gemini-1.5-pro as token count is ${tokenCount.totalTokens}`)), genAI.getGenerativeModel({ model: "gemini-1.5-pro" })) : 
    (console.log(chalk.green(`Using flash model: gemini-1.5-flash as token count is ${tokenCount.totalTokens}`)), genAI.getGenerativeModel({ model: "gemini-1.5-flash" }));

  const result = await finalModel.generateContent(prompt, {
    maxOutputTokens: 50,
    temperature: 1,
  });
  const message = result.response.text().trim();

  if (autoCommit) {
    await git.commit(message);
    console.log(`Committed with message: ${message}`);
  }

  return message;
}

export { generateCommitMessage };
