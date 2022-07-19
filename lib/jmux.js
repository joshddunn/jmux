export function newSession(name, config) {

  const command = []
  const index = config.zeroIndex ? 0 : 1

  command.push(`new-session -A -s ${name}`)

  config.windows.forEach((windowConfig) => {

    const windowDir = (typeof windowConfig.dir === "undefined") ? config.dir : windowConfig.dir
    const panesCount = windowConfig.panes.length

    command.push(`new-window -n ${windowConfig.name}`)

    windowConfig.panes.forEach((paneConfig, i) => {
      const paneDir = (typeof paneConfig.dir === "undefined") ? windowDir : paneConfig.dir
      const paneCommand = (typeof paneConfig.command === "undefined") ? "" : `${paneConfig.command}`
      const panePlaceholder = (typeof paneConfig.placeholder === "undefined") ? "" : `${paneConfig.placeholder}`

      switch (i) {
        case 0:
          command.push(`split-window -c ${paneDir}`)
          command.push("kill-pane -t 1")
          break;
        case 1:
          const splitPercent = (typeof windowConfig.splitPercent == "undefined") ? 35 : windowConfig.splitPercent
          command.push(`split-window -h -l ${splitPercent}% -c ${paneDir}`)
          break;
        default:
          const percent = Math.ceil(100 - 100 / (panesCount - i + 1))
          command.push(`split-window -v -l ${percent}% -c ${paneDir}`)
      }

      if (paneCommand) {
        command.push(`send-keys 'clear' Enter`)
        command.push(`send-keys '${paneCommand}' Enter`)
      }

      if (panePlaceholder) {
        command.push(`send-keys 'clear' Enter`)
        command.push(`send-keys '${panePlaceholder}'`)
      }
    })

    command.push("select-pane -t 1")
  })

  command.push("kill-window -t 1")

  config.windows.forEach((_, i) => {
    command.push(`move-window -s ${i + 2} -t ${i + index}`)
  })

  command.push(`select-window -t ${index}`)

  return `tmux ${command.join(" \\; ")} \\;`
}
