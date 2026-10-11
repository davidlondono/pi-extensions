This release packages MCP-aware subagents developed against the Pi 1.0.4 development baseline, always-on quiet tool rendering, and reliability and safety fixes across the extension collection. This is a development baseline only; it does not certify the full fleet.

## Highlights

- **MCP-aware subagents:** `agent-workflow-audit`, `code-reviewer`, `contrarian`, `librarian`, `oracle`, and `triage-comments` can use configured MCP and tool-search resources on supported Pi hosts, with trust/cwd guards and cleanup on exit ([#136](https://github.com/diegopetrucci/pi-extensions/pull/136), [#138](https://github.com/diegopetrucci/pi-extensions/pull/138)).
- **Model selection:** `code-reviewer`, `contrarian`, and `oracle` follow the Pi 1.0.4 catalog and share Azure preferences while retaining the legacy provider alias ([#136](https://github.com/diegopetrucci/pi-extensions/pull/136), [#140](https://github.com/diegopetrucci/pi-extensions/pull/140)).
- **Quiet tools (v0.1.77 release work; building on [#136](https://github.com/diegopetrucci/pi-extensions/pull/136) and [#141](https://github.com/diegopetrucci/pi-extensions/pull/141)):** collapsed built-in and `mcp__*` rows stay compact while native expanded output remains available; supported hosts use always-on rendering. Both `/quiet-tools` and `/quiet-tools status` are read-only, while `/quiet-tools on`, `/quiet-tools off`, `/quiet-tools enable`, `/quiet-tools disable`, and `/quiet-tools toggle` controls are removed; there is no opt-out setting. This release work fixes the edit self-frame/padding behavior and keeps a visible collapsed `[failed]` marker on error calls. Only quiet-tools is marked for Pi `1.1.0`; no whole-fleet compatibility claim is included.
- **Reliability, safety, and maintenance:** workflow-audit timeout/live-preview handling, librarian MCP cleanup, dynamic-context-pruning bookkeeping, triage-comments Git Bash safeguards, annotation cleanup, code-reviewer output cleanup, context-cap/minimal-footer fixes, Fast nearest-ancestor and project trust documentation, and dead-branch cleanup land across the selected packages ([#114](https://github.com/diegopetrucci/pi-extensions/pull/114), [#126](https://github.com/diegopetrucci/pi-extensions/pull/126), [#127](https://github.com/diegopetrucci/pi-extensions/pull/127), [#129](https://github.com/diegopetrucci/pi-extensions/pull/129), [#134](https://github.com/diegopetrucci/pi-extensions/pull/134), [#139](https://github.com/diegopetrucci/pi-extensions/pull/139), [#142](https://github.com/diegopetrucci/pi-extensions/pull/142), [#143](https://github.com/diegopetrucci/pi-extensions/pull/143), [#144](https://github.com/diegopetrucci/pi-extensions/pull/144)).

## Packages

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

## Install

```bash
pi install npm:@diegopetrucci/pi-extensions
```

<!-- prepare-release:packages [["@diegopetrucci/pi-agent-workflow-audit","0.1.14"],["@diegopetrucci/pi-annotate-git-diff","0.1.14"],["@diegopetrucci/pi-annotate-last-message","0.1.12"],["@diegopetrucci/pi-code-reviewer","0.1.14"],["@diegopetrucci/pi-confirm-destructive","0.1.14"],["@diegopetrucci/pi-context-cap","0.1.14"],["@diegopetrucci/pi-contrarian","0.1.16"],["@diegopetrucci/pi-dirty-repo-guard","0.1.12"],["@diegopetrucci/pi-fast","0.1.9"],["@diegopetrucci/pi-inline-bash","0.1.13"],["@diegopetrucci/pi-librarian","0.1.19"],["@diegopetrucci/pi-minimal-footer","0.1.23"],["@diegopetrucci/pi-oracle","0.1.31"],["@diegopetrucci/pi-permission-gate","0.1.17"],["@diegopetrucci/pi-project-mcp-json","0.1.2"],["@diegopetrucci/pi-quiet-tools","0.1.14"],["@diegopetrucci/pi-todo","0.1.12"],["@diegopetrucci/pi-triage-comments","0.1.15"],["pi-dynamic-context-pruning","0.1.13"],["@diegopetrucci/pi-extensions","0.1.77"]] -->
