#!/usr/bin/env node

/**
 * Release script for Signum Mobile Wallet.
 *
 * Usage: npm run new-version
 *
 * Flow:
 *   1. Guard checks (branch, clean tree, changeset files, tag conflicts)
 *   2. Interactive changeset creation (patch/minor + description)
 *   3. changeset version (bumps package.json, updates CHANGELOG.md)
 *   4. Sync app.json (version from package.json, increment versionCode)
 *   5. Open $EDITOR with store/release-notes/en-US.txt
 *   6. Validate release notes were changed
 *   7. Git commit + push
 *   8. Open PR develop → main
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Helpers ────────────────────────────────────────────────────────────

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf-8", stdio: "pipe", ...opts }).trim();
}

function runInteractive(cmd) {
  execSync(cmd, { cwd: ROOT, stdio: "inherit" });
}

function die(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

function info(msg) {
  console.log(`  ${msg}`);
}

function heading(msg) {
  console.log(`\n▸ ${msg}`);
}

function fileHash(path) {
  const content = readFileSync(path, "utf-8");
  return createHash("sha256").update(content).digest("hex");
}

// ── Guards ─────────────────────────────────────────────────────────────

heading("Running pre-flight checks");

// Must be on develop
const branch = run("git rev-parse --abbrev-ref HEAD");
if (branch !== "develop") {
  die(`Must be on 'develop' branch (currently on '${branch}')`);
}
info("Branch: develop ✓");

// Working tree must be clean
const status = run("git status --porcelain");
if (status.length > 0) {
  die("Working tree is not clean. Commit or stash your changes first.");
}
info("Working tree: clean ✓");

// Must have changeset files to consume — OR we create one interactively
const changesetFiles = run("ls .changeset/*.md 2>/dev/null || true");
const hasExistingChangesets = changesetFiles
  .split("\n")
  .filter((f) => f && !f.endsWith("README.md")).length > 0;

// ── Step 1: Create changeset (interactive) ─────────────────────────────

heading("Creating changeset");

if (hasExistingChangesets) {
  info("Found existing changeset files — skipping interactive creation.");
} else {
  info("No pending changesets found. Creating one now...");
  runInteractive("npx changeset");

  // Verify a changeset was actually created
  const afterFiles = run("ls .changeset/*.md 2>/dev/null || true");
  const newChangesets = afterFiles
    .split("\n")
    .filter((f) => f && !f.endsWith("README.md"));
  if (newChangesets.length === 0) {
    die("No changeset was created. Aborting.");
  }
}

// ── Step 2: Version bump ───────────────────────────────────────────────

heading("Bumping version");
runInteractive("npx changeset version");

// Read the new version from package.json
const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
const newVersion = pkg.version;
info(`New version: ${newVersion}`);

// ── Step 3: Check for tag conflicts ────────────────────────────────────

heading("Checking for tag conflicts");
run("git fetch --tags");
const tag = `v${newVersion}`;
try {
  run(`git rev-parse ${tag}`);
  die(`Tag '${tag}' already exists. Version conflict — please resolve manually.`);
} catch {
  info(`Tag ${tag}: available ✓`);
}

// ── Step 4: Sync app.json ──────────────────────────────────────────────

heading("Syncing app.json");

const appJsonPath = resolve(ROOT, "app.json");
const appJson = JSON.parse(readFileSync(appJsonPath, "utf-8"));
const oldVersionCode = appJson.expo.android.versionCode || 0;

appJson.expo.version = newVersion;
appJson.expo.android.versionCode = oldVersionCode + 1;

// Keep iOS buildNumber in sync
appJson.expo.ios.buildNumber = String(oldVersionCode + 1);

writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + "\n");
info(`version: ${newVersion}`);
info(`versionCode: ${oldVersionCode} → ${oldVersionCode + 1}`);
info(`buildNumber: ${oldVersionCode + 1}`);

// ── Step 5: Edit release notes ─────────────────────────────────────────

heading("Opening release notes for editing");

const releaseNotesPath = resolve(ROOT, "store/release-notes/en-US.txt");
const hashBefore = fileHash(releaseNotesPath);

const editor = process.env.EDITOR || "nano";
info(`Using editor: ${editor}`);
info("Write user-facing 'What's new' text (max 500 chars for Play Store).");

runInteractive(`${editor} "${releaseNotesPath}"`);

// ── Step 6: Validate release notes ─────────────────────────────────────

const hashAfter = fileHash(releaseNotesPath);
if (hashBefore === hashAfter) {
  die("Release notes were not changed. Please write user-facing release notes.");
}

const releaseNotes = readFileSync(releaseNotesPath, "utf-8").trim();
if (releaseNotes.length === 0) {
  die("Release notes are empty.");
}
if (releaseNotes.length > 500) {
  die(`Release notes are ${releaseNotes.length} chars — Play Store limit is 500.`);
}

info(`Release notes: ${releaseNotes.length}/500 chars ✓`);

// ── Step 7: Commit ─────────────────────────────────────────────────────

heading("Committing changes");

run("git add -A");
run(`git commit -m "chore: release v${newVersion}"`);
info(`Committed: chore: release v${newVersion}`);

// ── Step 8: Push + open PR ─────────────────────────────────────────────

heading("Pushing to origin/develop");
run("git push origin develop");

heading("Opening pull request");

const prBody = `## Release v${newVersion}

### What's new (user-facing)
\`\`\`
${releaseNotes}
\`\`\`

### Changes
See [CHANGELOG.md](./CHANGELOG.md) for technical details.

---
Merging this PR into \`main\` will automatically:
1. Create git tag \`v${newVersion}\`
2. Create a GitHub Release
3. Trigger EAS build + submit to Play Store
`;

try {
  const prUrl = run(
    `gh pr create --base main --head develop --title "Release v${newVersion}" --body "${prBody.replace(/"/g, '\\"')}"`,
  );
  info(`Pull request created: ${prUrl}`);
} catch (e) {
  // PR might already exist
  const existing = run("gh pr list --head develop --base main --json url --jq '.[0].url' 2>/dev/null || true");
  if (existing) {
    info(`PR already exists: ${existing}`);
  } else {
    console.error("Failed to create PR. You can create it manually.");
    console.error(e.message);
  }
}

console.log(`\n✔ Release v${newVersion} prepared. Review and merge the PR to deploy.\n`);
