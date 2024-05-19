import { ExecSyncOptions } from "child_process";
import * as tmux from "../tmux";
import { Split } from "../types";
import { randomInteger, randomString } from "./testHelper";

let execSyncArgs: { command: string; options: ExecSyncOptions }[] = [];
let execSyncError: boolean = false;
jest.mock("child_process", () => ({
  __esModule: true,
  execSync: jest.fn((command: string, options: ExecSyncOptions) => {
    execSyncArgs.push({ command, options });
    if (execSyncError) {
      throw "error";
    }
  }),
}));

describe("tmux", () => {
  beforeEach(() => {
    execSyncArgs = [];
    execSyncError = false;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("buildCommand: has defined argumebnts => returns tmux command", () => {
    expect(tmux.buildCommand(["1", "2", "3"])).toBe("tmux 1 \\; 2 \\; 3 \\;");
  });

  it("buildCommand: has some defined arguments => returns tmux command without undefined commands", () => {
    expect(tmux.buildCommand(["1", undefined])).toBe("tmux 1 \\;");
  });

  it("buildCommand: has no defined arguments => returns empty tmux command", () => {
    expect(tmux.buildCommand([undefined])).toBe("tmux  \\;");
  });

  it("buildCommand: has no arguments => returns empty tmux command", () => {
    expect(tmux.buildCommand([])).toBe("tmux  \\;");
  });

  it("sessions: => returns expected value", () => {
    expect(tmux.sessions()).toBe("ls");
  });

  it("getCurrentSessions: => returns expected value", () => {
    tmux.getCurrentSessions();

    expect(execSyncArgs).toHaveLength(1);
    expect(execSyncArgs[0]).toEqual({
      command: "tmux ls \\;",
      options: { stdio: "pipe" },
    });
  });

  it("getCurrentSessions: error => returns expected value", () => {
    execSyncError = true;

    const result = tmux.getCurrentSessions();
    expect(result).toBe("");

    expect(execSyncArgs).toHaveLength(1);
    expect(execSyncArgs[0]).toEqual({
      command: "tmux ls \\;",
      options: { stdio: "pipe" },
    });
  });

  it("newSession: => returns expected value", () => {
    const name = randomString();
    expect(tmux.newSession(name)).toBe(`new-session -s ${name}`);
  });

  it("attachSession: => returns expected value", () => {
    const name = randomString();
    expect(tmux.attachSession(name)).toBe(`attach-session -t ${name}`);
  });

  it("killSession: => returns expected value", () => {
    const name = randomString();
    expect(tmux.killSession(name)).toBe(`kill-session -t ${name}`);
  });

  it("newWindow: => returns expected value", () => {
    const name = randomString();
    expect(tmux.newWindow(name)).toBe(`new-window -n ${name}`);
  });

  it("splitWindow: default options => vertical split - no percent", () => {
    const dir = randomString();
    expect(tmux.splitWindow(dir)).toBe(`split-window -c ${dir} -v`);
  });

  it("splitWindow: vertical split => vertical split - no percent", () => {
    const dir = randomString();
    expect(tmux.splitWindow(dir, { split: Split.VERTICAL })).toBe(
      `split-window -c ${dir} -v`
    );
  });

  it("splitWindow: vertical split => vertical split - percent", () => {
    const dir = randomString();
    const percent = randomInteger(100);
    expect(tmux.splitWindow(dir, { split: Split.VERTICAL, percent })).toBe(
      `split-window -c ${dir} -v -l ${percent}%`
    );
  });

  it("splitWindow: horizontal split => horizontal split - no percent", () => {
    const dir = randomString();
    expect(tmux.splitWindow(dir, { split: Split.HORIZONTAL })).toBe(
      `split-window -c ${dir} -h`
    );
  });

  it("splitWindow: horizontal split => horizontal split - percent", () => {
    const dir = randomString();
    const percent = randomInteger(100);
    expect(tmux.splitWindow(dir, { split: Split.HORIZONTAL, percent })).toBe(
      `split-window -c ${dir} -h -l ${percent}%`
    );
  });

  it("killPane: => returns expected value", () => {
    const pane = randomInteger();
    expect(tmux.killPane(pane)).toBe(`kill-pane -t ${pane}`);
  });

  it("selectPane: => returns expected value", () => {
    const pane = randomInteger();
    expect(tmux.selectPane(pane)).toBe(`select-pane -t ${pane}`);
  });

  it("killWindow: => returns expected value", () => {
    const pane = randomInteger();
    expect(tmux.killWindow(pane)).toBe(`kill-window -t ${pane}`);
  });

  it("selectWindow: => returns expected value", () => {
    const pane = randomInteger();
    expect(tmux.selectWindow(pane)).toBe(`select-window -t ${pane}`);
  });

  it("moveWindow: => returns expected value", () => {
    const pane1 = randomInteger();
    const pane2 = randomInteger();
    expect(tmux.moveWindow(pane1, pane2)).toBe(
      `move-window -s ${pane1} -t ${pane2}`
    );
  });

  it("sendKeys: with enter flag => return expected command", () => {
    const command = randomString();
    expect(tmux.sendKeys(command, true)).toBe(`send-keys '${command}' Enter`);
  });

  it("sendKeys: without enter flag => return expected command", () => {
    const command = randomString();
    expect(tmux.sendKeys(command, false)).toBe(`send-keys '${command}'`);
  });
});
