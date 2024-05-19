import { existsSync, readFileSync } from "fs";
import os from "os";
import YAML from "yaml";
import { Config } from "./types";

export const getConfig = (file: string): Record<string, Config> | null => {
  const buffer = readConfigFile(file);
  if (!buffer) {
    console.error("No configuration file was found");
    return null;
  }

  const config = parseYAML(buffer);
  // TODO: add file validations here
  if (!config) {
    console.error("Invalid YAML in configuration file");
    return null;
  }

  return config;
};

const readConfigFile = (file: string): string | null => {
  const filePath = file || `${os.homedir()}/.jmux.yaml`;
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : null;
};

const parseYAML = (buffer: string): Record<string, Config> | null => {
  try {
    return YAML.parse(buffer);
  } catch (_error) {
    return null;
  }
};
