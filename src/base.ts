import os from "os";
import * as tmux from "./tmux";
import { Config, Split, WindowLayout } from "./types";

export const start = (config: Config): string[] => {
  const result = tmux.getCurrentSessions();

  if (!result.includes(`${config.name}:`)) {
    return buildSession(config);
  }

  return [tmux.attachSession(config.name)];
};

export const stop = (name: string): string | undefined => {
  const result = tmux.getCurrentSessions();

  if (result.includes(`${name}:`)) {
    return tmux.killSession(name);
  }
};

const buildDefaultLayout = (data: {
  index: number;
  paneDir: string;
  panesCount: number;
  splitPercent?: number;
}): string[] => {
  const command: string[] = [];
  const { index, paneDir, panesCount, splitPercent } = data;

  switch (index) {
    case 0:
      command.push(tmux.splitWindow(paneDir));
      command.push(tmux.killPane(1));
      break;
    case 1:
      command.push(
        tmux.splitWindow(paneDir, {
          split: Split.HORIZONTAL,
          percent: splitPercent ?? 35,
        })
      );
      break;
    default:
      const percent = panePercent(index, panesCount);
      command.push(
        tmux.splitWindow(paneDir, {
          split: Split.VERTICAL,
          percent: percent,
        })
      );
  }

  return command;
};

const buildBarsLayout = (data: {
  split: Split;
  index: number;
  paneDir: string;
  panesCount: number;
}): string[] => {
  const command: string[] = [];
  const { split, index, paneDir, panesCount } = data;

  const percent = panePercent(index, panesCount);
  command.push(tmux.splitWindow(paneDir, { split, percent }));

  if (index === 0) command.push(tmux.killPane(1));

  return command;
};

const panePercent = (index: number, panesCount: number): number => {
  return Math.ceil(100 - 100 / (panesCount - index + 1));
};

const buildSession = (config: Config): string[] => {
  const baseIndex: number = config.zeroIndex ? 0 : 1;
  const command: string[] = [];

  command.push(tmux.newSession(config.name));

  config.windows.forEach((windowConfig) => {
    const panes = windowConfig.panes || [];
    const panesCount = panes.length;

    command.push(tmux.newWindow(windowConfig.name));

    panes.forEach((paneConfig, index) => {
      paneConfig = paneConfig ?? {};
      const paneDir =
        paneConfig.dir ?? windowConfig.dir ?? config.dir ?? os.homedir();
      const paneCommand = paneConfig.command ?? "";
      const panePlaceholder = paneConfig.placeholder ?? "";

      switch (windowConfig.layout) {
        case WindowLayout.ROWS:
          command.push(
            ...buildBarsLayout({
              split: Split.VERTICAL,
              index,
              paneDir,
              panesCount,
            })
          );
          break;
        case WindowLayout.COLUMNS:
          command.push(
            ...buildBarsLayout({
              split: Split.HORIZONTAL,
              index,
              paneDir,
              panesCount,
            })
          );
          break;
        default:
          command.push(
            ...buildDefaultLayout({
              index,
              paneDir,
              panesCount,
              splitPercent: windowConfig.splitPercent,
            })
          );
      }

      if (paneCommand) {
        command.push(tmux.sendKeys("clear", true));
        command.push(tmux.sendKeys(paneCommand, true));
      }

      if (panePlaceholder) {
        command.push(tmux.sendKeys("clear", true));
        command.push(tmux.sendKeys(panePlaceholder, false));
      }
    });

    command.push(tmux.selectPane(1));
  });

  command.push(tmux.killWindow(1));

  config.windows.forEach((_, i) => {
    command.push(tmux.moveWindow(i + 2, i + baseIndex));
  });

  const selectWindowIndex = config.selectWindow ?? baseIndex;

  command.push(tmux.selectWindow(selectWindowIndex));

  return command;
};
