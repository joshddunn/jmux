#!/usr/bin/env node

import { Command } from "commander";
import { start, stop } from "./base";
import { getConfig } from "./config";
import * as tmux from "./tmux";

const program = new Command();

program.description("Automate starting your tmux sessions");

program
  .command("start")
  .argument("<string>", "session you want to start")
  .option("-f, --file <string>", "file path of configuration file")
  .action((env, options) => {
    const config = getConfig(options.file);

    if (!config) {
      process.exit(1);
    } else if (config[env]) {
      console.log(tmux.buildCommand(start(env, config[env])));
    } else {
      console.error(`No such env \`${env}\` in configuration file`);
      process.exit(1);
    }
  });

program
  .command("stop")
  .argument("<string>", "session you want to stop")
  .option("-f, --file <string>", "file path of configuration file")
  .action((env, options) => {
    const config = getConfig(options.file);

    if (!config) {
      process.exit(1);
    } else if (config[env]) {
      console.log(tmux.buildCommand([stop(env)]));
    } else {
      console.error(`No such env \`${env}\` in configuration file`);
      process.exit(1);
    }
  });

program.parse();
