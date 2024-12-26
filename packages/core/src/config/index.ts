import { createUnconfig } from "unconfig";
import { z } from "zod";
import { defu } from "defu";
import type { ConfigSystem, ConfigSource, Config } from "../types";

export const configSchema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),
  plugins: z
    .record(
      z.object({
        enabled: z.boolean().optional(),
        options: z.record(z.unknown()).optional(),
      }),
    )
    .optional(),
  schema: z
    .object({
      validation: z.boolean().optional(),
      coerce: z.boolean().optional(),
      source: z.string().optional(),
    })
    .optional(),
  output: z
    .object({
      format: z.enum(["ts", "js", "json", "yaml"]).optional(),
      path: z.string().optional(),
    })
    .optional(),
});

export class ConfigManager implements ConfigSystem {
  private config: Config = {};
  private sources: ConfigSource[] = [];

  constructor() {
    this.setupDefaultSources();
  }

  private setupDefaultSources() {
    // Add default configuration sources
    this.sources = [
      { type: "env", prefix: "BITX_" },
      { type: "args", prefix: "--" },
      { type: "file", patterns: ["bitx.config.*"] },
    ];
  }

  async load(sources?: ConfigSource[]): Promise<Config> {
    const unconfig = createUnconfig({
      sources: [...this.sources, ...(sources || [])].map((source) => ({
        files: source.patterns,
        default: source.defaults,
      })),
    });

    const { config } = await unconfig.load();

    // Validate configuration
    const result = configSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Invalid configuration: ${result.error}`);
    }

    // Merge with defaults
    this.config = defu(config, this.getDefaults());

    return this.config;
  }

  private getDefaults(): Config {
    return {
      schema: {
        validation: true,
        coerce: true,
      },
      output: {
        format: "ts",
      },
    };
  }

  get<T>(key: string): T | undefined {
    return get(this.config, key);
  }

  set<T>(key: string, value: T): void {
    set(this.config, key, value);
  }

  merge(config: Partial<Config>): void {
    this.config = defu(config, this.config);
  }

  async save(path?: string): Promise<void> {
    const configStr = this.serialize();
    if (path) {
      await Bun.write(path, configStr);
    }
    return configStr;
  }

  private serialize(): string {
    const format = this.config.output?.format || "ts";
    switch (format) {
      case "ts":
        return `import type { BitXConfig } from '@bitx-sh/config'

export default {
  ${JSON.stringify(this.config, null, 2)}
} satisfies BitXConfig`;
      case "js":
        return `module.exports = ${JSON.stringify(this.config, null, 2)}`;
      case "json":
        return JSON.stringify(this.config, null, 2);
      case "yaml":
        return YAML.stringify(this.config);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}
