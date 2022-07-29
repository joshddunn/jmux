interface SplitWindowOptions {
  type?: string;
  percent?: number;
}

export function tmuxCommand(command: string[]): string {
  return `tmux ${command.join(" \\; ")} \\;`
}

export function tmuxSessions(): string {
  return "tmux ls"
}

export function tmuxExecAttachSession(target: string): string {
  return `tmux attach-session -t ${target}`
}

export function tmuxExecKillSession(target: string): string {
  return `tmux kill-session -t ${target}`
}

export function tmuxNewSession(sessionName: string): string {
  return `new-session -s ${sessionName}`
}

export function tmuxNewWindow(windowName: string): string {
  return `new-window -n ${windowName}`
}

export function tmuxSplitWindow(startDirectory: string, { type = "vertical", percent = 0 }: SplitWindowOptions = {}): string {
  const flags = [`-c ${startDirectory}`]

  if(type === "horizontal") flags.push("-h")
  if(type === "vertical") flags.push("-v")
  if(percent) flags.push(`-l ${percent}%`)

  return `split-window ${flags.join(" ")}`
}

export function tmuxKillPane(target: number): string {
  return `kill-pane -t ${target}`
}

export function tmuxSelectPane(target: number): string {
  return `select-pane -t ${target}`
}

export function tmuxKillWindow(target: number): string {
  return `kill-window -t ${target}`
}

export function tmuxSelectWindow(target: number): string {
  return `select-window -t ${target}`
}

export function tmuxMoveWindow(src: number, dst: number): string {
  return `move-window -s ${src} -t ${dst}`
}

export function tmuxSendKeys(keys: string, enter: boolean): string {
  const command = [`send-keys '${keys}'`]

  if (enter) command.push("Enter")

  return command.join(" ")
}
