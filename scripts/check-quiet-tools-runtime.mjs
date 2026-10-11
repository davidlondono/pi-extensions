#!/usr/bin/env node
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standaloneRoot = path.join(repoRoot, "extensions", "quiet-tools");
const EXPECTED_PI_VERSION = "1.1.0";
const ONE_PIXEL_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
const TERMINAL_ENV_KEYS = [
  "TERM",
  "COLORTERM",
  "TERM_PROGRAM",
  "TERM_PROGRAM_VERSION",
  "TERMINAL_EMULATOR",
  "KITTY_WINDOW_ID",
  "GHOSTTY_RESOURCES_DIR",
  "WEZTERM_PANE",
  "WARP_SESSION_ID",
  "WARP_TERMINAL_SESSION_UUID",
  "ITERM_SESSION_ID",
  "TMUX",
  "WT_SESSION",
  "ZELLIJ",
  "STY",
];
const LOCALE_ENV_KEYS = ["LANG", "LC_ALL", "LC_CTYPE"];
const LAUNCH_DYNAMIC_ENV_KEYS = [...TERMINAL_ENV_KEYS, ...LOCALE_ENV_KEYS, "PI_IMAGE_PROTOCOL"];
const LAUNCH_STATIC_ENV_KEYS = [
  "PATH",
  "HOME",
  "USERPROFILE",
  "XDG_CONFIG_HOME",
  "XDG_CACHE_HOME",
  "TMPDIR",
  "PI_CODING_AGENT_DIR",
  "PI_PACKAGE_DIR",
  "PI_PROGRAM_STATUS",
];
const INHERITED_PATH = process.env.PATH ?? "/usr/bin:/bin";
const INHERITED_TERMINAL_ENV = Object.fromEntries(
  LAUNCH_DYNAMIC_ENV_KEYS.filter((key) => process.env[key] !== undefined).map((key) => [
    key,
    process.env[key],
  ]),
);

function usage() {
  console.error(
    "Usage: node scripts/check-quiet-tools-runtime.mjs --pi-package-dir <path> [--prepare-seeded-smoke]",
  );
}

function parseArguments(argv) {
  let piPackageDir;
  let prepareSeededSmoke = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--pi-package-dir") {
      piPackageDir = argv[index + 1];
      index += 1;
      continue;
    }
    if (argument === "--prepare-seeded-smoke") {
      prepareSeededSmoke = true;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }

  if (!piPackageDir) {
    usage();
    throw new Error("--pi-package-dir is required");
  }
  return { piPackageDir: path.resolve(piPackageDir), prepareSeededSmoke };
}

async function readJson(filePath) {
  const value = JSON.parse(await readFile(filePath, "utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Expected a JSON object in ${filePath}`);
  }
  return value;
}

async function run(command, args, options = {}) {
  try {
    return await execFileAsync(command, args, {
      ...options,
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch (error) {
    const detail = [error?.stdout, error?.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} failed${detail ? `:\n${detail}` : ""}`, {
      cause: error,
    });
  }
}

function assertCondition(condition, message) {
  if (!condition) throw new Error(message);
}

async function prepareIsolatedEnvironment(tempRoot, profileDir) {
  const home = path.join(tempRoot, "deterministic-home");
  const cacheDir = path.join(tempRoot, "deterministic-cache");
  const tmpDir = path.join(tempRoot, "deterministic-tmp");
  await mkdir(home, { recursive: true });
  await mkdir(cacheDir, { recursive: true });
  await mkdir(tmpDir, { recursive: true });
  await mkdir(profileDir, { recursive: true });

  const isolatedEnvironment = {
    PATH: INHERITED_PATH,
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: path.join(home, ".config"),
    XDG_CACHE_HOME: cacheDir,
    TMPDIR: tmpDir,
    PI_CODING_AGENT_DIR: profileDir,
    PI_PROGRAM_STATUS: "0",
    ...INHERITED_TERMINAL_ENV,
  };
  for (const key of Object.keys(process.env)) delete process.env[key];
  Object.assign(process.env, isolatedEnvironment);
  return { home, cacheDir, tmpDir };
}

function stripTerminalFormatting(text) {
  return text.replace(/\x1b\][^\x07]*(?:\x07|\x1b\\)/g, "").replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "");
}

function renderedText(component, width) {
  const lines = component.render(width);
  assertCondition(Array.isArray(lines), "host component render() did not return lines");
  return {
    lines,
    text: stripTerminalFormatting(lines.join("\n")),
  };
}

function hasImageProtocol(lines) {
  return lines.some((line) => line.includes("\x1b_G") || line.includes("\x1b]1337;File="));
}

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

function formatLaunchEnvironment(environment) {
  const staticAssignments = LAUNCH_STATIC_ENV_KEYS.filter(
    (key) => environment[key] !== undefined,
  ).map((key) => `${key}=${shellQuote(String(environment[key]))}`);
  const dynamicAssignments = LAUNCH_DYNAMIC_ENV_KEYS.map((key) => `\${${key}+"${key}=$${key}"}`);
  return [...staticAssignments, ...dynamicAssignments].join(" ");
}

async function exerciseLaunchEnvironmentWhitelist(tempRoot) {
  const preparedUnderHerdr = {
    PATH: INHERITED_PATH,
    HOME: path.join(tempRoot, "launch-home"),
    USERPROFILE: path.join(tempRoot, "launch-home"),
    XDG_CONFIG_HOME: path.join(tempRoot, "launch-home", ".config"),
    XDG_CACHE_HOME: path.join(tempRoot, "launch-cache"),
    TMPDIR: path.join(tempRoot, "launch-tmp"),
    PI_CODING_AGENT_DIR: path.join(tempRoot, "launch-profile"),
    PI_PACKAGE_DIR: path.join(tempRoot, "launch-package"),
    PI_PROGRAM_STATUS: "0",
    TERM: "xterm-herdr",
    TERM_PROGRAM: "herdr",
    TERM_PROGRAM_VERSION: "0.9.3",
    OPENAI_API_KEY: "synthetic-provider-key-sentinel",
    WARP_SECRET_SENTINEL: "synthetic-warp-secret-sentinel",
  };
  const launchEnvironment = {
    ...preparedUnderHerdr,
    TERM: "xterm-ghostty",
    COLORTERM: "truecolor",
    TERM_PROGRAM: "ghostty",
    TERM_PROGRAM_VERSION: "1.2.3",
    WARP_SESSION_ID: "launch-warp-session",
    PI_IMAGE_PROTOCOL: "kitty",
  };
  const launchPrefix = `env -i ${formatLaunchEnvironment(preparedUnderHerdr)}`;
  assertCondition(
    launchPrefix.includes('${TERM_PROGRAM+"TERM_PROGRAM=$TERM_PROGRAM"}'),
    "launch environment must expand TERM_PROGRAM at execution time",
  );
  for (const key of ["TMUX", "WT_SESSION", "ZELLIJ", "STY"]) {
    assertCondition(
      launchPrefix.includes(`\${${key}+"${key}=$${key}"}`),
      `launch environment must preserve ${key} presence at execution time`,
    );
  }
  assertCondition(!launchPrefix.includes("herdr"), "launch environment froze preparer terminal");
  assertCondition(
    !launchPrefix.includes("OPENAI_API_KEY") && !launchPrefix.includes("WARP_SECRET_SENTINEL"),
    "launch environment included an unapproved secret variable",
  );

  const probeScript =
    'printf "%s\\n" "TERM=$TERM" "TERM_PROGRAM=$TERM_PROGRAM" "TERM_PROGRAM_VERSION=$TERM_PROGRAM_VERSION" "PI_IMAGE_PROTOCOL=$PI_IMAGE_PROTOCOL" "OPENAI_API_KEY=${OPENAI_API_KEY-<unset>}" "WARP_SECRET_SENTINEL=${WARP_SECRET_SENTINEL-<unset>}"';
  const { stdout } = await run("sh", ["-c", `${launchPrefix} sh -c ${shellQuote(probeScript)}`], {
    env: launchEnvironment,
  });
  assertCondition(stdout.includes("TERM_PROGRAM=ghostty"), "launch terminal was not detected");
  assertCondition(
    stdout.includes("TERM_PROGRAM_VERSION=1.2.3"),
    "launch terminal version was not detected",
  );
  assertCondition(!stdout.includes("herdr"), "preparer terminal leaked into launch environment");
  assertCondition(
    stdout.includes("OPENAI_API_KEY=<unset>") &&
      !stdout.includes("synthetic-provider-key-sentinel"),
    "synthetic provider key leaked through launch environment",
  );
  assertCondition(
    stdout.includes("WARP_SECRET_SENTINEL=<unset>") && stdout.includes("PI_IMAGE_PROTOCOL=kitty"),
    "launch capability whitelist did not preserve its explicit keys",
  );

  const multiplexerPresenceProbe = [
    'if [ "${TMUX+x}" = x ]; then printf "%s\\n" "TMUX=present:<$TMUX>"; else printf "%s\\n" "TMUX=<unset>"; fi',
    'if [ "${WT_SESSION+x}" = x ]; then printf "%s\\n" "WT_SESSION=present:<$WT_SESSION>"; else printf "%s\\n" "WT_SESSION=<unset>"; fi',
  ].join(String.fromCharCode(10));
  const runMultiplexerPresenceProbe = async (environment) => {
    const result = await run(
      "sh",
      ["-c", `${launchPrefix} sh -c ${shellQuote(multiplexerPresenceProbe)}`],
      { env: environment },
    );
    return result.stdout.trim();
  };

  const unsetEnvironment = { ...launchEnvironment };
  delete unsetEnvironment.TMUX;
  delete unsetEnvironment.WT_SESSION;
  assertCondition(
    (await runMultiplexerPresenceProbe(unsetEnvironment)) ===
      ["TMUX=<unset>", "WT_SESSION=<unset>"].join(String.fromCharCode(10)),
    "unset TMUX/WT_SESSION must stay absent from fullscreen launch arguments",
  );

  const emptyEnvironment = { ...launchEnvironment, TMUX: "", WT_SESSION: "" };
  assertCondition(
    (await runMultiplexerPresenceProbe(emptyEnvironment)) ===
      ["TMUX=present:<>", "WT_SESSION=present:<>"].join(String.fromCharCode(10)),
    "set-empty TMUX/WT_SESSION values must remain present",
  );

  const literalEnvironment = {
    ...launchEnvironment,
    TMUX: 'tmux value;$(printf TMUX_EVAL) * "$HOME"',
    WT_SESSION: 'wt value &|$(printf WT_EVAL) [glob] "$PATH"',
  };
  const literalOutput = await runMultiplexerPresenceProbe(literalEnvironment);
  const expectedLiteralOutput = [
    `TMUX=present:<${literalEnvironment.TMUX}>`,
    `WT_SESSION=present:<${literalEnvironment.WT_SESSION}>`,
  ].join(String.fromCharCode(10));
  assertCondition(
    literalOutput === expectedLiteralOutput,
    "set multiplexer values must remain one literal safely quoted argument",
  );
}

function makeTextResult(text, durationMs, details = {}) {
  return {
    content: [{ type: "text", text }],
    details,
    isError: false,
    durationMs,
  };
}

async function packCandidate(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const extractDir = path.join(tempRoot, "candidate");
  await mkdir(packDir, { recursive: true });
  await mkdir(extractDir, { recursive: true });

  const { stdout } = await run(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", packDir],
    {
      cwd: standaloneRoot,
      env: {
        ...process.env,
        npm_config_ignore_scripts: "true",
        npm_config_audit: "false",
        npm_config_fund: "false",
      },
    },
  );
  let packResult;
  try {
    packResult = JSON.parse(stdout.trim());
  } catch (error) {
    throw new Error(`npm pack returned non-JSON output: ${stdout}`, { cause: error });
  }
  assertCondition(
    Array.isArray(packResult) && packResult.length === 1,
    "npm pack returned one artifact",
  );
  const filename = packResult[0]?.filename;
  assertCondition(
    typeof filename === "string" && filename.length > 0,
    "npm pack did not report a filename",
  );
  const tarball = path.join(packDir, filename);

  await run("tar", ["-xzf", tarball, "-C", extractDir]);
  const candidateRoot = path.join(extractDir, "package");
  const candidateManifest = await readJson(path.join(candidateRoot, "package.json"));
  const candidateEntry = path.join(candidateRoot, "index.ts");
  assertCondition(
    candidateManifest.name === "@diegopetrucci/pi-quiet-tools",
    "packed candidate name mismatch",
  );
  assertCondition(
    candidateManifest.version ===
      (await readJson(path.join(standaloneRoot, "package.json"))).version,
    "packed candidate version mismatch",
  );

  return {
    candidateRoot,
    candidateEntry,
    candidateManifest,
    filename,
    pack: packResult[0],
  };
}

function nativeDefinition(nativeRenderers, toolName) {
  const renderer = nativeRenderers[toolName];
  if (!renderer) return undefined;
  return toolName === "edit" ? { ...renderer, renderShell: "self" } : renderer;
}

function createRegisteredMcpRenderers(Text) {
  return {
    renderCall(_args, theme, context) {
      const component = context.lastComponent ?? new Text("", 0, 0);
      component.setText(theme.fg("toolTitle", "native registered MCP call"));
      return component;
    },
    renderResult(_result, _options, theme, context) {
      const component = context.lastComponent ?? new Text("", 0, 0);
      component.setText(theme.fg("toolOutput", "native registered MCP result"));
      return component;
    },
  };
}

function createResultForTool(toolName) {
  switch (toolName) {
    case "bash":
      return makeTextResult("runtime bash output", 1234);
    case "read":
      return makeTextResult("runtime read output", 2345);
    case "grep":
      return makeTextResult("runtime grep output", 3456);
    case "find":
      return makeTextResult("runtime find output", 4567);
    case "ls":
      return makeTextResult("runtime ls output", 5678);
    case "edit":
      return makeTextResult("runtime edit completed", 2222, {
        diff: "-old line\n+new line\n",
        firstChangedLine: 1,
      });
    case "write":
      return makeTextResult("runtime write completed", 3333);
    default:
      return makeTextResult("runtime tool output", 1111);
  }
}

function createArgsForTool(toolName) {
  switch (toolName) {
    case "bash":
      return { command: "printf runtime" };
    case "read":
      return { path: "read-target.txt" };
    case "grep":
      return { pattern: "runtime", path: "." };
    case "find":
      return { pattern: "*.txt", path: "." };
    case "ls":
      return { path: "." };
    case "edit":
      return { path: "edit-target.txt", edits: [{ oldText: "old line", newText: "new line" }] };
    case "write":
      return { path: "write-target.md", content: "runtime write content\n" };
    default:
      return { input: "runtime" };
  }
}

async function loadPackagedExtension({ piPackageDir, candidateEntry, cwd, profileDir }) {
  const hostRoot = path.resolve(piPackageDir);
  const hostManifest = await readJson(path.join(hostRoot, "package.json"));
  assertCondition(
    hostManifest.version === EXPECTED_PI_VERSION,
    `host version must be exactly ${EXPECTED_PI_VERSION}; found ${hostManifest.version ?? "unknown"}`,
  );

  const host = await import(pathToFileURL(path.join(hostRoot, "dist", "index.js")).href);
  const hostRenderers = await import(
    pathToFileURL(path.join(hostRoot, "dist", "core", "tools", "renderers", "index.js")).href
  );
  const tuiRoot = path.resolve(hostRoot, "..", "pi-tui");
  const hostTui = await import(pathToFileURL(path.join(tuiRoot, "dist", "index.js")).href);
  host.initTheme("dark");

  const loaded = await host.discoverAndLoadExtensions([candidateEntry], cwd, profileDir);
  assertCondition(
    loaded.errors.length === 0,
    `packaged extension load errors: ${JSON.stringify(loaded.errors)}`,
  );
  const extension = loaded.extensions.find(
    (entry) => path.resolve(entry.path) === path.resolve(candidateEntry),
  );
  assertCondition(extension, "packaged quiet-tools extension was not discovered");
  assertCondition(extension.tools.size === 0, "quiet-tools registered an executable tool");
  assertCondition(
    extension.toolRenderers?.length === 1,
    "quiet-tools did not register one renderer resolver",
  );
  assertCondition(extension.commands.has("quiet-tools"), "quiet-tools status command is missing");

  return {
    host,
    hostRenderers,
    hostTui,
    extension,
    resolver: extension.toolRenderers[0],
  };
}

function createComponent(runtime, toolName, args, nextRenderers, cwd, outputPad = 1) {
  const wrapped = runtime.resolver(toolName, () => nextRenderers);
  assertCondition(wrapped, `${toolName}: packaged resolver returned no renderers`);
  const component = new runtime.host.ToolExecutionComponent(
    toolName,
    `runtime-${toolName}`,
    args,
    { outputPad, showImages: true, imageWidthCells: 24 },
    wrapped,
    { requestRender() {} },
    cwd,
  );
  return { component, wrapped };
}

function exerciseTransitions(runtime, nativeRenderers, cwd) {
  const toolNames = ["bash", "edit", "find", "grep", "ls", "read", "write"];
  for (const toolName of toolNames) {
    runtime.host.initTheme("dark");
    const { component } = createComponent(
      runtime,
      toolName,
      createArgsForTool(toolName),
      nativeDefinition(nativeRenderers, toolName),
      cwd,
    );
    component.markExecutionStarted();
    component.setArgsComplete();
    const initial = renderedText(component, 80);
    assertCondition(
      initial.text.includes("to expand"),
      `${toolName}: collapsed expand hint missing`,
    );

    const result = createResultForTool(toolName);
    component.updateResult(result, true);
    renderedText(component, 80);
    component.updateResult(result, false);
    const collapsed = renderedText(component, 80);
    const hiddenText =
      toolName === "edit"
        ? "+new line"
        : toolName === "write"
          ? "runtime write completed"
          : `runtime ${toolName} output`;
    assertCondition(
      !collapsed.text.includes(hiddenText),
      `${toolName}: collapsed result text leaked`,
    );

    component.setExpanded(true);
    const expanded = renderedText(component, 100);
    if (toolName === "bash") {
      assertCondition(
        expanded.text.includes("runtime bash output"),
        "bash: native expanded output missing",
      );
      assertCondition(
        expanded.text.includes("Took 1.2s"),
        "bash: recorded duration missing after expansion",
      );
    } else if (toolName === "edit") {
      assertCondition(expanded.text.includes("+new line"), "edit: native expanded diff missing");
    } else if (toolName === "write") {
      assertCondition(
        expanded.text.includes("runtime write content"),
        "write: native expanded preview missing",
      );
    } else {
      assertCondition(
        expanded.text.includes(`runtime ${toolName} output`),
        `${toolName}: native expanded output missing`,
      );
    }

    component.setExpanded(false);
    const recollapsed = renderedText(component, 80);
    assertCondition(recollapsed.text.includes("to expand"), `${toolName}: row did not recollapse`);
  }
}

function exerciseErrorsAndTiming(runtime, nativeRenderers, cwd) {
  const errorTexts = ["runtime error detail", "Operation aborted"];
  for (const errorText of errorTexts) {
    const { component } = createComponent(
      runtime,
      "bash",
      { command: "false" },
      nativeDefinition(nativeRenderers, "bash"),
      cwd,
    );
    component.markExecutionStarted();
    component.setArgsComplete();
    const result = {
      content: [{ type: "text", text: errorText }],
      details: {},
      isError: true,
      durationMs: 77,
    };
    component.updateResult(result, false);
    const collapsed = renderedText(component, 100);
    assertCondition(
      collapsed.text.includes("[failed]"),
      `bash ${errorText}: failed marker missing`,
    );
    assertCondition(
      !collapsed.text.includes(errorText),
      `bash ${errorText}: full error leaked while collapsed`,
    );
    component.setExpanded(true);
    const expanded = renderedText(component, 100);
    assertCondition(expanded.text.includes(errorText), `bash ${errorText}: expanded error missing`);
  }

  const { component: live } = createComponent(
    runtime,
    "bash",
    { command: "printf live" },
    nativeDefinition(nativeRenderers, "bash"),
    cwd,
  );
  live.markExecutionStarted();
  live.setArgsComplete();
  live.updateResult(makeTextResult("partial output", undefined), true);
  assertCondition(
    !live.rendererState.interval,
    "bash: collapsed partial row created a redundant native timer",
  );
  live.updateResult(
    { content: [{ type: "text", text: "done" }], details: {}, isError: true },
    false,
  );
  assertCondition(!live.rendererState.interval, "bash: final error did not clear native timer");

  for (const isError of [false, true]) {
    const { component: transition } = createComponent(
      runtime,
      "bash",
      { command: "printf transition" },
      nativeDefinition(nativeRenderers, "bash"),
      cwd,
    );
    transition.markExecutionStarted();
    transition.setArgsComplete();
    transition.setExpanded(true);
    transition.updateResult(makeTextResult("transition partial", undefined), true);
    assertCondition(
      transition.rendererState.interval,
      `bash: expanded partial ${isError ? "error" : "success"} row did not start native timer`,
    );
    transition.setExpanded(false);
    transition.updateResult(
      {
        content: [{ type: "text", text: isError ? "transition error" : "transition done" }],
        details: {},
        isError,
      },
      false,
    );
    assertCondition(
      !transition.rendererState.interval,
      `bash: collapsed final ${isError ? "error" : "success"} did not clear native timer`,
    );
    assertCondition(
      typeof transition.rendererState.endedAt === "number",
      `bash: collapsed final ${isError ? "error" : "success"} did not stamp endedAt`,
    );
  }

  const originalCapabilities = runtime.hostTui.getCapabilities();
  try {
    runtime.hostTui.setCapabilities({ ...originalCapabilities, images: "kitty" });
    const { component: imageRow } = createComponent(
      runtime,
      "read",
      { path: "image.png" },
      nativeDefinition(nativeRenderers, "read"),
      cwd,
    );
    imageRow.markExecutionStarted();
    imageRow.setArgsComplete();
    imageRow.updateResult(
      {
        content: [
          { type: "text", text: "image result" },
          { type: "image", data: ONE_PIXEL_PNG, mimeType: "image/png" },
        ],
        details: {},
        isError: false,
        durationMs: 9,
      },
      false,
    );
    const collapsedImage = renderedText(imageRow, 80);
    assertCondition(imageRow.imageComponents.length === 1, "collapsed image component missing");
    assertCondition(
      hasImageProtocol(collapsedImage.lines),
      "collapsed image protocol output missing",
    );
    assertCondition(
      !collapsedImage.lines.some((line) => line.includes("image result")),
      "collapsed image text leaked",
    );

    imageRow.setExpanded(true);
    const expandedImage = renderedText(imageRow, 80);
    assertCondition(imageRow.imageComponents.length === 1, "expanded image component missing");
    assertCondition(
      hasImageProtocol(expandedImage.lines),
      "expanded image protocol output missing",
    );
    assertCondition(
      expandedImage.lines.some((line) => line.includes("image result")),
      "image row native expanded result missing",
    );

    imageRow.setExpanded(false);
    const recollapsedImage = renderedText(imageRow, 80);
    assertCondition(hasImageProtocol(recollapsedImage.lines), "recollapsed image protocol missing");
    assertCondition(
      !recollapsedImage.lines.some((line) => line.includes("image result")),
      "recollapsed image text leaked",
    );
  } finally {
    runtime.hostTui.setCapabilities(originalCapabilities);
  }
}

function exerciseMcpFallbacks(runtime, cwd) {
  const registered = createRegisteredMcpRenderers(runtime.hostTui.Text);
  const registeredRow = createComponent(
    runtime,
    "mcp__registered__tool",
    { input: "registered" },
    registered,
    cwd,
  ).component;
  registeredRow.markExecutionStarted();
  registeredRow.setArgsComplete();
  registeredRow.updateResult(makeTextResult("ignored registered result", 12), false);
  const registeredCollapsed = renderedText(registeredRow, 80);
  assertCondition(
    !registeredCollapsed.text.includes("ignored registered result"),
    "registered MCP collapsed result text leaked",
  );
  registeredRow.setExpanded(true);
  assertCondition(
    renderedText(registeredRow, 80).text.includes("native registered MCP result"),
    "registered MCP expanded native renderer missing",
  );

  const unregisteredRow = createComponent(
    runtime,
    "mcp__unregistered__tool",
    { input: "fallback" },
    undefined,
    cwd,
  ).component;
  unregisteredRow.markExecutionStarted();
  unregisteredRow.setArgsComplete();
  unregisteredRow.updateResult(makeTextResult("unregistered MCP result", 13), false);
  const collapsed = renderedText(unregisteredRow, 80);
  assertCondition(
    collapsed.text.includes("to expand"),
    "unregistered MCP collapsed quiet row missing",
  );
  assertCondition(
    !collapsed.text.includes("unregistered MCP result"),
    "unregistered MCP collapsed result text leaked",
  );
  unregisteredRow.setExpanded(true);
  const expanded = renderedText(unregisteredRow, 100);
  assertCondition(
    expanded.text.includes("mcp__unregistered__tool"),
    "unregistered MCP call fallback missing",
  );
  assertCondition(
    expanded.text.includes("unregistered MCP result"),
    "unregistered MCP result fallback missing",
  );
}

function exerciseThemesWidthsAndPadding(runtime, nativeRenderers, cwd) {
  for (const themeName of ["dark", "light"]) {
    runtime.host.initTheme(themeName);
    const { component } = createComponent(
      runtime,
      "bash",
      { command: "printf width" },
      nativeDefinition(nativeRenderers, "bash"),
      cwd,
    );
    component.markExecutionStarted();
    component.setArgsComplete();
    for (const width of [1, 20, 80]) renderedText(component, width);
  }

  runtime.host.initTheme("dark");
  for (const outputPad of [0, 1]) {
    const { component } = createComponent(
      runtime,
      "edit",
      { path: "edit-target.txt", edits: [{ oldText: "old line", newText: "new line" }] },
      nativeDefinition(nativeRenderers, "edit"),
      cwd,
      outputPad,
    );
    component.markExecutionStarted();
    component.setArgsComplete();
    const line = stripTerminalFormatting(
      component.render(80).find((item) => item.includes("edit")) ?? "",
    );
    assertCondition(
      line.indexOf("edit") === outputPad,
      `edit: outputPad ${outputPad} was not applied`,
    );
  }
}

function exerciseNativeFooter(runtime, sessionFile, sessionDir, cwd) {
  const sessionManager = runtime.host.SessionManager.open(sessionFile, sessionDir, cwd);
  const projection = sessionManager.buildSessionProjection();
  const assistantMessages = projection.messages.filter((message) => message.role === "assistant");
  assertCondition(assistantMessages.length > 0, "seeded session has no assistant messages");
  for (const message of assistantMessages) {
    assertCondition(message.api === "openai-completions", "seeded assistant api metadata missing");
    assertCondition(message.provider === "openai", "seeded assistant provider metadata missing");
    assertCondition(message.model === "gpt-4o-mini", "seeded assistant model metadata missing");
    assertCondition(message.usage?.totalTokens === 0, "seeded assistant usage is not zero");
    assertCondition(message.usage?.cost?.total === 0, "seeded assistant cost is not zero");
  }

  let contextUsageCalls = 0;
  const session = {
    sessionManager,
    state: { model: undefined, thinkingLevel: "off" },
    model: undefined,
    routedModel: undefined,
    modelRuntime: { isUsingSubscription: () => false },
    getContextUsage: () => {
      contextUsageCalls += 1;
      return { tokens: 0, contextWindow: 4096, percent: 0 };
    },
  };
  const footerData = {
    getGitBranch: () => null,
    getExtensionStatuses: () => new Map(),
    getAvailableProviderCount: () => 0,
  };
  const footer = new runtime.host.FooterComponent(session, footerData);
  const lines = footer.render(120);
  assertCondition(Array.isArray(lines) && lines.length >= 2, "native footer did not render lines");
  assertCondition(contextUsageCalls === 1, "native footer did not consume context usage");
  assertCondition(!lines.join("\n").includes("NaN"), "native footer rendered invalid numeric data");
  assertCondition(!lines.join("\n").includes("undefined"), "native footer rendered undefined data");
}

function appendMessage(entries, state, message) {
  const id = `e${String(entries.length + 1).padStart(4, "0")}`;
  entries.push({
    id,
    parentId: state.parentId,
    timestamp: new Date(state.timestamp).toISOString(),
    type: "message",
    message,
  });
  state.parentId = id;
  state.timestamp += 1000;
}

function seededAssistantMetadata() {
  return {
    api: "openai-completions",
    provider: "openai",
    model: "gpt-4o-mini",
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        total: 0,
      },
    },
  };
}

function addSuccessTool(entries, state, name, args, content, details, durationMs) {
  const toolCallId = `seed-${entries.length}`;
  appendMessage(entries, state, {
    role: "assistant",
    ...seededAssistantMetadata(),
    content: [{ type: "toolCall", id: toolCallId, name, arguments: args }],
    stopReason: "stop",
    timestamp: state.timestamp,
  });
  appendMessage(entries, state, {
    role: "toolResult",
    toolCallId,
    toolName: name,
    content,
    details,
    isError: false,
    durationMs,
    timestamp: state.timestamp,
  });
}

function addStoppedTool(entries, state, name, args, stopReason, errorMessage) {
  appendMessage(entries, state, {
    role: "assistant",
    ...seededAssistantMetadata(),
    content: [{ type: "toolCall", id: `seed-${entries.length}`, name, arguments: args }],
    stopReason,
    errorMessage,
    timestamp: state.timestamp,
  });
}

async function writeSeededSmokeFixtures(root, piPackageDir, candidateEntry, candidateManifest) {
  const cwd = path.join(root, "smoke-cwd");
  const home = path.join(root, "smoke-home");
  const cacheDir = path.join(root, "smoke-cache");
  const tmpDir = path.join(root, "smoke-tmp");
  const profileDir = path.join(root, "smoke-profile");
  const sessionDir = path.join(root, "smoke-sessions");
  const sessionFile = path.join(root, "quiet-tools-pi-1.1.0-smoke.jsonl");
  await mkdir(cwd, { recursive: true });
  await mkdir(home, { recursive: true });
  await mkdir(cacheDir, { recursive: true });
  await mkdir(tmpDir, { recursive: true });
  await mkdir(profileDir, { recursive: true });
  await mkdir(sessionDir, { recursive: true });
  await writeFile(path.join(cwd, "edit-target.txt"), "old line\n", "utf8");
  await writeFile(path.join(cwd, "write-target.md"), "before\n", "utf8");
  await writeFile(path.join(cwd, "read-target.txt"), "seeded read content\n", "utf8");
  await writeFile(path.join(cwd, "image.png"), Buffer.from(ONE_PIXEL_PNG, "base64"));

  const entries = [];
  const state = { parentId: null, timestamp: Date.UTC(2026, 0, 1, 0, 0, 0) };
  appendMessage(entries, state, {
    role: "user",
    content: "Seeded quiet-tools Pi 1.1.0 visual smoke",
    timestamp: state.timestamp,
  });
  addSuccessTool(
    entries,
    state,
    "bash",
    { command: "printf 'seeded success'" },
    [{ type: "text", text: "seeded success output" }],
    {},
    1234,
  );
  addStoppedTool(
    entries,
    state,
    "bash",
    { command: "printf 'seeded error'" },
    "error",
    "Seeded error result",
  );
  addStoppedTool(entries, state, "bash", { command: "sleep 1" }, "aborted", undefined);
  addSuccessTool(
    entries,
    state,
    "edit",
    { path: "edit-target.txt", edits: [{ oldText: "old line", newText: "new line" }] },
    [{ type: "text", text: "edit complete" }],
    { diff: "-old line\n+new line\n", firstChangedLine: 1 },
    2222,
  );
  addSuccessTool(
    entries,
    state,
    "write",
    { path: "write-target.md", content: "seeded write preview\nsecond line\n" },
    [{ type: "text", text: "write complete" }],
    {},
    3333,
  );
  addSuccessTool(
    entries,
    state,
    "mcp__seeded__fallback",
    { input: "offline fallback" },
    [{ type: "text", text: "seeded MCP fallback result" }],
    {},
    4444,
  );
  addSuccessTool(
    entries,
    state,
    "read",
    { path: "image.png" },
    [
      { type: "text", text: "seeded image result" },
      { type: "image", data: ONE_PIXEL_PNG, mimeType: "image/png" },
    ],
    {},
    5555,
  );

  const header = {
    type: "session",
    version: 3,
    id: "quiet-tools-pi-1.1.0-smoke",
    timestamp: new Date(Date.UTC(2026, 0, 1)).toISOString(),
    cwd,
  };
  await writeFile(
    sessionFile,
    `${JSON.stringify(header)}\n${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`,
    "utf8",
  );

  const piCli = path.join(piPackageDir, "dist", "bundle", "cli.js");
  const common = [
    "--offline",
    "--no-mcp",
    "--no-context-files",
    "--no-skills",
    "--no-prompt-templates",
    "--no-themes",
    "--no-extensions",
    "--extension",
    candidateEntry,
    "--session",
    sessionFile,
    "--session-dir",
    sessionDir,
    "--tools",
    "bash,edit,find,grep,ls,read,write",
    "--no-approve",
  ];
  const launchEnvironment = {
    PATH: INHERITED_PATH,
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: path.join(home, ".config"),
    XDG_CACHE_HOME: cacheDir,
    TMPDIR: tmpDir,
    PI_CODING_AGENT_DIR: profileDir,
    PI_PACKAGE_DIR: piPackageDir,
    PI_PROGRAM_STATUS: "0",
    ...INHERITED_TERMINAL_ENV,
  };
  const prefix = [
    `cd ${shellQuote(cwd)}`,
    `env -i ${formatLaunchEnvironment(launchEnvironment)} ${shellQuote(process.execPath)} ${shellQuote(piCli)}`,
  ];
  const regularCommand = `${prefix[0]} && ${prefix[1]} ${common.map(shellQuote).join(" ")} --tui-mode regular`;
  const fullscreenCommand = `${prefix[0]} && ${prefix[1]} ${common.map(shellQuote).join(" ")} --tui-mode fullscreen`;
  const cleanupCommand = `rm -rf -- ${shellQuote(root)}`;

  await writeFile(
    path.join(root, "smoke-manifest.json"),
    `${JSON.stringify(
      {
        candidateManifest,
        candidateEntry,
        cwd,
        home,
        cacheDir,
        tmpDir,
        profileDir,
        sessionDir,
        sessionFile,
        regularCommand,
        fullscreenCommand,
        cleanupCommand,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  return {
    cwd,
    home,
    cacheDir,
    tmpDir,
    profileDir,
    sessionDir,
    sessionFile,
    regularCommand,
    fullscreenCommand,
    cleanupCommand,
  };
}

async function main() {
  const { piPackageDir, prepareSeededSmoke } = parseArguments(process.argv.slice(2));
  const hostManifest = await readJson(path.join(piPackageDir, "package.json"));
  assertCondition(
    hostManifest.version === EXPECTED_PI_VERSION,
    `host version must be exactly ${EXPECTED_PI_VERSION}; found ${hostManifest.version ?? "unknown"}`,
  );
  assertCondition(
    hostManifest.name === "@earendil-works/pi-coding-agent",
    `--pi-package-dir is not pi-coding-agent: ${hostManifest.name ?? "unknown"}`,
  );

  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "quiet-tools-runtime-"));
  let retainRoot = false;
  try {
    const deterministicCwd = path.join(tempRoot, "deterministic-cwd");
    const deterministicProfile = path.join(tempRoot, "deterministic-profile");
    await prepareIsolatedEnvironment(tempRoot, deterministicProfile);
    await exerciseLaunchEnvironmentWhitelist(tempRoot);
    await mkdir(deterministicCwd, { recursive: true });
    await writeFile(path.join(deterministicCwd, "edit-target.txt"), "old line\n", "utf8");
    await writeFile(path.join(deterministicCwd, "write-target.md"), "before\n", "utf8");
    await writeFile(path.join(deterministicCwd, "read-target.txt"), "read target\n", "utf8");

    const candidate = await packCandidate(tempRoot);
    const runtime = await loadPackagedExtension({
      piPackageDir,
      candidateEntry: candidate.candidateEntry,
      cwd: deterministicCwd,
      profileDir: deterministicProfile,
    });
    const nativeRenderers = runtime.hostRenderers.createAllToolRenderers();
    exerciseTransitions(runtime, nativeRenderers, deterministicCwd);
    exerciseErrorsAndTiming(runtime, nativeRenderers, deterministicCwd);
    exerciseMcpFallbacks(runtime, deterministicCwd);
    exerciseThemesWidthsAndPadding(runtime, nativeRenderers, deterministicCwd);

    const smoke = await writeSeededSmokeFixtures(
      tempRoot,
      piPackageDir,
      candidate.candidateEntry,
      candidate.candidateManifest,
    );
    exerciseNativeFooter(runtime, smoke.sessionFile, smoke.sessionDir, smoke.cwd);

    const rootState = prepareSeededSmoke
      ? "retained for explicitly reported smoke fixtures"
      : "cleaned before exit";
    console.log(
      `quiet-tools runtime checks passed: host=${hostManifest.version}; candidate=${candidate.candidateManifest.version}; tarball=${candidate.filename}; extension loaded via discoverAndLoadExtensions; executableTools=0; builtins=7; mcp=registered+unregistered; launchEnv=passed; nativeFooter=passed; deterministicRoot=${tempRoot} (${rootState})`,
    );

    if (prepareSeededSmoke) {
      for (const relativePath of [
        "pack",
        "deterministic-cwd",
        "deterministic-home",
        "deterministic-cache",
        "deterministic-tmp",
        "deterministic-profile",
      ]) {
        await rm(path.join(tempRoot, relativePath), { recursive: true, force: true });
      }
      retainRoot = true;
      console.log(`seeded smoke root retained (tool-owned; human visual gate only): ${tempRoot}`);
      console.log(`seeded smoke manifest: ${path.join(tempRoot, "smoke-manifest.json")}`);
      console.log(`seeded session JSONL: ${smoke.sessionFile}`);
      console.log(`regular offline launch: ${smoke.regularCommand}`);
      console.log(`fullscreen offline launch: ${smoke.fullscreenCommand}`);
      console.log(`safe cleanup after the visual gate: ${smoke.cleanupCommand}`);
    }
  } finally {
    if (!retainRoot) await rm(tempRoot, { recursive: true, force: true });
  }
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
