export function tmuxCommand(command) {
  return `tmux ${command.join(" \\; ")} \\;`
}

export function tmuxSessions() {
  return "tmux ls"
}

export function tmuxExecAttachSession(target) {
  return `tmux attach-session -t ${target}`
}

export function tmuxExecKillSession(target) {
  return `tmux kill-session -t ${target}`
}

export function tmuxNewSession(sessionName) {
  return `new-session -d -s ${sessionName}`
}

export function tmuxNewWindow(windowName) {
  return `new-window -n ${windowName}`
}

export function tmuxSplitWindow(startDirectory, options = {}) {
  const flags = [`-c ${startDirectory}`]

  if(options.type === "horizontal") flags.push("-h")
  if(options.type === "vertical") flags.push("-v")
  if(options.size) flags.push(`-l ${options.size}`)

  return `split-window ${flags.join(" ")}`
}

export function tmuxKillPane(target) {
  return `kill-pane -t ${target}`
}

export function tmuxSelectPane(target) {
  return `select-pane -t ${target}`
}

export function tmuxKillWindow(target) {
  return `kill-window -t ${target}`
}

export function tmuxSelectWindow(target) {
  return `select-window -t ${target}`
}

export function tmuxMoveWindow(src, dst) {
  return `move-window -s ${src} -t ${dst}`
}

export function tmuxSendKeys(keys, enter = false) {
  const command = [`send-keys '${keys}'`]

  if (enter) command.push("Enter")

  return command.join(" ")
}
