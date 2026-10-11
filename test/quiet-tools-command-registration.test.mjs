import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { initTheme } from "@earendil-works/pi-coding-agent";
import { createExtensionHarness } from "./extension-test-helpers.mjs";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, "..");
const quietToolsModule = await import(
  pathToFileURL(path.join(repoRoot, "extensions/quiet-tools/index.ts")).href
);
const quietToolsExtension = quietToolsModule.default;

initTheme("dark");

const theme = {
  fg(kind, text) {
    return `<${kind}>${text}</${kind}>`;
  },
  bold(text) {
    return `*${text}*`;
  },
};

function stripAnsi(text) {
  return text.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "").trimEnd();
}

function getQuietToolsCommand(harness) {
  const command = harness.commands.get("quiet-tools");
  assert.ok(command, "expected quiet-tools command to be registered");
  return command;
}

function createCommandContext() {
  const notifications = [];
  return {
    notifications,
    ctx: {
      cwd: repoRoot,
      ui: {
        notify(message, level) {
          notifications.push({ message, level });
        },
      },
    },
  };
}

/**
 * Simulate running a tool call through the single registered resolver with a given next() result.
 * Returns the rendered lines of the collapsed call component, or null if no resolver is registered.
 */
function simulateCollapsedCall(harness, toolName, args, nextRenderers = undefined) {
  if (harness.toolRendererResolvers.length === 0) return null;
  const resolver = harness.toolRendererResolvers[0];
  const renderers = resolver(toolName, () => nextRenderers);
  if (!renderers?.renderCall) return null;
  const component = renderers.renderCall(args, theme, {
    expanded: false,
    executionStarted: true,
    argsComplete: true,
    cwd: repoRoot,
    lastComponent: undefined,
    state: {},
  });
  return component.render(200).map(stripAnsi);
}

function simulateExpandedCall(harness, toolName, nextRenderers) {
  if (harness.toolRendererResolvers.length === 0) return null;
  const resolver = harness.toolRendererResolvers[0];
  const renderers = resolver(toolName, () => nextRenderers);
  if (!renderers?.renderCall) return null;
  return renderers.renderCall({}, theme, {
    expanded: true,
    executionStarted: false,
    argsComplete: true,
    cwd: repoRoot,
    lastComponent: undefined,
    state: {},
  });
}

const quietToolCases = new Map([
  ["bash", { command: "echo hello" }],
  ["edit", { file_path: "README.md" }],
  ["find", { pattern: "src/**/*.ts" }],
  ["grep", { pattern: "TODO" }],
  ["ls", { path: "." }],
  ["read", { path: "README.md" }],
  ["write", { path: "README.md", content: "" }],
]);

test("quiet-tools registers one resolver via registerToolRenderer (not registerTool)", () => {
  const harness = createExtensionHarness();
  quietToolsExtension(harness.pi);

  assert.equal(harness.tools.size, 0, "no pi.registerTool calls");
  assert.equal(harness.toolRendererResolvers.length, 1, "exactly one resolver registered");
});

test("quiet-tools resolver quiets collapsed built-in rows", () => {
  const harness = createExtensionHarness();
  quietToolsExtension(harness.pi);

  for (const [toolName, args] of quietToolCases) {
    const lines = simulateCollapsedCall(harness, toolName, args);
    assert.equal(lines?.length, 2, `${toolName}: collapsed quiet call renders 2 lines`);
    assert.match(lines[1], /to expand/, `${toolName}: expand hint present`);
  }
});

test("quiet-tools resolver quiets collapsed mcp__ rows", () => {
  const harness = createExtensionHarness();
  quietToolsExtension(harness.pi);

  const lines = simulateCollapsedCall(harness, "mcp__my_server__do_thing", { input: "test" });
  assert.equal(lines?.length, 2, "mcp__ tool: collapsed quiet call renders 2 lines");
  assert.match(lines[0], /mcp__my_server__do_thing/, "tool name in first line");
  assert.match(lines[1], /to expand/, "expand hint present");
});

test("quiet-tools resolver does not quiet other tools", () => {
  const harness = createExtensionHarness();
  quietToolsExtension(harness.pi);

  const nextCall = { type: "next-call", render: () => ["next line"] };
  const resolver = harness.toolRendererResolvers[0];
  const nextRenderers = {
    renderCall() {
      return nextCall;
    },
  };
  const renderers = resolver("my_custom_tool", () => nextRenderers);
  assert.equal(renderers, nextRenderers, "non-builtin non-mcp__ tool returns next() directly");
});

test("quiet-tools resolver delegates to next() when expanded", () => {
  const harness = createExtensionHarness();
  quietToolsExtension(harness.pi);

  const nextCall = { type: "next-call", render: () => [] };
  const nextRenderers = {
    renderCall() {
      return nextCall;
    },
  };
  const result = simulateExpandedCall(harness, "bash", nextRenderers);
  assert.equal(result, nextCall, "expanded call delegates to next()");
});

test("quiet-tools /quiet-tools status is read-only and rendering stays always on", async () => {
  const harness = createExtensionHarness();
  quietToolsExtension(harness.pi);

  const { ctx, notifications } = createCommandContext();
  const command = getQuietToolsCommand(harness);
  assert.deepEqual(command.getArgumentCompletions(""), [{ value: "status", label: "status" }]);
  assert.deepEqual(command.getArgumentCompletions("sta"), [{ value: "status", label: "status" }]);
  assert.equal(command.getArgumentCompletions("on"), null, "obsolete controls are not completed");

  const before = simulateCollapsedCall(harness, "bash", { command: "echo" });
  assert.equal(before?.length, 2, "always-on quiet preview has two lines");

  await command.handler("", ctx);
  await command.handler("status", ctx);
  await command.handler("on", ctx);
  await command.handler("off", ctx);
  await command.handler("toggle", ctx);

  const after = simulateCollapsedCall(harness, "bash", { command: "echo" });
  assert.deepEqual(after, before, "obsolete command arguments cannot change rendering");
  assert.deepEqual(notifications, [
    {
      message:
        "Quiet tool previews are always on. Collapsed built-in and MCP tool rows show a one-line invocation and hide output until expanded. Model-visible tool results are unchanged.",
      level: "info",
    },
    {
      message:
        "Quiet tool previews are always on. Collapsed built-in and MCP tool rows show a one-line invocation and hide output until expanded. Model-visible tool results are unchanged.",
      level: "info",
    },
    { message: "Usage: /quiet-tools status", level: "warning" },
    { message: "Usage: /quiet-tools status", level: "warning" },
    { message: "Usage: /quiet-tools status", level: "warning" },
  ]);
});

test("quiet-tools fallback: no registerToolRenderer → registers no resolver, notifies once on session_start", async () => {
  const harness = createExtensionHarness();
  // Remove registerToolRenderer from the mock to simulate Pi <1.0.1
  delete harness.pi.registerToolRenderer;

  quietToolsExtension(harness.pi);

  assert.equal(harness.toolRendererResolvers.length, 0, "no resolver registered on fallback host");
  assert.equal(harness.tools.size, 0, "no registerTool calls on fallback host");

  const sessionStart = harness.handlers.get("session_start");
  assert.equal(typeof sessionStart, "function", "session_start handler registered");

  const notifications = [];
  const ctx = {
    cwd: repoRoot,
    ui: {
      notify(message, level) {
        notifications.push({ message, level });
      },
    },
  };

  // First session_start: notifies
  await sessionStart({}, ctx);
  assert.equal(notifications.length, 1, "notified once on first session_start");
  assert.match(notifications[0].message, /Pi >=1.0.1/, "message mentions Pi >=1.0.1 requirement");
  assert.equal(notifications[0].level, "warning", "warning level");

  // Second session_start: does NOT notify again
  await sessionStart({}, ctx);
  assert.equal(notifications.length, 1, "not notified again on subsequent session_start");
});

test("quiet-tools fallback: status remains read-only without rendering support", async () => {
  const harness = createExtensionHarness();
  delete harness.pi.registerToolRenderer;

  quietToolsExtension(harness.pi);

  const command = getQuietToolsCommand(harness);
  assert.ok(command, "command is registered even on fallback host");
  assert.deepEqual(command.getArgumentCompletions(""), [{ value: "status", label: "status" }]);

  const { ctx, notifications } = createCommandContext();
  await command.handler("", ctx);
  await command.handler("status", ctx);
  await command.handler("toggle", ctx);
  assert.equal(notifications.length, 3, "status and obsolete arguments only notify");
  assert.equal(notifications[0].level, "info");
  assert.match(notifications[0].message, /inactive/);
  assert.match(notifications[0].message, /requires Pi >=1\.0\.1/);
  assert.equal(notifications[1].level, "info");
  assert.equal(notifications[1].message, notifications[0].message);
  assert.equal(notifications[2].level, "warning");
});
