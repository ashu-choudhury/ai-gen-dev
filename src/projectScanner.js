import fs from "fs";
import path from "path";
import ignore from "ignore";
import { isBinaryFileSync } from "isbinaryfile";

/**
 * Recursively scans a project folder while respecting `.gitignore` files at every level.
 * 
 * @param {string} rootDir - Root folder to scan
 * @param {object} options
 * @param {string[]} [options.skipDirs] - Folders to skip (default: common build/cache)
 * @returns {Promise<object>} Map of relative file paths -> contents
 */
export async function scanProject(rootDir = process.cwd(), options = {}) {
  const defaultSkipDirs = [
    "node_modules",
    ".next",
    ".expo",
    ".cache",
    "dist",
    "out",
    ".turbo",
  ];

  const skipDirs = options.skipDirs || defaultSkipDirs;
  const projectFiles = {};

  /**
   * Load `.gitignore` in current directory and merge with parent ignore rules.
   * Each directory may have its own `.gitignore`, and we merge hierarchically.
   */
  function loadIgnore(currentDir, parentIgnore) {
    let ig = ignore();
    if (parentIgnore) {
      ig = parentIgnore.clone();
    }

    const gitignorePath = path.join(currentDir, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      try {
        const content = fs.readFileSync(gitignorePath, "utf8");
        ig.add(content);
      } catch (e) {
        console.warn(`⚠️ Could not read .gitignore at ${gitignorePath}: ${e.message}`);
      }
    }

    return ig;
  }

  /**
   * Recursive walk function that respects per-directory `.gitignore`.
   */
  function walk(dir, currentIgnore) {
    const ig = loadIgnore(dir, currentIgnore);
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);

      // Skip ignored or default skip directories
      if (ig.ignores(relativePath)) continue;
      if (skipDirs.includes(entry.name)) continue;

      if (entry.isDirectory()) {
        // Skip if folder is ignored by gitignore
        if (ig.ignores(path.relative(rootDir, fullPath + "/"))) continue;
        walk(fullPath, ig);
      } else {
        // Skip binary files
        if (isBinaryFileSync(fullPath)) continue;

        try {
          const content = fs.readFileSync(fullPath, "utf8");
          projectFiles[relativePath] = content;
        } catch (err) {
          console.warn(`⚠️ Could not read file ${relativePath}: ${err.message}`);
        }
      }
    }
  }

  walk(rootDir, null);
  return projectFiles;
}
