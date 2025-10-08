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
   * Load `.gitignore` in current directory and merge with parent rules.
   * Returns the combined array of patterns and an `ignore` instance.
   */
  function loadIgnore(currentDir, parentRules = []) {
    const ig = ignore();
    ig.add(parentRules);

    const gitignorePath = path.join(currentDir, ".gitignore");
    let currentRules = [];

    if (fs.existsSync(gitignorePath)) {
      try {
        const content = fs.readFileSync(gitignorePath, "utf8");
        currentRules = content
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line && !line.startsWith("#"));
        ig.add(currentRules);
      } catch (e) {
        console.warn(`⚠️ Could not read .gitignore at ${gitignorePath}: ${e.message}`);
      }
    }

    // Combine parent + current rules
    return { ig, combinedRules: [...parentRules, ...currentRules] };
  }

  /**
   * Recursive walk function that respects per-directory `.gitignore`.
   */
  function walk(dir, parentRules = []) {
    const { ig, combinedRules } = loadIgnore(dir, parentRules);
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);

      // Skip ignored paths
      if (ig.ignores(relativePath)) continue;
      if (skipDirs.includes(entry.name)) continue;

      if (entry.isDirectory()) {
        walk(fullPath, combinedRules);
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

  walk(rootDir, []);
  return projectFiles;
}
