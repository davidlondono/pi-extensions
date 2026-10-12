# Publish checklist — v0.1.78

## Scope and preparation

- [x] Frozen source is `restart-v0.1.78` at `fcbc7e1215c917c5068da7d31f910016983aae21`; `origin/main` matched before preparation writes.
- [x] The exact accepted input `/tmp/tlhf-fe8g.9vJV57/release-input.json` selects 20 package/version pairs.
- [x] Only three manifests change version: root `@diegopetrucci/pi-extensions@0.1.78`, `@diegopetrucci/pi-context-cap@0.1.15`, and `@diegopetrucci/pi-minimal-footer@0.1.24`; the other 17 selected target versions remain unchanged.
- [x] `package-lock.json` changes only the matching root and two workspace version fields; dependency and resolution metadata remain unchanged.
- [x] Four new v0.1.78 documents are in scope: release notes, GitHub body, announcement, and this checklist. No v0.1.77 document was edited.
- [x] Nine omitted workspace targets remain outside scope: `brrr@0.1.15`, `claude-fast@0.1.16`, `context-inspector@0.1.16`, `git-footer@0.1.12`, `gnosis@0.1.12`, `illustrations-to-explain-things@0.1.9`, `notify@0.1.19`, `openai-fast@0.1.18`, and `review@0.1.15`.
- [x] All fleet markers are preserved byte-for-byte, including quiet-tools at Pi `1.1.0`; no new fleet certification is claimed.
- [x] The quiet-tools runtime and README remain unchanged; their preparation SHA-256 comparison is recorded below.
- [x] The 21-commit audit of `v0.1.76..fcbc7e1215c917c5068da7d31f910016983aae21` found no eligible external human contributors. Repository-owner, tool-coauthor, and GitHub automation identities were excluded; no contributor credits are invented.
- [x] The failed GitHub-only v0.1.77 publication attempt is superseded without editing its source, history, tag, or release metadata.

## Target package versions

- [x] `@diegopetrucci/pi-agent-workflow-audit@0.1.14`
- [x] `@diegopetrucci/pi-annotate-git-diff@0.1.14`
- [x] `@diegopetrucci/pi-annotate-last-message@0.1.12`
- [x] `@diegopetrucci/pi-code-reviewer@0.1.14`
- [x] `@diegopetrucci/pi-confirm-destructive@0.1.14`
- [x] `@diegopetrucci/pi-context-cap@0.1.15`
- [x] `@diegopetrucci/pi-contrarian@0.1.16`
- [x] `@diegopetrucci/pi-dirty-repo-guard@0.1.12`
- [x] `@diegopetrucci/pi-fast@0.1.9`
- [x] `@diegopetrucci/pi-inline-bash@0.1.13`
- [x] `@diegopetrucci/pi-librarian@0.1.19`
- [x] `@diegopetrucci/pi-minimal-footer@0.1.24`
- [x] `@diegopetrucci/pi-oracle@0.1.31`
- [x] `@diegopetrucci/pi-permission-gate@0.1.17`
- [x] `@diegopetrucci/pi-project-mcp-json@0.1.2`
- [x] `@diegopetrucci/pi-quiet-tools@0.1.14`
- [x] `@diegopetrucci/pi-todo@0.1.12`
- [x] `@diegopetrucci/pi-triage-comments@0.1.15`
- [x] `pi-dynamic-context-pruning@0.1.13`
- [x] `@diegopetrucci/pi-extensions@0.1.78`

## Validation evidence

### Prior evidence (dated before `fcbc7e1`; not fresh for this preparation)

- [x] Historical quiet-tools Pi `1.1.0` runtime/visual evidence remains attributed to its earlier preparation and is not a fresh v0.1.78 or merged-#157 claim.
- [x] Historical v0.1.77 checks remain in the v0.1.77 documents; this checklist does not copy them as current final validation.

### Current preparation — 2026-10-12

- [x] The deterministic command `npm run prepare-release -- --input /tmp/tlhf-fe8g.9vJV57/release-input.json --write` passed. It selected exactly 20 targets, confirmed exact target versions were unpublished, synchronized the lockfile, and created four documents.
- [x] The exact one-time locked dependency refresh passed: `npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org` (156 packages added; npm emitted a `node-domexception@1.0.0` deprecation warning).
- [x] Narrow marker/version/lock/omission/dependency/fleet/source-hash/scope/whitespace checks passed: four matching markers, 20 coherent versions, four expected lock version leaves, nine unchanged omissions, unchanged dependency metadata, 29 unchanged fleet markers, unchanged quiet-tools hashes (`index.ts` `5ff96a197c87850c9875b11547fb7d98dc3cbab8d57949771ea0b3378f4fa9fd`; `README.md` `6b96857af46737c7340d6af900146d9026bdcb8a9e787c9c24c014ff5ccb26f3`), exact eight-file scope, no staged files, and clean whitespace.
- [x] The candidate validation below is pre-commit evidence only; the separately authorized five-command verified-main gate remains unchecked.

### Latest pre-commit candidate validation — 2026-10-12

- [x] The six-command pre-commit candidate validation passed: `npm run ci` reported 1,148 passed, 0 failed, and 1 skipped (1,149 total); the scoped native checks against a Pi `1.1.0` host passed for `@diegopetrucci/pi-quiet-tools@0.1.14`; `npm pack --dry-run --ignore-scripts --json --workspace extensions/quiet-tools` reported 4 files; the root `npm pack --dry-run --ignore-scripts --json` reported 167 files for `@diegopetrucci/pi-extensions@0.1.78`; `npm pack --dry-run --ignore-scripts --json --workspaces` covered all 28 workspace dry-runs; and `git diff --check` passed. The original raw CI log is `/var/folders/nq/fkrbfck57y91r169_934fxb80000gn/T/pi-bash-7f01387a37c30d2e.log`.
- [x] The separate human quiet-tools regular/fullscreen visual pass remains prior evidence only; this candidate adds no fresh visual, fleet, or publication claim.

### Future final validation — not run here

Before any tag or release creation, a separately authorized verified-main-tree gate must pass all five commands below, in order:

- [ ] `npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org`
- [ ] `npm run preflight:install-state`
- [ ] `npm pack --dry-run --ignore-scripts --json --workspace extensions/quiet-tools`
- [ ] `npm pack --dry-run --ignore-scripts --json`
- [ ] `npm pack --dry-run --ignore-scripts --json --workspaces`

No fresh final-validation claim is made until those commands actually pass on the verified merged `main` tree.

## Release title and body

- Exact descriptive title: **MCP-aware subagents, always-on quiet tools, and 300k context defaults**.
- Exact public body: `docs/github-release-v0.1.78.md`; it intentionally has no empty `Contributors` section.

## Agent-safe follow-up actions

All actions below are future actions requiring separate authorization; this preparation itself creates no commit, push, PR, tag, GitHub release, workflow dispatch, or npm publication.

- [ ] Commit the eight task-owned files, push the non-`main` branch, open a PR targeting `main`, and wait for required CI before merging.
- [ ] Verify the merged `main` commit is the intended frozen source and that no later merge intervened.
- [ ] After separate authorization, run the five-command verified-main preflight above; all five must pass before tagging.
- [ ] Tag exactly `v0.1.78` from that verified `main` commit and push the tag.
- [ ] Create exactly one non-draft GitHub release titled **MCP-aware subagents, always-on quiet tools, and 300k context defaults**, using `docs/github-release-v0.1.78.md` as the exact body.
- [ ] After the tag and release, run `node scripts/publish-release.mjs v0.1.78 --dry-run`.

## Human-only release actions

- [ ] Before any later pull request is merged into `main`, a human must dispatch the trusted `publish.yml` workflow from `main` with `v0.1.78` in both `release_tag` and `confirmation` fields.
- [ ] Inspect the verified 20-package plan, then approve the protected `npm-release` environment deployment.
- [ ] After a human confirms npm publication, wait five minutes before registry, package-page, or npm-install verification.
- [ ] Never run `npm publish` directly from this preparation.

## Undo

Use normal human-reviewed VCS restoration for the three versioned manifests, `package-lock.json`, and the four new v0.1.78 documents. Do not restore or rewrite pre-existing user-owned state, v0.1.77 history, tags, releases, source/runtime files, dependencies, or fleet markers.

<!-- prepare-release:packages [["@diegopetrucci/pi-agent-workflow-audit","0.1.14"],["@diegopetrucci/pi-annotate-git-diff","0.1.14"],["@diegopetrucci/pi-annotate-last-message","0.1.12"],["@diegopetrucci/pi-code-reviewer","0.1.14"],["@diegopetrucci/pi-confirm-destructive","0.1.14"],["@diegopetrucci/pi-context-cap","0.1.15"],["@diegopetrucci/pi-contrarian","0.1.16"],["@diegopetrucci/pi-dirty-repo-guard","0.1.12"],["@diegopetrucci/pi-fast","0.1.9"],["@diegopetrucci/pi-inline-bash","0.1.13"],["@diegopetrucci/pi-librarian","0.1.19"],["@diegopetrucci/pi-minimal-footer","0.1.24"],["@diegopetrucci/pi-oracle","0.1.31"],["@diegopetrucci/pi-permission-gate","0.1.17"],["@diegopetrucci/pi-project-mcp-json","0.1.2"],["@diegopetrucci/pi-quiet-tools","0.1.14"],["@diegopetrucci/pi-todo","0.1.12"],["@diegopetrucci/pi-triage-comments","0.1.15"],["pi-dynamic-context-pruning","0.1.13"],["@diegopetrucci/pi-extensions","0.1.78"]] -->
