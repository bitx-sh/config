import { z } from "zod";
import type { Schema, ValidationResult, ValidationOptions } from "../types";

export class SchemaValidator {
  private cache = new Map<string, z.ZodType>();

  async validate(
    data: unknown,
    schema: Schema,
    options: ValidationOptions = {},
  ): Promise<ValidationResult> {
    try {
      const zodSchema = this.getOrCreateZodSchema(schema);
      const result = await zodSchema.safeParseAsync(data);

      if (!result.success) {
        return {
          success: false,
          errors: this.formatZodErrors(result.error),
          data: undefined,
        };
      }

      return {
        success: true,
        data: result.data,
        errors: [],
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ message: error.message }],
        data: undefined,
      };
    }
  }

  private getOrCreateZodSchema(schema: Schema): z.ZodType {
    const cacheKey = JSON.stringify(schema);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const zodSchema = this.convertToZod(schema);
    this.cache.set(cacheKey, zodSchema);
    return zodSchema;
  }

  private convertToZod(schema: Schema): z.ZodType {
    switch (schema.type) {
      case "object":
        return this.createObjectSchema(schema);
      case "array":
        return this.createArraySchema(schema);
      case "string":
        return this.createStringSchema(schema);
      case "number":
        return this.createNumberSchema(schema);
      case "boolean":
        return z.boolean();
      case "null":
        return z.null();
      default:
        return z.unknown();
    }
  }

  private createObjectSchema(schema: Schema): z.ZodObject<any> {
    const shape: Record<string, z.ZodType> = {};

    for (const [key, prop] of Object.entries(schema.properties || {})) {
      const fieldSchema = this.convertToZod(prop);
      shape[key] = schema.required?.includes(key)
        ? fieldSchema
        : fieldSchema.optional();
    }

    return z.object(shape);
  }

  private createArraySchema(schema: Schema): z.ZodArray<any> {
    const itemSchema = this.convertToZod(schema.items);
    return z.array(itemSchema);
  }

  private createStringSchema(schema: Schema): z.ZodString {
    let stringSchema = z.string();

    if (schema.minLength != null) {
      stringSchema = stringSchema.min(schema.minLength);
    }
    if (schema.maxLength != null) {
      stringSchema = stringSchema.max(schema.maxLength);
    }
    if (schema.pattern) {
      stringSchema = stringSchema.regex(new RegExp(schema.pattern));
    }
    if (schema.format === "email") {
      stringSchema = stringSchema.email();
    }
    if (schema.format === "url") {
      stringSchema = stringSchema.url();
    }
    if (schema.enum) {
      return z.enum(schema.enum as [string, ...string[]]);
    }

    return stringSchema;
  }

  private createNumberSchema(schema: Schema): z.ZodNumber {
    let numberSchema = z.number();

    if (schema.minimum != null) {
      numberSchema = numberSchema.min(schema.minimum);
    }
    if (schema.maximum != null) {
      numberSchema = numberSchema.max(schema.maximum);
    }
    if (schema.multipleOf != null) {
      numberSchema = numberSchema.multipleOf(schema.multipleOf);
    }

    return numberSchema;
  }

  private formatZodErrors(
    error: z.ZodError,
  ): Array<{ path: string[]; message: string }> {
    return error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
  }
}
