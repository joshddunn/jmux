#!/usr/bin/env node

import { Command } from "commander"
import {
  configFile,
  start,
  startAll,
  stop,
  stopAll,
} from "./jmux.js"

const program = new Command()

program.description("Automate starting your tmux sessions")

program.command("start")
  .argument("<string>", "environment as defined in configuration file")
  .option("-f, --file <string>", "file path of configuration file")
  .action((env, options) => {
    const config = configFile(options.file)

    if (config[env]) {
      start(env, config[env])
    } else if (env === "all") {
      startAll(config)
    } else {
      console.log(`No such env \`${env}\` in \`${filePath}\``)
    }
  })

program.command("stop")
  .argument("<string>", "environment as defined in configuration file")
  .option("-f, --file <string>", "file path of configuration file")
  .action((env, options) => {
    const config = configFile(options.file)

    if (config[env]) {
      stop(env)
    } else if (env === "all") {
      stopAll(config)
    } else {
      console.log(`No such env \`${env}\` in \`${filePath}\``)
    }
  })

program.parse()
