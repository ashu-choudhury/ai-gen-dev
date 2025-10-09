import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey } from "./config.js";

/**
 * Generate AI-based commit message
 * @param {string} diff - git diff content
 * @param {string} sha - short commit SHA
 * @param {string} userMessage - optional instruction for AI to focus on
 * @returns {string} - generated commit message
 */
export async function generateAICommitMessage(diff, sha, userMessage = "") {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  let prompt;

  if (userMessage.trim()) {
    // Use user's instruction exclusively
    prompt = `Generate a git commit message for the following changes. User instruction: ${userMessage}\n\nCode changes:\n${diff}\nCommit SHA: ${sha}`;
  } else {
    // Default instructions if user provides nothing
    prompt = `
Generate a clear, descriptive git commit message for the following code changes.

Rules:
- Use Conventional Commits format: type(scope): description
- Subject + body must be under 400 characters
- List all significant changes (major + minor)
- Mention affected files, features, or modules
- End with commit SHA in this format: (commit: ${sha})
- Make the message fully understandable without seeing the diff

Code changes:
${diff}
`;
  }

  const result = await model.generateContent(prompt, {
    temperature: 0.5,
  });

  return result.response.text().trim();
}

/**
 * Generate AI-based README content
 * @param {string} projectOverview - string representation of file structure & content
 * @param {string} extraInstructions - optional instructions for AI to customize README
 * @returns {string} - generated README content
 */
export async function generateAIReadme(projectOverview, extraInstructions = "") {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  let prompt;

  if (false) {
    // User instruction only
    prompt = `${extraInstructions}\n\nProject overview:\n${projectOverview}`;
  } else {
    // Default README instructions
prompt = `
You are an expert AI software engineer and technical writer.
I will provide you a project overview containing only hints about file names, folders, and components.
Your task is to generate a **professional, complete, GitHub-ready README.md** file.

Follow these instructions **strictly**:

1. DO NOT include full source code of files.  
2. DO NOT output file listings, folder structures, or summaries as the main content.  
3. Focus on **what the project does**, **its components**, **features**, and **purpose**.  
4. Write a **full project description**, explaining the problem it solves, the value it provides, and how it works at a high level.  
5. Include these sections in the README:

   - Project title  
   - Full description  
   - Installation instructions (step-by-step, including dependencies)  
   - Usage examples (commands, code snippets, or workflow examples)  
   - Key features (bullet points with real value)  
   - License information  
   - A welcoming/contribution section after the license, explaining the vibe of the project, why people will enjoy using it, and encouraging contributions  
   - Notes, tips, or important instructions for developers  

6. Use a **professional, clear, enthusiastic, and friendly tone**.  
7. If extra instructions are provided, follow them carefully. Otherwise, analyze the project and generate the README based on the provided hints.  

Project hints (analyze to understand the project, do not copy files or content):

${projectOverview}
Do not include, display, or reference any project structure, file names, folders, or source code in the README; focus only on describing the project’s purpose, features, usage, and value.
`;

  }

  const result = await model.generateContent(prompt, {
    temperature: 0.8,
  });

  return result.response.text().trim();
}
