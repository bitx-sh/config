import { Project, SourceFile } from "ts-morph";
import type { Schema, TypeGenerationOptions } from "../types";

export class TypeGenerator {
  private project: Project;

  constructor() {
    this.project = new Project({
      useInMemoryFileSystem: true,
      skipFileDependencyResolution: true,
    });
  }

  async generateTypes(
    schema: Schema,
    options: TypeGenerationOptions = {},
  ): Promise<string> {
    const sourceFile = this.project.createSourceFile("types.ts", "", {
      overwrite: true,
    });

    // Add imports
    this.addImports(sourceFile, options);

    // Generate types from schema
    this.generateTypeDeclarations(sourceFile, schema);

    // Add exports
    this.addExports(sourceFile, schema);

    // Format the source code
    return sourceFile.getFullText();
  }

  private addImports(
    sourceFile: SourceFile,
    options: TypeGenerationOptions,
  ): void {
    if (options.imports) {
      for (const imp of options.imports) {
        sourceFile.addImportDeclaration(imp);
      }
    }
  }

  private generateTypeDeclarations(
    sourceFile: SourceFile,
    schema: Schema,
  ): void {
    // Generate main config interface
    sourceFile.addInterface({
      name: "BitXConfig",
      isExported: true,
      properties: this.generateProperties(schema),
    });

    // Generate additional types
    for (const [name, subSchema] of Object.entries(schema.definitions || {})) {
      sourceFile.addInterface({
        name,
        isExported: true,
        properties: this.generateProperties(subSchema),
      });
    }
  }

  private generateProperties(schema: Schema): any[] {
    return Object.entries(schema.properties || {}).map(([name, prop]) => ({
      name,
      type: this.getTypeFromSchema(prop),
      hasQuestionToken: !schema.required?.includes(name),
      docs: prop.description ? [{ description: prop.description }] : undefined,
    }));
  }

  private getTypeFromSchema(prop: any): string {
    switch (prop.type) {
      case "string":
        return prop.enum
          ? prop.enum.map((v) => `'${v}'`).join(" | ")
          : "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "array":
        return `Array<${this.getTypeFromSchema(prop.items)}>`;
      case "object":
        return prop.additionalProperties
          ? `Record<string, ${this.getTypeFromSchema(prop.additionalProperties)}>`
          : `{
              ${Object.entries(prop.properties || {})
                .map(
                  ([k, v]) =>
                    `${k}${prop.required?.includes(k) ? "" : "?"}: ${this.getTypeFromSchema(v)}`,
                )
                .join("\n")}
            }`;
      default:
        return "unknown";
    }
  }

  private addExports(sourceFile: SourceFile, schema: Schema): void {
    // Export main type
    sourceFile.addExportDeclaration({
      namedExports: ["BitXConfig"],
    });

    // Export additional types
    if (schema.definitions) {
      sourceFile.addExportDeclaration({
        namedExports: Object.keys(schema.definitions),
      });
    }
  }
}

// Usage example:
const generator = new TypeGenerator();
const types = await generator.generateTypes(schema, {
  imports: [
    {
      moduleSpecifier: "zod",
      namedImports: ["z"],
    },
  ],
});
