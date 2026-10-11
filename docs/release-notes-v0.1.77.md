# Release notes — v0.1.77

## Highlights

- **Pi development baseline and MCP-aware subagents** ([#136](https://github.com/diegopetrucci/pi-extensions/pull/136)): the collection was developed against Pi `1.0.4` as a development baseline, not as a fleet-wide compatibility certification; `agent-workflow-audit`, `code-reviewer`, `contrarian`, `librarian`, `oracle`, and `triage-comments` can use configured MCP and tool-search resources on supported hosts, with trust/cwd guards and cleanup on exit. Their prompts and READMEs make the side-effect and host-version boundaries explicit.
- **Model/provider selection** ([#136](https://github.com/diegopetrucci/pi-extensions/pull/136), [#140](https://github.com/diegopetrucci/pi-extensions/pull/140)): `code-reviewer`, `contrarian`, and `oracle` track the Pi 1.0.4 catalog, share one Azure preference list with the `azure-openai-responses` legacy alias, and remove stale model patterns.
- **Git command safety** ([#137](https://github.com/diegopetrucci/pi-extensions/pull/137)): `code-reviewer` allows `git branch --contains` while continuing to block `git blame --contents`, and safe Git commands suppress commit signatures.
- **Pi-parity guarded paths** ([#148](https://github.com/diegopetrucci/pi-extensions/pull/148)): `agent-workflow-audit`, `code-reviewer`, `librarian`, `permission-gate`, and `triage-comments` resolve guarded paths like Pi, including cwd-relative, `~`, and encoded `file://` paths; the read guards also check fallback variants, canonical roots remain supported, and unsafe resolution fails closed.
- **`quiet-tools` rendering (v0.1.77 release work; builds on [#136](https://github.com/diegopetrucci/pi-extensions/pull/136) and [#141](https://github.com/diegopetrucci/pi-extensions/pull/141)):** collapsed built-in and `mcp__*` rows stay compact while preserving native expanded output, timing, errors, images, and model-visible results; rendering is always on for supported hosts. Both `/quiet-tools` and `/quiet-tools status` are read-only, and the `/quiet-tools on`, `/quiet-tools off`, `/quiet-tools enable`, `/quiet-tools disable`, and `/quiet-tools toggle` controls are removed; there is no opt-out setting. This release work fixes the edit self-frame/padding behavior and keeps a visible collapsed `[failed]` marker on error calls. Only `@diegopetrucci/pi-quiet-tools` carries the Pi `1.1.0` fleet marker; no whole-fleet compatibility certification is claimed.
- **Workflow and subagent reliability** ([#129](https://github.com/diegopetrucci/pi-extensions/pull/129), [#138](https://github.com/diegopetrucci/pi-extensions/pull/138)): `agent-workflow-audit` reports wall-clock timeouts as errors and resets each live preview per assistant message; `librarian` disposes MCP sessions even when model fallback fails during binding.
- **Dynamic context pruning** ([#134](https://github.com/diegopetrucci/pi-extensions/pull/134), [#139](https://github.com/diegopetrucci/pi-extensions/pull/139)): pruning previews share one before/after savings view, stale ticket metadata and unread strategy inputs are removed, and benchmark correlation uses the persisted tool-call identifier.
- **Safety, triage, and annotation maintenance** ([#114](https://github.com/diegopetrucci/pi-extensions/pull/114), [#127](https://github.com/diegopetrucci/pi-extensions/pull/127), [#143](https://github.com/diegopetrucci/pi-extensions/pull/143)): `triage-comments` tightens command metadata and Git Bash safeguards; `annotate-git-diff` drops unreachable binary-image extensions; `annotate-last-message` corrects fallback template references; and dead branches are removed from `confirm-destructive`, `dirty-repo-guard`, `inline-bash`, `permission-gate`, and `todo`.
- **Documentation and small cleanup fixes** ([#126](https://github.com/diegopetrucci/pi-extensions/pull/126), [#142](https://github.com/diegopetrucci/pi-extensions/pull/142), [#143](https://github.com/diegopetrucci/pi-extensions/pull/143), [#144](https://github.com/diegopetrucci/pi-extensions/pull/144), [#145](https://github.com/diegopetrucci/pi-extensions/pull/145)): `code-reviewer` reports use one tool suffix, `context-cap` documents its settings guard accurately, `minimal-footer` drops unused error state, `project-mcp-json` and `fast` document current trust/config lookup semantics, and root extension descriptions match MCP and quiet-tools behavior.

This preparation advances exactly 20 packages (the collection plus 19 changed workspaces). Nine unchanged workspaces remain at their existing versions and are not included in the release scope.

## Packaging

- `@diegopetrucci/pi-agent-workflow-audit@0.1.14`
- `@diegopetrucci/pi-annotate-git-diff@0.1.14`
- `@diegopetrucci/pi-annotate-last-message@0.1.12`
- `@diegopetrucci/pi-code-reviewer@0.1.14`
- `@diegopetrucci/pi-confirm-destructive@0.1.14`
- `@diegopetrucci/pi-context-cap@0.1.14`
- `@diegopetrucci/pi-contrarian@0.1.16`
- `@diegopetrucci/pi-dirty-repo-guard@0.1.12`
- `@diegopetrucci/pi-fast@0.1.9`
- `@diegopetrucci/pi-inline-bash@0.1.13`
- `@diegopetrucci/pi-librarian@0.1.19`
- `@diegopetrucci/pi-minimal-footer@0.1.23`
- `@diegopetrucci/pi-oracle@0.1.31`
- `@diegopetrucci/pi-permission-gate@0.1.17`
- `@diegopetrucci/pi-project-mcp-json@0.1.2`
- `@diegopetrucci/pi-quiet-tools@0.1.14`
- `@diegopetrucci/pi-todo@0.1.12`
- `@diegopetrucci/pi-triage-comments@0.1.15`
- `pi-dynamic-context-pruning@0.1.13`
- `@diegopetrucci/pi-extensions@0.1.77`

## Validation

### Preparation evidence before the merged final head

- The approved input was validated before use; the default-registry dry-run was rerun and selected exactly the 20 package/version pairs above, with every target reported unused.
- Write mode updated the selected manifests and lock metadata, set only the quiet-tools `1.1.0` marker, and created the four managed release documents.
- The contributor audit of merged `v0.1.76..HEAD`, including #137, #148, and #149, identifies Diego Petrucci as the only eligible human author. Cursor Agent and The Last Harness appear as tool coauthors/tool metadata, and GitHub automation is excluded; no eligible external human contributors were found, so no `Contributors` section is included.
- Earlier local preparation checks passed: `npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org` (156 packages added), `npm run preflight:install-state` (128 installed packages and 29 local package entries checked; 43 optional packages not installed), scoped `npx oxfmt --check` for the quiet-tools runtime, its two tests, and the smoke-check script, the version/lock scope check with nine omitted workspace versions and non-version lock data unchanged, and `git diff --check`. These checks predate the #137/#148 changes in the merged final tree. Oxfmt does not support Markdown and was not used to format these documents.
- The quiet-tools packaged runtime check against a Pi `1.1.0` host passed during the earlier preparation. This is the only host certification; it predates #137/#148 and does not certify the merged final tree.
- `npm pack --dry-run` passed for `@diegopetrucci/pi-quiet-tools@0.1.14`, the root `@diegopetrucci/pi-extensions@0.1.77`, and all workspaces during the earlier preparation; it predates #137/#148 and is not a merged-final-tree pack result.
- `npm run ci` reported 1019 passed, 0 failed, and 1 skipped during the earlier preparation; it predates #137/#148 and does not certify the merged final tree.
- A separate human regular/fullscreen visual pass was recorded during the earlier quiet-tools preparation. The automated checks do not establish visual behavior.
- The reviewed `extensions/quiet-tools/index.ts` and `extensions/quiet-tools/README.md` SHA-256 values remain `5ff96a197c87850c9875b11547fb7d98dc3cbab8d57949771ea0b3378f4fa9fd` and `6b96857af46737c7340d6af900146d9026bdcb8a9e787c9c24c014ff5ccb26f3`; the #137/#148 changes do not alter these quiet-tools source/README bytes.

### Merged final head

- PR149 was merged into `main` at `c8b2b5e82bfbf730bdfa2b118eaeb6e32ca348ff`; its final PR head `dee189f9cb7e41e188370ded8c8029a8a9be8989` includes #137 and #148.
- The seven final-head GitHub CI/CodeQL checks passed: `Analyze (actions)`, `Analyze (javascript-typescript)`, `CodeQL`, `PowerShell safety (Windows)`, `Validate (Node 22.19.0)`, `Validate (Node 24)`, and `Validate (Node 26)`. The CodeRabbit review also passed.
- This documentation-only reconciliation ran only narrow document whitespace, marker/version, hash, and scope checks. No suite, npm, pack, runtime, or visual checks were rerun; final merged-tree package preflight remains a separate release gate.

<!-- prepare-release:packages [["@diegopetrucci/pi-agent-workflow-audit","0.1.14"],["@diegopetrucci/pi-annotate-git-diff","0.1.14"],["@diegopetrucci/pi-annotate-last-message","0.1.12"],["@diegopetrucci/pi-code-reviewer","0.1.14"],["@diegopetrucci/pi-confirm-destructive","0.1.14"],["@diegopetrucci/pi-context-cap","0.1.14"],["@diegopetrucci/pi-contrarian","0.1.16"],["@diegopetrucci/pi-dirty-repo-guard","0.1.12"],["@diegopetrucci/pi-fast","0.1.9"],["@diegopetrucci/pi-inline-bash","0.1.13"],["@diegopetrucci/pi-librarian","0.1.19"],["@diegopetrucci/pi-minimal-footer","0.1.23"],["@diegopetrucci/pi-oracle","0.1.31"],["@diegopetrucci/pi-permission-gate","0.1.17"],["@diegopetrucci/pi-project-mcp-json","0.1.2"],["@diegopetrucci/pi-quiet-tools","0.1.14"],["@diegopetrucci/pi-todo","0.1.12"],["@diegopetrucci/pi-triage-comments","0.1.15"],["pi-dynamic-context-pruning","0.1.13"],["@diegopetrucci/pi-extensions","0.1.77"]] -->
