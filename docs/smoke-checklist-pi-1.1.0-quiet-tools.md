# quiet-tools Pi 1.1.0 seeded smoke checklist

This is the human visual gate for the standalone `@diegopetrucci/pi-quiet-tools` candidate. The deterministic component check prepares the fixture and prints exact offline launch commands; it does not claim terminal rendering, Ctrl+O, or mouse verification.

## Prepare the tool-owned fixture

From the repository root:

```bash
node scripts/check-quiet-tools-runtime.mjs \
  --pi-package-dir /Users/diegopetrucci/Developer/the-last-harness-fifth/node_modules/@earendil-works/pi-coding-agent \
  --prepare-seeded-smoke
```

The script must report host `1.1.0`, a packaged candidate, a retained tool-owned smoke root, and a native footer check. It prints the exact regular and fullscreen commands plus a cleanup command. Copy those commands rather than substituting a normal/home profile or working directory.

The saved JSONL includes native assistant `api`/`provider`/`model` metadata with zero usage and cost, successful output with recorded duration, an error, an aborted call, edit and write calls, an unregistered `mcp__` fallback, and an image result. The native `SessionManager` and `FooterComponent` consume this fixture offline with a minimal non-provider stub; no provider is registered and no credentials or model endpoint are added.

The emitted commands use `env -i` with only tool-owned `HOME`, XDG config/cache, `TMPDIR`, `PI_CODING_AGENT_DIR`, `PI_PACKAGE_DIR`, `PI_PROGRAM_STATUS=0`, `PATH`, and an explicit terminal/capability/locale whitelist. The terminal values are shell expansions evaluated when the human runs the command, rather than values frozen while the fixture was prepared (for example, the preparer may be under Herdr). Each dynamic assignment uses the presence-preserving POSIX form `${KEY+"KEY=$KEY"}`: an unset key is omitted entirely, a set-empty key remains `KEY=`, and set values remain one safely quoted literal argument. The whitelist is `TERM`, `COLORTERM`, `TERM_PROGRAM`, `TERM_PROGRAM_VERSION`, `TERMINAL_EMULATOR`, `KITTY_WINDOW_ID`, `GHOSTTY_RESOURCES_DIR`, `WEZTERM_PANE`, `WARP_SESSION_ID`, `WARP_TERMINAL_SESSION_UUID`, `ITERM_SESSION_ID`, `TMUX`, `WT_SESSION`, `ZELLIJ`, `STY`, `LANG`, `LC_ALL`, `LC_CTYPE`, and `PI_IMAGE_PROTOCOL`; there are no wildcard `WARP_*` entries or provider/auth variables. `PI_IMAGE_PROTOCOL`, when present, only preserves the host's native capability detection and is not a quiet-tools opt-out. `--offline` only suppresses startup network operations; credential/profile isolation is the safety boundary, not `PI_OFFLINE`. No inherited provider, auth, MCP, or TLH-profile environment is allowed.

The deterministic check includes pure shell/environment probes prepared with synthetic Herdr values and evaluated with a different launch-terminal value. It verifies launch-time terminal detection, unset versus set-empty `TMUX`/`WT_SESSION` presence, literal values containing spaces and shell metacharacters, and that synthetic provider-key sentinels stay excluded. These probes do not launch the CLI/TUI or execute a provider, MCP server, prompt, or tool.

## Human checks

Run the emitted **regular** command, then separately the emitted **fullscreen** command. In each mode:

The command must retain the explicit native tool allowlist `--tools bash,edit,find,grep,ls,read,write`. Do not replace it with `--no-tools`: disabling tools removes the native tool definitions, so native `edit` cannot retain `renderShell:self` framing/metadata. Do not submit a prompt, execute a tool, or change the emitted arguments during this visual gate.

1. Confirm startup is offline and does not request provider authentication.
2. Run `/quiet-tools` and `/quiet-tools status`; both are read-only status reports. Confirm obsolete arguments only show status usage and do not alter rendering.
3. Confirm successful collapsed rows show a compact invocation and expand hint, with output hidden.
4. Expand and collapse rows with the global `Ctrl+O`, the per-row expansion control, and a mouse click where supported. Confirm native expanded results, edit diff, write preview, recorded bash duration, error text, aborted text, MCP fallback result, and the image remain available.
5. Confirm collapsed error and aborted rows show a terse failed marker without exposing the full error text.
6. Check narrow widths and at least one alternate theme if available.
7. In an image-capable supported terminal with images enabled, confirm native image protocol output is present in both collapsed and expanded image rows, while image result text stays hidden until expansion. Unsupported Herdr/tmux environments may not expose image capability; do not spoof a protocol or force one through an unsupported multiplexer.

Export-style contexts may show a quiet call header without the native write-call preview; this is an accepted tradeoff. Native expanded result rendering is the required behavior.

Do not make exact fullscreen screen-output assertions. The regular/fullscreen interaction gate is deferred to `tlhf-uyra` and must be reported separately from deterministic component evidence.

## Cleanup

After both visual runs, execute the exact cleanup command printed by the script. It removes only the retained tool-owned smoke root; do not remove or modify any normal/home profile.
