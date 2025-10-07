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
 * @returns {object} - { filePath: content }
 */
export async function scanProject(rootDir = process.cwd()) {
  const gitignorePath = path.join(rootDir, ".gitignore");
  let ig = ignore();

  // Load .gitignore if exists
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    ig = ig.add(gitignoreContent);
  }

  const projectFiles = {};

  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(rootDir, fullPath);

      // Skip ignored files
      if (ig.ignores(relativePath)) continue;

      const stats = fs.statSync(fullPath);
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
