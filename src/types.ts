export interface Config {
  windows: WindowConfig[];
  dir?: string;
  selectWindow?: number;
  zeroIndex?: boolean;
}

interface WindowConfig {
  name: string;
  dir?: string;
  layout?: WindowLayout;
  panes?: PaneConfig[];
  splitPercent?: number;
}

interface PaneConfig {
  command?: string;
  dir?: string;
  placeholder?: string;
}

export interface SplitWindowOptions {
  split?: Split;
  percent?: number;
}

export enum WindowLayout {
  ROWS = "rows",
  COLUMNS = "columns",
}

export enum Split {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}
