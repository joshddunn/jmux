#!/usr/bin/env node

import { Command } from "commander"
import {
  getConfig,
  start,
  startAll,
  stop,
  stopAll,
} from "./jmux"

const program = new Command()

program.description("Automate starting your tmux sessions")

program.command("start")
  .argument("<string>", "session you want to start (can pass in `all`)")
  .option("-f, --file <string>", "file path of configuration file")
  .action((env, options) => {
    const config = getConfig(options.file)

    if (!config) {
      process.exit(1)
    } else if (config[env]) {
      start(env, config[env])
    } else if (env === "all") {
      startAll(config)
    } else {
      console.log(`No such env \`${env}\` in configuration file`)
    }
  })

program.command("stop")
  .argument("<string>", "session you want to stop (can pass in `all`)")
  .option("-f, --file <string>", "file path of configuration file")
  .action((env, options) => {
    const config = getConfig(options.file)

    if (!config) {
      process.exit(1)
    } else if (config[env]) {
      stop(env)
    } else if (env === "all") {
      stopAll(config)
    } else {
      console.log(`No such env \`${env}\` in configuration file`)
    }
  })

program.parse()
