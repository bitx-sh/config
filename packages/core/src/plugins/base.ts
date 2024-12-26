import type { Plugin, PluginContext, Schema } from "../types";

export abstract class BasePlugin implements Plugin {
  abstract name: string;
  abstract version: string;

  protected context!: PluginContext;

  async setup(context: PluginContext): Promise<void> {
    this.context = context;
    await this.initialize();
  }

  protected abstract initialize(): Promise<void>;

  abstract loadSchema(): Promise<Schema>;
  abstract generate(schema: Schema, options?: any): Promise<any>;
}
