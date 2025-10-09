# AI-Gen-Dev: Intelligent Developer Automation Toolkit

AI-Gen-Dev is a powerful command-line interface (CLI) toolkit designed to streamline and enhance your software development workflow. By leveraging the power of AI, it automates common, time-consuming tasks, allowing you to focus more on coding and less on boilerplate and repetitive processes.

## 🚀 Project Description

In the fast-paced world of software development, efficiency is key. Developers often spend valuable time on tasks such as writing commit messages, generating comprehensive documentation, and managing project configurations. AI-Gen-Dev addresses this challenge by providing intelligent automation for these critical aspects of the development lifecycle.

At its core, AI-Gen-Dev uses advanced AI models (specifically Gemini) to understand the context of your code changes and project structure. It can then generate human-readable and technically accurate output, significantly reducing manual effort and improving the quality and consistency of your project's artifacts. Whether you're looking to create professional README files or craft precise Git commit messages, AI-Gen-Dev is your intelligent assistant.

## 🛠️ Installation

To get started with AI-Gen-Dev, follow these steps:

1.  **Prerequisites:**
    *   Node.js: Ensure you have Node.js version 18.0.0 or higher installed. You can download it from [nodejs.org](https://nodejs.org/).
    *   npm: npm is usually bundled with Node.js.

2.  **Install the CLI:**
    You can install AI-Gen-Dev globally using npm:

    ```bash
    npm install -g ai-gen-dev
    ```

3.  **Configure Gemini API Key:**
    AI-Gen-Dev requires a Gemini API key to function. You can obtain one from the [Google AI Studio](https://aistudio.google.com/). Once you have your API key, set it using the `config` command:

    ```bash
    ai-gen-dev config YOUR_GEMINI_API_KEY
    ```

    Replace `YOUR_GEMINI_API_KEY` with your actual API key.

## 💡 Usage

AI-Gen-Dev provides a set of commands to automate various development tasks.

### Generating Commit Messages (`ai-gen-dev git`)

This is the primary command for generating AI-powered Git commit messages.

*   **Stage your changes:** Before running the command, make sure you have staged the files you want to commit.

    ```bash
    git add .
    ```

*   **Generate and suggest a commit message:**

    ```bash
    ai-gen-dev git
    ```
    This will output a suggested commit message based on your staged changes.

*   **Generate and automatically commit:**

    ```bash
    ai-gen-dev git --commit
    ```
    This will generate the commit message and automatically create the commit.

*   **Provide specific instructions to the AI:** You can guide the AI by providing a short message detailing what you want the commit to focus on.

    ```bash
    ai-gen-dev git --message "Refactor user authentication module for better security"
    ```

    Or with auto-commit:

    ```bash
    ai-gen-dev git --commit --message "Fix critical bug in payment processing"
    ```

### Generating README Files (`ai-gen-dev readme`)

This command generates a professional `README.md` file for your project.

*   **Preview the generated README:** This will display the generated README content in your terminal without saving it to a file.

    ```bash
    ai-gen-dev readme
    ```

*   **Generate and save README.md:** This will create or overwrite the `README.md` file in your project's root directory.

    ```bash
    ai-gen-dev readme --create
    ```

*   **Provide specific instructions for README generation:** You can offer guidance to the AI for tailoring the README.

    ```bash
    ai-gen-dev readme --message "Emphasize the project's focus on enterprise-grade security and scalability"
    ```

    Or with saving:

    ```bash
    ai-gen-dev readme --create --message "Highlight the use of React and Tailwind CSS for the UI components"
    ```

### Generating CHANGELOG Files (`ai-gen-dev changelog`)

This command generates a `CHANGELOG.md` file based on your recent commit history.

*   **Preview the generated CHANGELOG:** This will display the generated changelog content in your terminal without saving it to a file.

    ```bash
    ai-gen-dev changelog
    ```

*   **Generate and save CHANGELOG.md:** This will create or overwrite the `CHANGELOG.md` file in your project's root directory.

    ```bash
    ai-gen-dev changelog --create
    ```

*   **Provide specific instructions for CHANGELOG generation:** You can offer guidance to the AI for tailoring the changelog.

    ```bash
    ai-gen-dev changelog --message "Focus on user-facing features and bug fixes, group them by version"
    ```

    Or with saving:

    ```bash
    ai-gen-dev changelog --create --message "Ensure all security-related fixes are clearly marked"
    ```

### Code Review (`ai-gen-dev review`)

This command utilizes AI to provide a code review for a specified file or all staged files.

*   **Review a specific file:**

    ```bash
    ai-gen-dev review path/to/your/file.js
    ```

*   **Review all staged files:**

    ```bash
    ai-gen-dev review
    ```

### Configuration (`ai-gen-dev config`)

As mentioned in the installation steps, this command is used to set your Gemini API key.

```bash
ai-gen-dev config <YOUR_GEMINI_API_KEY>
```

## ✨ Key Features

*   **AI-Powered Commit Messages:** Generates descriptive and conventionally formatted commit messages, saving you time and improving commit history clarity.
*   **Intelligent README Generation:** Automatically creates comprehensive `README.md` files by analyzing your project's structure and code content.
*   **Automated CHANGELOG Generation:** Creates user-friendly changelogs from recent commit history, keeping your project documentation up-to-date.
*   **AI-Assisted Code Review:** Provides insightful code reviews to help identify potential bugs, suggest improvements, and ensure adherence to best practices.
*   **Customizable AI Prompts:** Allows you to provide specific instructions to the AI for commit messages, READMEs, changelogs, and code reviews, ensuring the output meets your exact needs.
*   **Seamless Git Integration:** Works directly with your Git repository, understanding staged changes for commit messages and scanning your project for documentation generation.
*   **Developer-Friendly CLI:** Easy-to-use command-line interface with clear instructions and helpful feedback.
*   **Secure API Key Management:** Safely stores your Gemini API key locally using a configuration management library.
*   **Extensible Architecture:** Designed with modularity in mind, allowing for future expansion with more AI-driven developer tools.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## ❤️ Contributing

We believe in fostering a collaborative and welcoming environment for all developers! AI-Gen-Dev is an open-source project, and contributions are highly encouraged and appreciated. Whether you're a seasoned developer or just starting, there are many ways to get involved:

*   **Reporting Bugs:** If you encounter any issues, please report them on the [GitHub Issues page](https://github.com/ashu-choudhury/ai-gen-dev/issues).
*   **Suggesting Features:** Have an idea for a new feature or an improvement? We'd love to hear it! Open a discussion or an issue.
*   **Submitting Pull Requests:** Feel free to submit pull requests for bug fixes, new features, or documentation improvements. Please ensure your code follows the project's coding style and includes relevant tests.
*   **Improving Documentation:** Clear and comprehensive documentation is crucial. If you find any part of the documentation lacking or unclear, please contribute to improving it.

We're excited to build this tool alongside our community and make AI-driven development more accessible to everyone. Your contributions, big or small, make a significant difference!

## 💡 Notes for Developers

*   **API Key Security:** Never commit your API key directly into the repository. Use the `ai-gen-dev config` command or set the `GEMINI_API_KEY` environment variable.
*   **Project Scanning:** For README generation, AI-Gen-Dev scans your project's files (respecting `.gitignore`). Ensure your `.gitignore` is up-to-date to avoid unnecessary noise in the AI's analysis.
*   **Conventional Commits:** The `git` command aims to adhere to Conventional Commits standards. Familiarize yourself with this standard for better commit history management.
*   **Node.js Version:** The project is developed and tested with Node.js v18.0.0 and above. Ensure your Node.js environment meets this requirement.
*   **Dependencies:** Make sure to run `npm install` to install all necessary dependencies before running the CLI.