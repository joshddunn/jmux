#!/usr/bin/env node

import { Command } from "commander";
import { start, stop } from "./base";
import { getConfig } from "./config";
import * as tmux from "./tmux";

const program = new Command();

program.description("Automate starting your tmux sessions");

program
  .command("ls")
  .description("list configured sessions")
  .option("-f, --file <string>", "configuration file path")
  .option("-e, --eval", "output valid command for shell eval")
  .action((options) => {
    const config = getConfig(options.file);

    if (!config) {
      process.exit(1);
    } else {
      const sessions = config.map((x) => x.name).join("\n");
      console.log(options.eval ? `echo "${sessions}"` : sessions);
    }
  });

program
  .command("start")
  .description("start configured session")
  .argument("<string>", "session name")
  .option("-f, --file <string>", "configuration file path")
  .option("-e, --eval", "output valid command for shell eval")
  .action((sessionName, options) => {
    const config = getConfig(options.file);
    const configForSession = config.find((x) => x.name === sessionName);

    if (!config) {
      process.exit(1);
    } else if (configForSession) {
      console.log(tmux.buildCommand(start(configForSession)));
    } else {
      console.error(`Configuration for \`${sessionName}\` not found`);
      process.exit(1);
    }
  });

program
  .command("stop")
  .description("stop configured session")
  .argument("<string>", "session name")
  .option("-f, --file <string>", "configuration file path")
  .option("-e, --eval", "output valid command for shell eval")
  .action((sessionName, options) => {
    const config = getConfig(options.file);
    const configForSession = config.find((x) => x.name === sessionName);

    if (!config) {
      process.exit(1);
    } else if (configForSession) {
      console.log(tmux.buildCommand([stop(configForSession.name)]));
    } else {
      console.error(`Configuration for \`${sessionName}\` not found`);
      process.exit(1);
    }
  });

program.parse();
