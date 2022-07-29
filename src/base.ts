import os from "os"
import kexec from "@jcoreio/kexec"
import YAML from "yaml"
import { execSync } from 'child_process'
import { readFileSync, existsSync } from "fs"
import { undefinedFallback } from "./utils"
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
} from "./tmux"

interface Config {
  windows: WindowConfig[];
  dir?: string;
  selectWindow?: number;
  zeroIndex?: boolean;
}

interface WindowConfig {
  name: string;
  dir?: string;
  layout?: string;
  panes?: PaneConfig[];
  splitPercent?: number;
}

interface PaneConfig {
  command?: string;
  dir?: string;
  placeholder?: string;
}

function tmuxExecSessions() {
  try {
    return execSync(tmuxSessions()).toString()
  } catch (_) {
    return ""
  }
}

// figure out return type
export function getConfig(file: string) {
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

// figure out return type
export function readFile(file: string) {
  const filePath = file || `${os.homedir()}/.jmux.yaml`
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : null
}

// figure out return type
export function parseYAML(buffer: string) {
  try {
    return YAML.parse(buffer)
  } catch (_) {
    return null
  }
}

export function start(name: string, config: Config, attach: boolean = true): void {
  const result = tmuxExecSessions()

  if (!result.includes(`${name}:`)) {
    kexec(buildSession(name, config))
  }

  if (attach) {
    kexec(tmuxExecAttachSession(name))
  }
}

export function startAll(config: { [key: string]: Config }): void {
  const envs = Object.keys(config)

  envs.forEach((env) => {
    start(env, config[env], false)
  })

  kexec(tmuxExecAttachSession(envs[0]))
}

export function stop(name: string): void {
  const result = tmuxExecSessions()

  if (result.includes(`${name}:`)) {
    execSync(tmuxExecKillSession(name))
  }
}

export function stopAll(config: string): void {
  const envs = Object.keys(config)

  envs.forEach((env) => {
    stop(env)
  })
}

export function defaultLayout(i: number, paneDir: string, panesCount: number, configSplitPercent: number = 35): string[] {
  const command = []

  switch (i) {
    case 0:
      command.push(tmuxSplitWindow(paneDir))
      command.push(tmuxKillPane(1))
      break
    case 1:
      const splitPercent = undefinedFallback(configSplitPercent)
      command.push(tmuxSplitWindow(paneDir, { type: "horizontal", percent: splitPercent }))
      break
    default:
      const percent = panePercent(i, panesCount)
      command.push(tmuxSplitWindow(paneDir, { type: "vertical", percent: percent }))
  }

  return command
}

export function barsLayout(type: string, i: number, paneDir: string, panesCount: number): string[] {
  const command = []

  const percent = panePercent(i, panesCount)
  command.push(tmuxSplitWindow(paneDir, { type: type, percent: percent }))

  if (i === 0) command.push(tmuxKillPane(1))

  return command
}

export function panePercent(i: number, panesCount: number): number {
  return Math.ceil(100 - 100 / (panesCount - i + 1))
}

export function buildSession(name: string, config: Config): string {
  const command = []
  const index = config.zeroIndex ? 0 : 1

  command.push(tmuxNewSession(name))

  config.windows.forEach((windowConfig) => {
    const panes = windowConfig.panes || []
    const panesCount = panes.length

    command.push(tmuxNewWindow(windowConfig.name))

    panes.forEach((paneConfig, i) => {
      paneConfig = paneConfig || {}

      const paneDir = undefinedFallback(paneConfig.dir, windowConfig.dir, config.dir, os.homedir())
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
        command.push(tmuxSendKeys(panePlaceholder, false))
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
