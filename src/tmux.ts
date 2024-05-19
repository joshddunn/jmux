import { execSync } from "child_process";
import { Split, SplitWindowOptions } from "./types";

export const buildCommand = (command: (string | undefined)[]): string => {
  const cmd = command.filter((x) => !!x).join(" \\; ");
  return `tmux ${cmd} \\;`;
};

export const sessions = (): string => {
  return "ls";
};

export const getCurrentSessions = (): string => {
  try {
    return execSync(buildCommand([sessions()]), {
      stdio: "pipe",
    }).toString();
  } catch (_error) {
    return "";
  }
};

export const attachSession = (target: string): string => {
  return `attach-session -t ${target}`;
};

export const killSession = (target: string): string => {
  return `kill-session -t ${target}`;
};

export const newSession = (sessionName: string): string => {
  return `new-session -s ${sessionName}`;
};

export const newWindow = (windowName: string): string => {
  return `new-window -n ${windowName}`;
};

export const splitWindow = (
  startDirectory: string,
  { split = Split.VERTICAL, percent = 0 }: SplitWindowOptions = {}
): string => {
  const flags = [`-c ${startDirectory}`];

  if (split === Split.HORIZONTAL) flags.push("-h");
  if (split === Split.VERTICAL) flags.push("-v");
  if (percent) flags.push(`-l ${percent}%`);

  return `split-window ${flags.join(" ")}`;
};

export const killPane = (target: number): string => {
  return `kill-pane -t ${target}`;
};

export const selectPane = (target: number): string => {
  return `select-pane -t ${target}`;
};

export const killWindow = (target: number): string => {
  return `kill-window -t ${target}`;
};

export const selectWindow = (target: number): string => {
  return `select-window -t ${target}`;
};

export const moveWindow = (src: number, dst: number): string => {
  return `move-window -s ${src} -t ${dst}`;
};

export const sendKeys = (keys: string, enter: boolean): string => {
  const command = [`send-keys '${keys}'`];

  if (enter) command.push("Enter");

  return command.join(" ");
};
