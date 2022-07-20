#!/usr/bin/env node

import kexec from "@jcoreio/kexec"
import os from "os"

import { exec } from 'child_process'
import { newSession } from "./jmux.js"
import { readFileSync } from "fs"
import { Command } from "commander"

function start(name, config) {
  exec("tmux ls", (err, stdout, stderr) => {
    if (stdout.includes(`${name}:`)) {
      kexec(`tmux attach-session -t ${name}`)
    } else {
      kexec(newSession(name, config))
    }
  })
}

function stop(name) {
  kexec(`tmux kill-session -t ${name}`)
}

const program = new Command()

program.description("Automate starting your tmux sessions")

program.command("start")
  .argument("<string>", "environment as defined in configuration file")
  .option("-f, --file <string>", "file path of configuration file")
  .action((env, options) => {
    const filePath = options.file || `${os.homedir()}/.jmux.json`
    const config = JSON.parse(readFileSync(filePath))

    if (config[env]) {
      start(env, config[env])
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
