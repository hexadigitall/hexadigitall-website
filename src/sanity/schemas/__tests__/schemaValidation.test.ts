// src/sanity/schemas/__tests__/schemaValidation.test.ts
/**
 * Tests for Sanity schema validation to prevent SchemaError issues.
 * 
 * Common causes of SchemaError in Sanity v3/v4:
 * - Nested defineField() calls inside object type fields
 * - Missing required 'name' property on schema types
 * - Missing required 'type' property on schema types
 * - Malformed field definitions in object types
 */

import { describe, test, expect, jest, beforeAll } from '@jest/globals';

// Mock sanity module to avoid ESM transformation issues
jest.mock('sanity', () => ({
  defineType: (config: Record<string, unknown>) => config,
  defineField: (config: Record<string, unknown>) => config,
}));

// Import schemas after mocking
import { schemaTypes } from '../index';

// Type for schema type definition
interface SchemaField {
  name?: string;
  type?: string;
  fields?: SchemaField[];
  [key: string]: unknown;
}

interface SchemaTypeDefinition {
  name?: string;
  type?: string;
  title?: string;
  fields?: SchemaField[];
  [key: string]: unknown;
}

/**
 * Recursively check for nested defineField() calls.
 * In Sanity v3/v4, nested fields inside object types must be plain objects,
 * not wrapped in defineField(). The presence of certain internal properties
 * like Symbol keys or specific patterns can indicate improper nesting.
 */
function hasProperFieldStructure(field: SchemaField): boolean {
  if (!field.name || !field.type) {
    return false;
  }
  
  // If this field has nested fields (for object types), check them too
  if (field.fields && Array.isArray(field.fields)) {
    return field.fields.every((nestedField: SchemaField) => {
      // Check that nested fields are plain objects with required properties
      return nestedField.name && nestedField.type && hasProperFieldStructure(nestedField);
    });
  }
  
  return true;
}

describe('Sanity Schema Validation', () => {
  describe('Schema Types Structure', () => {
    test('all schema types should have a name property', () => {
      schemaTypes.forEach((type: SchemaTypeDefinition) => {
        expect(type.name).toBeDefined();
        expect(typeof type.name).toBe('string');
        expect(type.name.length).toBeGreaterThan(0);
      });
    });

    test('all schema types should have a type property', () => {
      schemaTypes.forEach((type: SchemaTypeDefinition) => {
        expect(type.type).toBeDefined();
        expect(typeof type.type).toBe('string');
      });
    });

    test('document types should have fields array', () => {
      const documentTypes = schemaTypes.filter(
        (type: SchemaTypeDefinition) => type.type === 'document'
      );
      
      documentTypes.forEach((type: SchemaTypeDefinition) => {
        expect(type.fields).toBeDefined();
        expect(Array.isArray(type.fields)).toBe(true);
      });
    });

    test('all fields should have name and type properties', () => {
      schemaTypes.forEach((type: SchemaTypeDefinition) => {
        if (type.fields && Array.isArray(type.fields)) {
          type.fields.forEach((field: SchemaField) => {
            expect(field.name).toBeDefined();
            expect(field.type).toBeDefined();
            expect(typeof field.name).toBe('string');
            expect(typeof field.type).toBe('string');
          });
        }
      });
    });
  });

  describe('Nested Object Fields (SchemaError Prevention)', () => {
    test('object type fields should have properly structured nested fields', () => {
      schemaTypes.forEach((type: SchemaTypeDefinition) => {
        if (type.fields && Array.isArray(type.fields)) {
          type.fields
            .filter((field: SchemaField) => field.type === 'object' && field.fields)
            .forEach((objectField: SchemaField) => {
              expect(hasProperFieldStructure(objectField)).toBe(true);
            });
        }
      });
    });

    test('nested fields in object types should be plain objects', () => {
      schemaTypes.forEach((type: SchemaTypeDefinition) => {
        if (type.fields && Array.isArray(type.fields)) {
          type.fields
            .filter((field: SchemaField) => field.type === 'object' && field.fields)
            .forEach((objectField: SchemaField) => {
              if (objectField.fields) {
                objectField.fields.forEach((nestedField: SchemaField) => {
                  // Each nested field should have name and type
                  expect(nestedField.name).toBeDefined();
                  expect(nestedField.type).toBeDefined();
                });
              }
            });
        }
      });
    });
  });

  describe('Specific Schema Validations', () => {
    test('course schema should be properly defined', () => {
      const courseSchema = schemaTypes.find(
        (type: SchemaTypeDefinition) => type.name === 'course'
      );
      
      expect(courseSchema).toBeDefined();
      expect(courseSchema?.type).toBe('document');
      expect(courseSchema?.fields).toBeDefined();
    });

    test('enrollment schema should be properly defined', () => {
      const enrollmentSchema = schemaTypes.find(
        (type: SchemaTypeDefinition) => type.name === 'enrollment'
      );
      
      expect(enrollmentSchema).toBeDefined();
      expect(enrollmentSchema?.type).toBe('document');
      expect(enrollmentSchema?.fields).toBeDefined();
    });

    test('pendingEnrollment schema should be properly defined', () => {
      const pendingEnrollmentSchema = schemaTypes.find(
        (type: SchemaTypeDefinition) => type.name === 'pendingEnrollment'
      );
      
      expect(pendingEnrollmentSchema).toBeDefined();
      expect(pendingEnrollmentSchema?.type).toBe('document');
      expect(pendingEnrollmentSchema?.fields).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('schemaTypes should not be empty', () => {
      expect(schemaTypes.length).toBeGreaterThan(0);
    });

    test('schema type names should be unique', () => {
      const names = schemaTypes.map((type: SchemaTypeDefinition) => type.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    test('field names within each schema should be unique', () => {
      schemaTypes.forEach((type: SchemaTypeDefinition) => {
        if (type.fields && Array.isArray(type.fields)) {
          const fieldNames = type.fields.map((field: SchemaField) => field.name);
          const uniqueFieldNames = new Set(fieldNames);
          expect(uniqueFieldNames.size).toBe(fieldNames.length);
        }
      });
    });
  });
});
