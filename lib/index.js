#!/usr/bin/env node

import kexec from "@jcoreio/kexec"
import os from "os"

import { exec } from 'child_process'
import { newSession } from "./jmux.js"
import { readFileSync } from "fs"

const args = process.argv.slice(2)
const filePath = process.env.JMUX_FILE_PATH || `${os.homedir()}/.jmux.json`
const config = JSON.parse(readFileSync(filePath))

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
  kexec(`tmux kill-session -t ${args[1]}`)
}

switch(args[0]) {
  case "start":
    if (config[args[1]]) {
      start(args[1], config[args[1]])
    } else {
      console.log(`No such env \`${args[0]}\` in \`${filePath}\``)
    }
    break
  case "stop":
    stop(args[1])
    break
  default:
    console.log(`No such command \`${args[0]}\``)
}