// packages/core/src/cli.ts
import { defineCommand } from "citty";
import { consola } from "consola";
import { version } from "../package.json";
import { loadConfig } from "./config";
import { BitXCore } from "./core";

export default defineCommand({
  meta: {
    name: "bitx-config",
    version,
    description: "Universal configuration loader and manager",
  },
  subcommands: {
    init: () => import("./commands/init"),
    get: () => import("./commands/get"),
    set: () => import("./commands/set"),
    list: () => import("./commands/list"),
    import: () => import("./commands/import"),
    export: () => import("./commands/export"),
  },
});

// Initialize core instance
const core = new BitXCore();

// Command implementations
export const commands = {
  init: defineCommand({
    meta: {
      name: "init",
      description: "Initialize a new configuration",
    },
    args: {
      type: {
        type: "positional",
        description: "Configuration type (biome, vite, github, renovate)",
        required: true,
      },
      output: {
        type: "option",
        description: "Output file path",
        alias: "o",
      },
    },
    async run({ args }) {
      try {
        const { type, output } = args;
        consola.start(`Initializing ${type} configuration...`);

        // Load schema for the specified type
        const schema = await core.schema.load(type);

        // Generate configuration
        const config = await core.generate(schema);

        // Save configuration
        if (output) {
          await core.save(config, output);
          consola.success(`Configuration saved to ${output}`);
        } else {
          console.log(JSON.stringify(config, null, 2));
        }
      } catch (error) {
        consola.error("Failed to initialize configuration:", error);
        process.exit(1);
      }
    },
  }),
};
