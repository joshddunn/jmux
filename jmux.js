// https://man7.org/linux/man-pages/man1/tmux.1.html

import kexec from "@jcoreio/kexec";
import { exec } from 'child_process'
import config from "./jmux.json" assert { type: "json" }
import { newSession } from "./lib/jmux.js"

const args = process.argv.slice(2)

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
    start(args[1], config[args[1]])
    break
  case "stop":
    stop(args[1])
    break
  default:
    console.log(`No such command \`${args[0]}\``)
}
