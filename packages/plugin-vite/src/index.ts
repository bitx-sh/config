import { BasePlugin } from "@bitx-sh/config/plugins";
import type { Schema } from "@bitx-sh/config/types";

export default class VitePlugin extends BasePlugin {
  name = "@bitx-sh/plugin-vite";
  version = "0.0.1";

  private readonly defaultSchema: Schema = {
    type: "object",
    properties: {
      build: {
        type: "object",
        properties: {
          target: { type: "string", default: "esnext" },
          outDir: { type: "string", default: "dist" },
          minify: {
            type: "string",
            enum: ["esbuild", "terser", false],
            default: "esbuild",
          },
        },
      },
      server: {
        type: "object",
        properties: {
          port: { type: "number", default: 3000 },
          host: { type: "string", default: "localhost" },
        },
      },
      plugins: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
  };

  protected async initialize(): Promise<void> {
    // Register transformers
    this.context.registerTransformer("vite", {
      async transform(config: any) {
        return {
          ...config,
          plugins: Array.isArray(config.plugins) ? config.plugins : [],
        };
      },
    });
  }

  async loadSchema(): Promise<Schema> {
    return this.defaultSchema;
  }

  async generate(schema: Schema, options: any = {}): Promise<any> {
    return {
      build: {
        target: "esnext",
        outDir: "dist",
        minify: "esbuild",
      },
      server: {
        port: 3000,
        host: "localhost",
      },
      plugins: [],
      ...options,
    };
  }
}
