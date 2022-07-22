import os from "os"
import kexec from "@jcoreio/kexec"
import YAML from "yaml"
import { execSync } from 'child_process'
import { readFileSync, existsSync } from "fs"
import { undefinedFallback } from "./utils.js"
import {
  tmuxCommand,
  tmuxSessions,
  tmuxExecAttachSession,
  tmuxExecKillSession,
  tmuxNewSession,
  tmuxNewWindow,
  tmuxSplitWindow,
  tmuxKillPane,
  tmuxSelectPane,
  tmuxKillWindow,
  tmuxSelectWindow,
  tmuxMoveWindow,
  tmuxSendKeys,
} from "./tmux.js"

function tmuxExecSessions() {
  try {
    return execSync(tmuxSessions()).toString()
  } catch (_) {
    return ""
  }
}

export function getConfig(file) {
  const buffer = readFile(file)

  if (!buffer) {
    console.log("No configuration file was found")
    return null
  }

  const config = parseYAML(buffer)

  if (!config) {
    console.log("Invalid YAML in configuration file")
    return null
  }

  return config
}

export function readFile(file) {
  const filePath = file || `${os.homedir()}/.jmux.yaml`
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : null
}

export function parseYAML(buffer) {
  try {
    return YAML.parse(buffer)
  } catch (_) {
    return null
  }
}

export function start(name, config, attach = true) {
  const result = tmuxExecSessions()

  if (!result.includes(`${name}:`)) {
    kexec(buildSession(name, config))
  }

  if (attach) {
    kexec(tmuxExecAttachSession(name))
  }
}

export function startAll(config) {
  const envs = Object.keys(config)

  envs.forEach((env) => {
    start(env, config[env], false)
  })

  kexec(tmuxExecAttachSession(envs[0]))
}

export function stop(name) {
  const result = tmuxExecSessions()

  if (result.includes(`${name}:`)) {
    execSync(tmuxExecKillSession(name))
  }
}

export function stopAll(config) {
  const envs = Object.keys(config)

  envs.forEach((env) => {
    stop(env)
  })
}

export function defaultLayout(i, paneDir, panesCount, configSplitPercent) {
  const command = []

  switch (i) {
    case 0:
      command.push(tmuxSplitWindow(paneDir))
      command.push(tmuxKillPane(1))
      break
    case 1:
      const splitPercent = undefinedFallback(configSplitPercent, 35)
      command.push(tmuxSplitWindow(paneDir, { type: "horizontal", size: `${splitPercent}%` }))
      break
    default:
      const percent = panePercent(i, panesCount)
      command.push(tmuxSplitWindow(paneDir, { type: "vertical", size: `${percent}%` }))
  }

  return command
}

export function barsLayout(type, i, paneDir, panesCount) {
  const command = []

  const percent = panePercent(i, panesCount)
  command.push(tmuxSplitWindow(paneDir, { type: type, size: `${percent}%` }))

  if (i === 0) command.push(tmuxKillPane(1))

  return command
}

export function panePercent(i, panesCount) {
  return Math.ceil(100 - 100 / (panesCount - i + 1))
}

export function buildSession(name, config) {
  const command = []
  const index = config.zeroIndex ? 0 : 1

  command.push(tmuxNewSession(name))

  config.windows.forEach((windowConfig) => {
    const panesCount = windowConfig.panes.length

    command.push(tmuxNewWindow(windowConfig.name))

    windowConfig.panes.forEach((paneConfig, i) => {
      paneConfig = paneConfig || {}

      const paneDir = undefinedFallback(paneConfig.dir, windowConfig.dir, config.dir)
      const paneCommand = undefinedFallback(paneConfig.command, "")
      const panePlaceholder = undefinedFallback(paneConfig.placeholder, "")

      switch(windowConfig.layout) {
        case "rows":
          command.push(...barsLayout("vertical", i, paneDir, panesCount))
          break
        case "columns":
          command.push(...barsLayout("horizontal", i, paneDir, panesCount))
          break
        default:
          command.push(...defaultLayout(i, paneDir, panesCount, windowConfig.splitPercent))
      }

      if (paneCommand) {
        command.push(tmuxSendKeys("clear", true))
        command.push(tmuxSendKeys(paneCommand, true))
      }

      if (panePlaceholder) {
        command.push(tmuxSendKeys("clear", true))
        command.push(tmuxSendKeys(panePlaceholder))
      }
    })

    command.push(tmuxSelectPane(1))
  })

  command.push(tmuxKillWindow(1))

  config.windows.forEach((_, i) => {
    command.push(tmuxMoveWindow(i + 2, i + index))
  })

  const selectWindowIndex = undefinedFallback(config.selectWindow, index)

  command.push(tmuxSelectWindow(selectWindowIndex))

  return tmuxCommand(command)
}
