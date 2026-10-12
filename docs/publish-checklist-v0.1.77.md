# Publish checklist — v0.1.77

## Scope

- [x] Exact expanded scope: 19 selected workspaces plus `@diegopetrucci/pi-extensions@0.1.77`.
- [x] Nine unchanged workspaces remain at their existing versions and are omitted from this preparation.
- [x] Only `@diegopetrucci/pi-quiet-tools` carries a new fleet marker, `1.1.0`; the collection's Pi `1.0.4` reference is a development baseline, not a fleet-wide compatibility certification.
- [x] Contributor audit of merged `v0.1.76..HEAD`, including #137, #148, and #149, identifies Diego Petrucci as the only eligible human author. Cursor Agent and The Last Harness appear as tool coauthors/tool metadata, and GitHub automation is excluded; no eligible external human contributors were found, so no `## Contributors` section is included.
- [x] PR149 was merged into `main` at `c8b2b5e82bfbf730bdfa2b118eaeb6e32ca348ff`; its final PR head `dee189f9cb7e41e188370ded8c8029a8a9be8989` includes #137 and #148.
- [x] Merged #137 allows `git branch --contains` while retaining the `git blame --contents` guard; merged #148 adds Pi-parity guarded path resolution across `agent-workflow-audit`, `code-reviewer`, `librarian`, `permission-gate`, and `triage-comments`.
- [x] Registry target checks reported all 20 exact targets unused. No tag, GitHub release, workflow dispatch, or package publication was performed by this reconciliation; PR149 was already merged before it.

## Target package versions

- [x] `@diegopetrucci/pi-agent-workflow-audit@0.1.14`
- [x] `@diegopetrucci/pi-annotate-git-diff@0.1.14`
- [x] `@diegopetrucci/pi-annotate-last-message@0.1.12`
- [x] `@diegopetrucci/pi-code-reviewer@0.1.14`
- [x] `@diegopetrucci/pi-confirm-destructive@0.1.14`
- [x] `@diegopetrucci/pi-context-cap@0.1.14`
- [x] `@diegopetrucci/pi-contrarian@0.1.16`
- [x] `@diegopetrucci/pi-dirty-repo-guard@0.1.12`
- [x] `@diegopetrucci/pi-fast@0.1.9`
- [x] `@diegopetrucci/pi-inline-bash@0.1.13`
- [x] `@diegopetrucci/pi-librarian@0.1.19`
- [x] `@diegopetrucci/pi-minimal-footer@0.1.23`
- [x] `@diegopetrucci/pi-oracle@0.1.31`
- [x] `@diegopetrucci/pi-permission-gate@0.1.17`
- [x] `@diegopetrucci/pi-project-mcp-json@0.1.2`
- [x] `@diegopetrucci/pi-quiet-tools@0.1.14`
- [x] `@diegopetrucci/pi-todo@0.1.12`
- [x] `@diegopetrucci/pi-triage-comments@0.1.15`
- [x] `pi-dynamic-context-pruning@0.1.13`
- [x] `@diegopetrucci/pi-extensions@0.1.77`

## Validation evidence

### Preparation evidence before the merged final head

- [x] Approved input validated against the exact 20 package/version contract and quiet-tools marker `1.1.0` only.
- [x] Default-registry dry-run rerun before write; selected exactly the approved 20 package/version pairs and reported all targets unused.
- [x] Deterministic `--write` completed; selected manifests, `package-lock.json`, quiet-tools marker, and four release documents are aligned.
- [x] Earlier local `npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org` passed (156 packages added), and `npm run preflight:install-state` passed (128 installed packages and 29 local package entries checked; 43 optional packages not installed).
- [x] Scoped Oxfmt check passed for the earlier quiet-tools runtime, its tests, and the smoke-check script; Oxfmt does not support Markdown and was not used to format these documents.
- [x] Earlier version/lock scope check passed: all 20 selected targets align; nine omitted workspace versions and non-version lock data are unchanged.
- [x] The reviewed quiet-tools source and README SHA-256 hashes remain `5ff96a197c87850c9875b11547fb7d98dc3cbab8d57949771ea0b3378f4fa9fd` and `6b96857af46737c7340d6af900146d9026bdcb8a9e787c9c24c014ff5ccb26f3`; earlier `git diff --check` passed.
- [x] Earlier `npm run ci` reported 1019 passed, 0 failed, and 1 skipped; it predates #137/#148 and does not certify the merged final tree.
- [x] The quiet-tools packaged runtime check against a Pi `1.1.0` host passed during the earlier preparation. This is the only host certification; it predates #137/#148 and does not certify the merged final tree.
- [x] Earlier `npm pack --dry-run` passed for `@diegopetrucci/pi-quiet-tools@0.1.14`, the root `@diegopetrucci/pi-extensions@0.1.77`, and all workspaces; it predates #137/#148 and is not a merged-final-tree pack result.
- [x] A separate human regular/fullscreen visual pass was recorded during the earlier quiet-tools preparation. The automated checks do not establish visual behavior.

### Merged final head

- [x] PR149 final head `dee189f9cb7e41e188370ded8c8029a8a9be8989` was merged into `main` at `c8b2b5e82bfbf730bdfa2b118eaeb6e32ca348ff`; it includes #137 and #148.
- [x] The seven final-head GitHub CI/CodeQL checks passed: `Analyze (actions)`, `Analyze (javascript-typescript)`, `CodeQL`, `PowerShell safety (Windows)`, `Validate (Node 22.19.0)`, `Validate (Node 24)`, and `Validate (Node 26)`. The CodeRabbit review also passed.
- [x] This documentation-only reconciliation is limited to document whitespace, managed-marker/version, hash, and repository-scope checks. No suite, npm, pack, runtime, or visual checks were rerun; final merged-tree package preflight remains a separate release gate.

## Public GitHub release

- Release metadata/reference only: the later separately authorized action must create a **non-draft** GitHub release titled **MCP-aware subagents, always-on quiet tools, and reliability fixes**, using `docs/github-release-v0.1.77.md` as the exact body, and may execute only after the authorized verified-main-tree preflight and tag steps below.
- [ ] Do not dispatch workflows or publish packages as part of this preparation; no current release action is authorized by this checklist.

## Agent-safe follow-up actions

- [x] Obtain separate approval before creating a commit for this four-document reconciliation; the prior commit/push/PR approval applied to PR149 and its smoke-path fix only.
- [x] If separately approved, create a docs-only follow-up commit on the current non-`main` branch `reconcile-v0.1.77-release-docs`; do not recreate merged PR149.
- [x] If separately approved, push `reconcile-v0.1.77-release-docs` and open a pull request targeting `main`.
- [x] Wait for the required CI and CodeQL checks to pass, then merge the documentation follow-up into `main`.
- [x] Verify that `main` points to the merged documentation follow-up and that no intervening merge occurred before tagging.
- [ ] **Before tagging, and only after separate authorization, run the final verified-main-tree preflight:** `npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org`; `npm run preflight:install-state`; `npm pack --dry-run --ignore-scripts --json --workspace extensions/quiet-tools`; `npm pack --dry-run --ignore-scripts --json`; and `npm pack --dry-run --ignore-scripts --json --workspaces`. Require all five commands to pass before tagging. This documents future execution only, authorizes none now, and was not executed in this task.
- [ ] Tag that verified `main` commit as `v0.1.77` and push the tag.
- [ ] Create the non-draft GitHub release with the exact title above and the exact body in `docs/github-release-v0.1.77.md`.
- [ ] Run `scripts/publish-release.mjs v0.1.77 --dry-run` after verifying the tag and release metadata.

## Human-only release actions

- [ ] **Before merging any later pull request into `main`**, a human must dispatch the trusted `publish.yml` workflow from `main` with `v0.1.77` in both confirmation fields.
- [ ] Inspect the verified package plan and approve the protected `npm-release` environment deployment.
- [ ] Do not run `npm publish` directly.

## Undo

To undo these release-only bookkeeping changes, use human-reviewed normal VCS restoration for the 20 selected package manifests, `package-lock.json`, the quiet-tools `.pi-fleet-tested-version` marker, and the four new v0.1.77 documents. Review the release diff to identify task-owned additions/removals; do not restore unrelated user-owned files or state.

<!-- prepare-release:packages [["@diegopetrucci/pi-agent-workflow-audit","0.1.14"],["@diegopetrucci/pi-annotate-git-diff","0.1.14"],["@diegopetrucci/pi-annotate-last-message","0.1.12"],["@diegopetrucci/pi-code-reviewer","0.1.14"],["@diegopetrucci/pi-confirm-destructive","0.1.14"],["@diegopetrucci/pi-context-cap","0.1.14"],["@diegopetrucci/pi-contrarian","0.1.16"],["@diegopetrucci/pi-dirty-repo-guard","0.1.12"],["@diegopetrucci/pi-fast","0.1.9"],["@diegopetrucci/pi-inline-bash","0.1.13"],["@diegopetrucci/pi-librarian","0.1.19"],["@diegopetrucci/pi-minimal-footer","0.1.23"],["@diegopetrucci/pi-oracle","0.1.31"],["@diegopetrucci/pi-permission-gate","0.1.17"],["@diegopetrucci/pi-project-mcp-json","0.1.2"],["@diegopetrucci/pi-quiet-tools","0.1.14"],["@diegopetrucci/pi-todo","0.1.12"],["@diegopetrucci/pi-triage-comments","0.1.15"],["pi-dynamic-context-pruning","0.1.13"],["@diegopetrucci/pi-extensions","0.1.77"]] -->
