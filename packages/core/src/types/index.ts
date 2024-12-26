export interface Schema {
  type: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  definitions?: Record<string, Schema>;
}

export interface SchemaProperty {
  type: string;
  description?: string;
  default?: unknown;
  enum?: unknown[];
  // ... other JSON Schema properties
}
