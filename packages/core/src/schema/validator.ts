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
  ): Promise<ValidationResult>;

  /**
   * Gets or creates a Zod schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodType}
   */
  private getOrCreateZodSchema(schema: Schema): z.ZodType;

  /**
   * Converts schema to Zod schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodType}
   */
  private convertToZod(schema: Schema): z.ZodType;

  /**
   * Creates object schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodObject<any>}
   */
  private createObjectSchema(schema: Schema): z.ZodObject<any>;

  /**
   * Creates array schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodArray<any>}
   */
  private createArraySchema(schema: Schema): z.ZodArray<any>;

  /**
   * Creates string schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodString}
   */
  private createStringSchema(schema: Schema): z.ZodString;

  /**
   * Creates number schema
   * @private
   * @param {Schema} schema - Source schema
   * @returns {z.ZodNumber}
   */
  private createNumberSchema(schema: Schema): z.ZodNumber;

  /**
   * Formats Zod errors
   * @private
   * @param {z.ZodError} error - Zod error
   * @returns {Array<{path: string[], message: string}>}
   */
  private formatZodErrors(
    error: z.ZodError,
  ): Array<{ path: string[]; message: string }>;
}
