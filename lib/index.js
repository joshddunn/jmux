#!/usr/bin/env node

import os from "os"
import YAML from "yaml"

import { start, startAll, stop, newSession } from "./jmux.js"
import { readFileSync } from "fs"
import { Command } from "commander"

const program = new Command()

program.description("Automate starting your tmux sessions")

program.command("start")
  .argument("<string>", "environment as defined in configuration file")
  .option("-f, --file <string>", "file path of configuration file")
  .action((env, options) => {
    const filePath = options.file || `${os.homedir()}/.jmux.yml`
    const config = YAML.parse(readFileSync(filePath, 'utf8'))

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
    stop(env)
  })

program.parse()
