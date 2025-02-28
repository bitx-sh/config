import { BasePlugin } from "@bitx-sh/config/plugins";
import type { Schema } from "@bitx-sh/config/types";

export default class BiomePlugin extends BasePlugin {
  name = "@bitx-sh/plugin-biome";
  version = "0.0.1";

  private readonly defaultSchema: Schema = {
    type: "object",
    properties: {
      $schema: {
        type: "string",
        default: "https://biomejs.dev/schemas/1.9.4/schema.json",
      },
      organizeImports: {
        type: "object",
        properties: {
          enabled: { type: "boolean", default: true },
        },
      },
      linter: {
        type: "object",
        properties: {
          enabled: { type: "boolean", default: true },
          rules: {
            type: "object",
            properties: {
              recommended: { type: "boolean", default: true },
            },
          },
        },
      },
      formatter: {
        type: "object",
        properties: {
          enabled: { type: "boolean", default: true },
          indentStyle: {
            type: "string",
            enum: ["tab", "space"],
            default: "space",
          },
          indentWidth: { type: "number", default: 2 },
          lineWidth: { type: "number", default: 80 },
        },
      },
    },
  };

  protected async initialize(): Promise<void> {
    // Register transformers
    this.context.registerTransformer("biome", {
      async transform(config: any) {
        return {
          ...config,
          $schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
        };
      },
    });
  }

  async loadSchema(): Promise<Schema> {
    return this.defaultSchema;
  }

  async generate(schema: Schema, options: any = {}): Promise<any> {
    return {
      $schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
      organizeImports: {
        enabled: true,
      },
      linter: {
        enabled: true,
        rules: {
          recommended: true,
        },
      },
      formatter: {
        enabled: true,
        indentStyle: "space",
        indentWidth: 2,
        lineWidth: 80,
      },
      ...options,
    };
  }
}
