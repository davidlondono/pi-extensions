# quiet-tools

A pi extension that makes collapsed built-in tool rows and MCP tool rows quieter in the TUI.

When loaded on a supported pi host, quiet rendering is always on: each collapsed tool row shows one invocation line plus a separate `(Ctrl+O to expand)` hint line. Tool output is hidden until expanded. The global `Ctrl+O` binding, per-row expansion, and native expanded result rendering remain available.

`quiet-tools` only changes the visual renderer. It does not truncate, summarize, or rewrite the actual tool results sent to the model. Expanded rendering delegates back to pi's renderer, preserving pi's default output for every tool.

## How it works

On pi >=1.0.1, `quiet-tools` registers a single `pi.registerToolRenderer` resolver. The resolver intercepts collapsed rows for the 7 built-in tools and any `mcp__*` tool and renders them quietly. All other tools are passed through to pi's default rendering. There is no opt-out setting, environment variable, or persistence mechanism.

On pi <1.0.1 (where `registerToolRenderer` is not available), the extension registers no renderers and shows a one-time warning notification on session start. The read-only `/quiet-tools status` command remains available, but rendering is inactive.

## Covered tools

**Built-in tools:** `bash`, `edit`, `find`, `grep`, `ls`, `read`, `write`

Each built-in has a compact one-line summary (for example, `$ echo hello`, `read ~/project/notes.txt:1-20`, or `grep /TODO/ in src/`). Collapsed error and aborted rows retain a terse `[failed]` marker; the full native result remains available when expanded.

**MCP tools:** any tool whose name starts with `mcp__`

MCP collapsed call lines show the tool name followed by compact JSON arguments (sanitized to a single line and truncated to the available TUI width). MCP collapsed results render empty, like built-in collapsed results.

For every covered tool, the collapsed invocation is truncated to a single visual line. Expanding restores pi's normal renderer.

## Command

```text
/quiet-tools
/quiet-tools status
```

Both forms report the always-on status. `status` is the only completion and valid action; other arguments show `Usage: /quiet-tools status` and cannot change rendering.

## Export-style contexts

Quiet call headers are also used in export-style renderer contexts. As a result, an export may omit a native write-call preview; this is an accepted tradeoff. Native expanded result rendering remains available in the TUI, including native error text, timing, and image handling.

## Requirements

Pi >=1.0.1 is required for quiet rendering. On older pi hosts, the extension loads without error and the status command remains available, but rendering is inactive.

## Install

### Standalone npm package

```bash
pi install npm:@diegopetrucci/pi-quiet-tools
```

### Collection package

```bash
pi install npm:@diegopetrucci/pi-extensions
```

### GitHub package

```bash
pi install git:github.com/diegopetrucci/pi-extensions
```

Then reload pi:

```text
/reload
```

## Notes

- `quiet-tools` uses pi's `registerToolRenderer` API to wrap only visual renderers, without touching tool execution, metadata, active-tool selection, or model-visible results.
- It affects assistant-invoked tool rows. User `!`/`!!` bash commands are rendered by a separate pi component and keep pi's default preview behavior.
- Pi renders image attachments outside tool result renderers, so inline image display for image reads is still controlled by pi's image settings.
- MCP tool argument lines are sanitized (ANSI and control characters) and truncated to fit the TUI width. Expand to see full output.
