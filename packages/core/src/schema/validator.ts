//// @ts-check
/**
 * @fileoverview Schema validation implementation
 * @package @bitx-sh/config
 */

///// <reference types="typescript" />
///// <reference types="bun-types" />

import { z } from "zod";
import type { Schema, ValidationResult, ValidationOptions } from "../types";

/**
 * Schema validator class
 * @class SchemaValidator
 *
 * @description
 * Validates configuration data against schemas using Zod.
 * Supports schema caching and custom validation rules.
 *
 * @example
 * ```typescript
 * const validator = new SchemaValidator();
 * const result = await validator.validate(data, schema);
 * ```
 */
export class SchemaValidator {
  /**
   * Schema cache
   * @private
   * @type {Map<string, z.ZodType>}
   */
  private cache = new Map<string, z.ZodType>();

  /**
   * Validates data against a schema
   * @param {unknown} data - Data to validate
   * @param {Schema} schema - Validation schema
   * @param {ValidationOptions} options - Validation options
   * @returns {Promise<ValidationResult>}
   *
   * @throws {ValidationError} When schema is invalid
   * @emits {ValidationEvent} validate - When validation completes
   */
  async validate(
    data: unknown,
    schema: Schema,
    options: ValidationOptions = {},
  ): Promise<ValidationResult> {
    try {
      const zodSchema = this.getOrCreateZodSchema(schema);
      const result = zodSchema.safeParse(data);
      
      if (result.success) {
        return {
          success: true,
          errors: [],
          data: result.data,
        };
      }
      
      return {
        success: false,
        errors: this.formatZodErrors(result.error),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: this.formatZodErrors(error),
        };
      }
      
      throw error;
    }
  }

  /**
   * Gets or creates a Zod schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodType}
   */
  private getOrCreateZodSchema(schema: Schema): z.ZodType {
    const cacheKey = JSON.stringify(schema);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const zodSchema = this.convertToZod(schema);
    this.cache.set(cacheKey, zodSchema);
    
    return zodSchema;
  }

  /**
   * Converts schema to Zod schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodType}
   */
  private convertToZod(schema: Schema): z.ZodType {
    switch (schema.type) {
      case 'object':
        return this.createObjectSchema(schema);
      case 'array':
        return this.createArraySchema(schema);
      case 'string':
        return this.createStringSchema(schema);
      case 'number':
      case 'integer':
        return this.createNumberSchema(schema);
      case 'boolean':
        return z.boolean();
      case 'null':
        return z.null();
      default:
        return z.any();
    }
  }

  /**
   * Creates object schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodObject<any>}
   */
  private createObjectSchema(schema: Schema): z.ZodObject<any> {
    const shape: Record<string, z.ZodType> = {};
    
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        const propertySchema = this.convertToZod(propSchema as Schema);
        
        if (schema.required?.includes(key)) {
          shape[key] = propertySchema;
        } else {
          shape[key] = propertySchema.optional();
        }
      }
    }
    
    return z.object(shape);
  }

  /**
   * Creates array schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodArray<any>}
   */
  private createArraySchema(schema: Schema): z.ZodArray<any> {
    // Default to any if items not specified
    const itemSchema = schema.items ? 
      this.convertToZod(schema.items as Schema) : 
      z.any();
    
    return z.array(itemSchema);
  }

  /**
   * Creates string schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodString}
   */
  private createStringSchema(schema: Schema): z.ZodString {
    let stringSchema = z.string();
    
    if (schema.minLength !== undefined) {
      stringSchema = stringSchema.min(schema.minLength);
    }
    
    if (schema.maxLength !== undefined) {
      stringSchema = stringSchema.max(schema.maxLength);
    }
    
    if (schema.pattern) {
      stringSchema = stringSchema.regex(new RegExp(schema.pattern));
    }
    
    if (schema.enum) {
      return z.enum(schema.enum as [string, ...string[]]);
    }
    
    return stringSchema;
  }

  /**
   * Creates number schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodNumber}
   */
  private createNumberSchema(schema: Schema): z.ZodNumber {
    let numberSchema = z.number();
    
    if (schema.minimum !== undefined) {
      numberSchema = numberSchema.min(schema.minimum);
    }
    
    if (schema.maximum !== undefined) {
      numberSchema = numberSchema.max(schema.maximum);
    }
    
    if (schema.type === 'integer') {
      numberSchema = numberSchema.int();
    }
    
    return numberSchema;
  }

  /**
   * Formats Zod errors
   * @private
   * @param {z.ZodError} error - Zod error
   * @returns {Array<{path: string[], message: string}>}
   */
  private formatZodErrors(
    error: z.ZodError,
  ): Array<{ path: string[]; message: string }> {
    return error.errors.map(err => ({
      path: err.path,
      message: err.message,
    }));
  }
}
