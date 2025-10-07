import fs from "fs";
import path from "path";
import ignore from "ignore";
import { isBinaryFileSync } from "isbinaryfile";

/**
 * Scan project folder and generate JSON object:
 * {
 *   "relative/path/to/file.js": "file content",
 *   ...
 * }
 * 
 * @param {string} rootDir - root folder to scan
 * @param {object} options - optional settings
 * @param {string[]} options.skipDirs - additional folders to skip (default: common cache/build folders)
 * @returns {object} - { filePath: content }
 */
export async function scanProject(rootDir = process.cwd(), options = {}) {
  const gitignorePath = path.join(rootDir, ".gitignore");
  let ig = ignore();

  // Load .gitignore if exists
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    ig = ig.add(gitignoreContent);
  }

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

  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(rootDir, fullPath);

      // Skip ignored files/folders
      if (ig.ignores(relativePath)) continue;

      const stats = fs.statSync(fullPath);

      // Skip default cache/build directories
      if (stats.isDirectory() && skipDirs.includes(file)) continue;

      if (stats.isDirectory()) {
        walk(fullPath); // Recurse into subfolders
      } else {
        // Skip binaries
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

  walk(rootDir);
  return projectFiles;
}
