# AI Development Rules

This document outlines the technical stack and specific rules for using libraries within the `ai-gen-dev` project. Following these guidelines ensures consistency, maintainability, and clarity in the codebase.

## Tech Stack

The `ai-gen-dev` CLI tool is built with the following technologies:

-   **Runtime**: [Node.js](https://nodejs.org/) (version >=18.0.0), providing the server-side JavaScript execution environment.
-   **Language**: JavaScript (ES Modules), utilizing modern `import`/`export` syntax.
-   **CLI Framework**: [Commander.js](https://github.com/tj/commander.js/) is used to build the command-line interface, parse arguments, and define commands.
-   **AI Integration**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) (`@google/generative-ai`) powers all AI-driven features by interacting with the Gemini API.
-   **Git Interaction**: [simple-git](https://www.npmjs.com/package/simple-git) provides a lightweight interface for executing Git commands within the application.
-   **Console Output**: [Chalk](https://www.npmjs.com/package/chalk) is used for adding color and styling to console output, enhancing user experience.
-   **Configuration Management**: [Conf](https://www.npmjs.com/package/conf) handles local configuration, securely storing the user's Gemini API key.
-   **CI/CD**: [GitHub Actions](https://github.com/features/actions) are used to automate workflows for publishing to NPM and version bumping.

## Library Usage Rules

To maintain a clean and predictable architecture, adhere to the following rules when modifying the codebase:

1.  **CLI Structure (`commander`)**
    -   **Rule**: All CLI commands, options, and arguments must be defined in `bin/cli.js` using the `commander` library.
    -   **Reason**: This file serves as the single source of truth for the application's command-line interface.

2.  **AI Generation (`@google/generative-ai`)**
    -   **Rule**: All calls to the Gemini API for content generation must be abstracted within `src/aiGenerator.js`. Do not instantiate the `GoogleGenerativeAI` client elsewhere.
    -   **Reason**: Centralizing AI logic makes it easier to manage prompts, update models, and handle API changes.

3.  **Git Operations (`simple-git`)**
    -   **Rule**: Any interaction with the Git repository (e.g., checking status, getting diffs, committing) must use the `simple-git` wrapper. All Git-related utility functions should reside in `src/gitUtils.js`.
    -   **Reason**: Avoids executing raw Git commands and provides a consistent, error-handled API for Git operations.

4.  **User-Facing Messages (`chalk`)**
    -   **Rule**: Use `chalk` for all console output directed at the user. Use distinct colors for different message types (e.g., `chalk.green` for success, `chalk.red` for errors, `chalk.blue` for information).
    -   **Reason**: Improves readability and provides a better user experience.

5.  **Configuration (`conf`)**
    -   **Rule**: All access to the user's configuration (i.e., the Gemini API key) must go through the getter and setter functions (`getApiKey`, `setApiKey`) in `src/config.js`.
    -   **Reason**: Encapsulates the logic for storing and retrieving configuration, allowing the underlying storage mechanism to be changed without affecting the rest of the application.

6.  **File System (`fs`, `ignore`)**
    -   **Rule**: For simple file reading/writing, use the native Node.js `fs` module. For complex project scanning that must respect `.gitignore` rules, use the existing `scanProject` function in `src/projectScanner.js`.
    -   **Reason**: Uses the right tool for the job—simplicity for basic tasks and robustness for complex ones.