# Release notes — v0.1.77

## Highlights

- **Pi development baseline and MCP-aware subagents** ([#136](https://github.com/diegopetrucci/pi-extensions/pull/136)): the collection was developed against Pi `1.0.4` as a development baseline, not as a fleet-wide compatibility certification; `agent-workflow-audit`, `code-reviewer`, `contrarian`, `librarian`, `oracle`, and `triage-comments` can use configured MCP and tool-search resources on supported hosts, with trust/cwd guards and cleanup on exit. Their prompts and READMEs make the side-effect and host-version boundaries explicit.
- **Model/provider selection** ([#136](https://github.com/diegopetrucci/pi-extensions/pull/136), [#140](https://github.com/diegopetrucci/pi-extensions/pull/140)): `code-reviewer`, `contrarian`, and `oracle` track the Pi 1.0.4 catalog, share one Azure preference list with the `azure-openai-responses` legacy alias, and remove stale model patterns.
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

- The approved input was validated before use; the default-registry dry-run was rerun and selected exactly the 20 package/version pairs above, with every target reported unused.
- Write mode updated the selected manifests and lock metadata, set only the quiet-tools `1.1.0` marker, and created the four managed release documents.
- The contributor audit for `v0.1.76..HEAD` found only the repository owner as a commit author. Cursor Agent, The Last Harness, and GitHub automation metadata were excluded as bots/tools, so no `Contributors` section is included.
- `npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org` passed (156 packages added).
- `npm run preflight:install-state` passed (128 installed packages and 29 local package entries checked; 43 optional packages not installed).
- Scoped `npx oxfmt --check` passed for the quiet-tools runtime, its two tests, and the smoke-check script; the version/lock scope check passed with nine omitted workspace versions and non-version lock data unchanged.
- The reviewed `extensions/quiet-tools/index.ts` and `extensions/quiet-tools/README.md` SHA-256 values remained `5ff96a197c87850c9875b11547fb7d98dc3cbab8d57949771ea0b3378f4fa9fd` and `6b96857af46737c7340d6af900146d9026bdcb8a9e787c9c24c014ff5ccb26f3`; `git diff --check` passed.
- `npm run ci` reported 1019 passed, 0 failed, and 1 skipped.
- The quiet-tools packaged runtime check against a Pi `1.1.0` host passed.
- `npm pack --dry-run` passed for `@diegopetrucci/pi-quiet-tools@0.1.14`, the root `@diegopetrucci/pi-extensions@0.1.77`, and all workspaces.
- Version/lock/hash assertions and `git diff --check` passed.
- A separate human regular/fullscreen visual pass passed. The automated checks do not establish visual behavior.

<!-- prepare-release:packages [["@diegopetrucci/pi-agent-workflow-audit","0.1.14"],["@diegopetrucci/pi-annotate-git-diff","0.1.14"],["@diegopetrucci/pi-annotate-last-message","0.1.12"],["@diegopetrucci/pi-code-reviewer","0.1.14"],["@diegopetrucci/pi-confirm-destructive","0.1.14"],["@diegopetrucci/pi-context-cap","0.1.14"],["@diegopetrucci/pi-contrarian","0.1.16"],["@diegopetrucci/pi-dirty-repo-guard","0.1.12"],["@diegopetrucci/pi-fast","0.1.9"],["@diegopetrucci/pi-inline-bash","0.1.13"],["@diegopetrucci/pi-librarian","0.1.19"],["@diegopetrucci/pi-minimal-footer","0.1.23"],["@diegopetrucci/pi-oracle","0.1.31"],["@diegopetrucci/pi-permission-gate","0.1.17"],["@diegopetrucci/pi-project-mcp-json","0.1.2"],["@diegopetrucci/pi-quiet-tools","0.1.14"],["@diegopetrucci/pi-todo","0.1.12"],["@diegopetrucci/pi-triage-comments","0.1.15"],["pi-dynamic-context-pruning","0.1.13"],["@diegopetrucci/pi-extensions","0.1.77"]] -->
