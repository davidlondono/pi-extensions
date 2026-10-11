# Announcement drafts — v0.1.77

## Short

Prepared v0.1.77 with MCP-aware subagents developed against the Pi 1.0.4 development baseline, always-on quiet rendering for collapsed built-in and MCP tool rows, and reliability, safety, and documentation fixes across 20 selected packages. This is a development baseline only; it does not certify the full fleet. Quiet-tools alone carries the Pi 1.1.0 fleet marker; the other workspace markers remain unchanged.

## Highlights

- `agent-workflow-audit`, `code-reviewer`, `contrarian`, `librarian`, `oracle`, and `triage-comments` can use configured MCP resources on supported hosts with trust and cleanup guards.
- `quiet-tools` keeps collapsed built-in and `mcp__*` rows compact while preserving native expanded output; rendering is always on for supported hosts. Both `/quiet-tools` and `/quiet-tools status` are read-only, while `/quiet-tools on`, `/quiet-tools off`, `/quiet-tools enable`, `/quiet-tools disable`, and `/quiet-tools toggle` controls are removed; there is no opt-out setting. This release work fixes the edit self-frame/padding behavior and keeps a visible collapsed `[failed]` marker on error calls.
- Workflow-audit timeout/live-preview handling, librarian MCP disposal, dynamic-context-pruning bookkeeping, triage-comments safety, annotation and code-reviewer output cleanup, model-selection updates, context-cap/minimal-footer fixes, and Fast/project trust documentation updates are included.
- Nine unchanged workspaces are intentionally omitted from this 20-package preparation scope.

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

<!-- prepare-release:packages [["@diegopetrucci/pi-agent-workflow-audit","0.1.14"],["@diegopetrucci/pi-annotate-git-diff","0.1.14"],["@diegopetrucci/pi-annotate-last-message","0.1.12"],["@diegopetrucci/pi-code-reviewer","0.1.14"],["@diegopetrucci/pi-confirm-destructive","0.1.14"],["@diegopetrucci/pi-context-cap","0.1.14"],["@diegopetrucci/pi-contrarian","0.1.16"],["@diegopetrucci/pi-dirty-repo-guard","0.1.12"],["@diegopetrucci/pi-fast","0.1.9"],["@diegopetrucci/pi-inline-bash","0.1.13"],["@diegopetrucci/pi-librarian","0.1.19"],["@diegopetrucci/pi-minimal-footer","0.1.23"],["@diegopetrucci/pi-oracle","0.1.31"],["@diegopetrucci/pi-permission-gate","0.1.17"],["@diegopetrucci/pi-project-mcp-json","0.1.2"],["@diegopetrucci/pi-quiet-tools","0.1.14"],["@diegopetrucci/pi-todo","0.1.12"],["@diegopetrucci/pi-triage-comments","0.1.15"],["pi-dynamic-context-pruning","0.1.13"],["@diegopetrucci/pi-extensions","0.1.77"]] -->
