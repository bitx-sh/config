import { defineCommand } from "citty";
import { consola } from "consola";
import { BitXCore } from "../core";

export const createCommands = (core: BitXCore) => ({
  init: defineCommand({
    meta: {
      name: "init",
      description: "Initialize a new configuration",
    },
    args: {
      type: {
        type: "positional",
        description: "Configuration type",
        required: true,
      },
      output: {
        type: "option",
        alias: "o",
        description: "Output file path",
      },
      format: {
        type: "option",
        alias: "f",
        description: "Output format (ts, js, json, yaml)",
        default: "ts",
      },
    },
    async run({ args }) {
      const { type, output, format } = args;

      consola.start(`Initializing ${type} configuration...`);

      try {
        const config = await core.init({ type, format });

        if (output) {
          await core.config.save(output);
          consola.success(`Configuration saved to ${output}`);
        } else {
          console.log(await core.config.serialize());
        }
      } catch (error) {
        consola.error("Failed to initialize configuration:", error);
        process.exit(1);
      }
    },
  }),

  get: defineCommand({
    meta: {
      name: "get",
      description: "Get configuration value",
    },
    args: {
      key: {
        type: "positional",
        description: "Configuration key",
        required: true,
      },
    },
    async run({ args }) {
      const value = core.config.get(args.key);
      console.log(JSON.stringify(value, null, 2));
    },
  }),

  set: defineCommand({
    meta: {
      name: "set",
      description: "Set configuration value",
    },
    args: {
      key: {
        type: "positional",
        description: "Configuration key",
        required: true,
      },
      value: {
        type: "positional",
        description: "Configuration value",
        required: true,
      },
    },
    async run({ args }) {
      core.config.set(args.key, JSON.parse(args.value));
      await core.config.save();
      consola.success(`Set ${args.key} = ${args.value}`);
    },
  }),
});
