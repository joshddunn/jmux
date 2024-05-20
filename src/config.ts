import { existsSync, readFileSync } from "fs";
import Joi from "joi";
import os from "os";
import YAML from "yaml";
import { Config, WindowLayout } from "./types";

export const getConfig = (file: string): Config[] => {
  const buffer = readConfigFile(file);
  if (!buffer) {
    console.error("No configuration file was found");
    process.exit(1);
  }

  const config = parseYAML(buffer);
  if (!config) {
    console.error("Invalid YAML in configuration file");
    process.exit(1);
  }

  const { error, value } = configSchema.validate(
    Object.keys(config).map((name) => ({ ...config[name], name }))
  );

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  return value;
};

const readConfigFile = (file: string): string | null => {
  const filePath = file || `${os.homedir()}/.jmux.yaml`;
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : null;
};

const parseYAML = (
  buffer: string
): Record<string, Omit<Config, "name">> | null => {
  try {
    return YAML.parse(buffer);
  } catch (_error) {
    return null;
  }
};

const configSchema = Joi.array()
  .unique("name")
  .items(
    Joi.object({
      name: Joi.string().required(),
      windows: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          dir: Joi.string(),
          layout: Joi.array().valid(...Object.values(WindowLayout)),
          panes: Joi.array().items(
            Joi.object({
              command: Joi.string(),
              dir: Joi.string(),
              placeholder: Joi.string(),
            }).allow(null)
          ),
          splitPercent: Joi.number().min(1).max(99),
        })
      ),
      dir: Joi.string(),
      selectWindow: Joi.number(),
      zeroIndex: Joi.boolean(),
    })
  );
