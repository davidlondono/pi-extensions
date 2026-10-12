# Announcement drafts — v0.1.78

## Short

v0.1.78 is a preparation restart that carries forward the v0.1.77 MCP-aware subagents and always-on quiet tools, adds Pi-parity safety fixes from #137 and #148, and raises the default context-cap and `DUMB ZONE` thresholds to 300k tokens in #157. It is a development baseline, not a whole-fleet compatibility certification.

Suggested public title: **MCP-aware subagents, always-on quiet tools, and 300k context defaults**.

## Highlights

- The six research and review subagents can use configured MCP and tool-search resources on supported hosts with trust/cwd guards and cleanup on exit.
- `quiet-tools` keeps collapsed built-in and `mcp__*` rows compact while preserving native expanded output. Rendering is always on for supported hosts; command status is read-only, edit self-frame and padding behavior is corrected, and collapsed errors retain `[failed]`.
- `code-reviewer` now allows `git branch --contains` while retaining the `git blame --contents` guard ([#137](https://github.com/diegopetrucci/pi-extensions/pull/137)). The guarded subagents resolve cwd-relative, `~`, and encoded `file://` paths with Pi parity and fail closed for unsafe paths ([#148](https://github.com/diegopetrucci/pi-extensions/pull/148)).
- `context-cap` defaults to a 300k effective context window, and `minimal-footer` defaults to a 300k `DUMB ZONE` threshold ([#157](https://github.com/diegopetrucci/pi-extensions/pull/157)).
- Workflow-audit, librarian, dynamic-context-pruning, triage-comments, annotation, model-selection, trust, and documentation reliability fixes from the v0.1.77 baseline remain included.

## Scope and status

- The preparation contains exactly 20 selected package/version pairs; nine workspace targets are intentionally omitted: `brrr`, `claude-fast`, `context-inspector`, `git-footer`, `gnosis`, `illustrations-to-explain-things`, `notify`, `openai-fast`, and `review`.
- Existing fleet markers are unchanged. Quiet-tools remains the only package with the Pi `1.1.0` marker; no whole-fleet certification is claimed.
- A 21-commit audit of `v0.1.76..fcbc7e1215c917c5068da7d31f910016983aae21` found no eligible external human contributors, so no contributor credits are invented.
- This is a preparation draft. The failed GitHub-only v0.1.77 publication attempt is superseded without rewriting its source, tag, or release metadata. No v0.1.78 tag, GitHub release, workflow dispatch, or npm publication is implied.

## Packages

- `@diegopetrucci/pi-agent-workflow-audit@0.1.14`
- `@diegopetrucci/pi-annotate-git-diff@0.1.14`
- `@diegopetrucci/pi-annotate-last-message@0.1.12`
- `@diegopetrucci/pi-code-reviewer@0.1.14`
- `@diegopetrucci/pi-confirm-destructive@0.1.14`
- `@diegopetrucci/pi-context-cap@0.1.15`
- `@diegopetrucci/pi-contrarian@0.1.16`
- `@diegopetrucci/pi-dirty-repo-guard@0.1.12`
- `@diegopetrucci/pi-fast@0.1.9`
- `@diegopetrucci/pi-inline-bash@0.1.13`
- `@diegopetrucci/pi-librarian@0.1.19`
- `@diegopetrucci/pi-minimal-footer@0.1.24`
- `@diegopetrucci/pi-oracle@0.1.31`
- `@diegopetrucci/pi-permission-gate@0.1.17`
- `@diegopetrucci/pi-project-mcp-json@0.1.2`
- `@diegopetrucci/pi-quiet-tools@0.1.14`
- `@diegopetrucci/pi-todo@0.1.12`
- `@diegopetrucci/pi-triage-comments@0.1.15`
- `pi-dynamic-context-pruning@0.1.13`
- `@diegopetrucci/pi-extensions@0.1.78`

<!-- prepare-release:packages [["@diegopetrucci/pi-agent-workflow-audit","0.1.14"],["@diegopetrucci/pi-annotate-git-diff","0.1.14"],["@diegopetrucci/pi-annotate-last-message","0.1.12"],["@diegopetrucci/pi-code-reviewer","0.1.14"],["@diegopetrucci/pi-confirm-destructive","0.1.14"],["@diegopetrucci/pi-context-cap","0.1.15"],["@diegopetrucci/pi-contrarian","0.1.16"],["@diegopetrucci/pi-dirty-repo-guard","0.1.12"],["@diegopetrucci/pi-fast","0.1.9"],["@diegopetrucci/pi-inline-bash","0.1.13"],["@diegopetrucci/pi-librarian","0.1.19"],["@diegopetrucci/pi-minimal-footer","0.1.24"],["@diegopetrucci/pi-oracle","0.1.31"],["@diegopetrucci/pi-permission-gate","0.1.17"],["@diegopetrucci/pi-project-mcp-json","0.1.2"],["@diegopetrucci/pi-quiet-tools","0.1.14"],["@diegopetrucci/pi-todo","0.1.12"],["@diegopetrucci/pi-triage-comments","0.1.15"],["pi-dynamic-context-pruning","0.1.13"],["@diegopetrucci/pi-extensions","0.1.78"]] -->
