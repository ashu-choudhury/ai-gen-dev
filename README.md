# 🤖 AI Commit Message Generator

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Let AI craft the perfect conventional commit messages for your git repositories using Google's Gemini Pro API! 🎯

## 🎥 Demo

https://github.com/username/ai-commit-message/raw/main/media/demo_ai-commit-message.mp4

## ✨ Features

- 🧠 Generates meaningful commit messages based on staged changes
- 🎯 Follows Conventional Commits format
- 🚀 Auto-commit option available
- ⚡ Fast and lightweight
- 🔐 Secure API key management
- 🎨 Beautiful CLI with colored output

## 🚀 Installation

```bash
npm install -g ai-commit-message
```

## 🔑 Setup

1. Get your Gemini API key from [Get a Gemini API key](https://makersuite.google.com/app/apikey)

2. Configure the API key:

```bash
ai-commit-message config <your-api-key>
```

Alternatively, set the `GEMINI_API_KEY` environment variable.

```bash
export GEMINI_API_KEY=<your-api-key>
```

## 💫 Usage

### Generate a Commit Message

```bash
# Stage your changes first
git add .

# NOW, Generate a commit message
ai-commit-message
```

### Generate and auto-commit

```bash
ai-commit-message -c
```

### CLI Options

```bash
Commands:
  config <key>        Configure Gemini API key
  generate [options]  Generate commit message
  help [command]      display help for command
```

## 🛠️ How It Works

1. Verifies you're in a git repository
2. Checks for staged changes
3. Sends the diff to Gemini Pro API
4. Generates a conventional commit message
5. Either displays the message or auto-commits (with -c flag)

## 🧩 Technical Details

- Uses **Gemini 1.5 Pro** for advanced code understanding and **long-context** understanding.
- Implements Conventional Commits specification
- Built with modern ES modules
- Handles errors gracefully with user-friendly messages
- Secure configuration management using `conf`

## 📦 Dependencies

- `@google/generative-ai` - Google's Gemini AI API
- `commander` - CLI framework
- `simple-git` - Git operations
- `conf` - Configuration management
- `chalk` - Terminal styling

## 🔧 Requirements

- Node.js >= 18.0.0
- Git installed and configured
- Gemini API key

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit PRs

## 📝 License

MIT License - feel free to use this in your projects!

---

<p align="center">Made with ❤️ and powered by 🤖</p>
