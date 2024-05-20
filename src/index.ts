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
  .action((sessionName, options) => {
    const config = getConfig(options.file);
    const configForSession = config.find((x) => x.name === sessionName);

    if (!config) {
      process.exit(1);
    } else if (configForSession) {
      console.log(tmux.buildCommand(start(configForSession)));
    } else {
      console.error(
        `Config for \`${sessionName}\` is missing in configuration file`
      );
      process.exit(1);
    }
  });

program
  .command("stop")
  .argument("<string>", "session you want to stop")
  .option("-f, --file <string>", "file path of configuration file")
  .action((sessionName, options) => {
    const config = getConfig(options.file);
    const configForSession = config.find((x) => x.name === sessionName);

    if (!config) {
      process.exit(1);
    } else if (configForSession) {
      console.log(tmux.buildCommand([stop(configForSession.name)]));
    } else {
      console.error(
        `Config for \`${sessionName}\` is missing in configuration file`
      );
      process.exit(1);
    }
  });

program.parse();
