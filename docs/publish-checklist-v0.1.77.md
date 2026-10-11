# Publish checklist — v0.1.77

## Scope

- [x] Exact expanded scope: 19 selected workspaces plus `@diegopetrucci/pi-extensions@0.1.77`.
- [x] Nine unchanged workspaces remain at their existing versions and are omitted from this preparation.
- [x] Only `@diegopetrucci/pi-quiet-tools` carries a new fleet marker, `1.1.0`; the collection's Pi `1.0.4` reference is a development baseline, not a fleet-wide compatibility certification.
- [x] Contributor audit of `v0.1.76..HEAD` is complete: commit authors are the repository owner; Cursor Agent, The Last Harness, and GitHub automation are bots/tools and are excluded. No `## Contributors` section is included.
- [x] Registry target checks reported all 20 exact targets unused. No publication, tag, push, PR, workflow, or release action was performed.

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

- [x] Approved input validated against the exact 20 package/version contract and quiet-tools marker `1.1.0` only.
- [x] Default-registry dry-run rerun before write; selected exactly the approved 20 package/version pairs and reported all targets unused.
- [x] Deterministic `--write` completed; selected manifests, `package-lock.json`, quiet-tools marker, and four release documents are aligned.
- [x] `npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org` passed after bookkeeping.
- [x] `npm run preflight:install-state` passed (128 installed packages and 29 local package entries checked; 43 optional packages not installed).
- [x] Scoped Oxfmt check passed for the quiet-tools runtime, its tests, and the smoke-check script.
- [x] Version/lock scope check passed: all 20 selected targets align; nine omitted workspace versions and non-version lock data are unchanged.
- [x] Quiet-tools runtime and README SHA-256 hashes match the reviewed bytes; `git diff --check` passed.
- [x] `npm run ci` reported 1019 passed, 0 failed, and 1 skipped.
- [x] The quiet-tools packaged runtime check against a Pi `1.1.0` host passed.
- [x] `npm pack --dry-run` passed for `@diegopetrucci/pi-quiet-tools@0.1.14`, the root `@diegopetrucci/pi-extensions@0.1.77`, and all workspaces.
- [x] Version/lock/hash assertions and `git diff --check` passed.
- [x] A separate human regular/fullscreen visual pass passed. The automated checks do not establish visual behavior.

## Public GitHub release

- [ ] If separately authorized, create a **non-draft** GitHub release titled **MCP-aware subagents, always-on quiet tools, and reliability fixes**, using `docs/github-release-v0.1.77.md` as the exact body.
- [ ] Do not dispatch workflows or publish packages as part of this preparation; no current release action is authorized by this checklist.

## Agent-safe follow-up actions

- [ ] Obtain separate approval before creating a release commit.
- [ ] On the approved non-`main` branch `restore-always-on-quiet-tools`, create the release commit outside this task.
- [ ] Push `restore-always-on-quiet-tools` and open a pull request targeting `main`.
- [ ] Wait for both required CI and CodeQL checks to pass, then merge the release pull request into `main`.
- [ ] Verify that `main` points to the merged release commit and that no intervening merge occurred before tagging.
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
