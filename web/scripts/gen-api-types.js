/**
 * Generates web/src/api/schemas/*.ts from OpenAPI components/schemas only.
 * No types.ts — each schema is a standalone file with full type definition and imports.
 *
 * Run from repo root: make gen-web
 * Or from web/: node scripts/gen-api-types.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REPO_ROOT = path.resolve(__dirname, '../..');
const WEB_ROOT = path.resolve(__dirname, '..');
const OPENAPI_SPEC = path.join(REPO_ROOT, 'back/internal/api/openapi.yaml');
const SCHEMAS_DIR = path.join(WEB_ROOT, 'src/api/schemas');

const REF_PREFIX = '#/components/schemas/';

function resolveRef(ref) {
  if (typeof ref !== 'string' || !ref.startsWith(REF_PREFIX)) return null;
  return ref.slice(REF_PREFIX.length);
}

function schemaToTs(schema, schemas, currentName, imports) {
  if (!schema) return 'unknown';

  const ref = resolveRef(schema.$ref);
  if (ref) {
    if (!imports.has(ref)) imports.add(ref);
    return ref;
  }

  if (schema.allOf) {
    const parts = schema.allOf.map((s) => schemaToTs(s, schemas, currentName, imports)).filter((p) => p !== 'unknown');
    const out = parts.join(' & ');
    return out ? `(${out})` : 'Record<string, never>';
  }

  if (schema.oneOf) {
    const parts = schema.oneOf.map((s) => schemaToTs(s, schemas, currentName, imports)).filter((p) => p !== 'unknown');
    return parts.length ? `(${parts.join(' | ')})` : 'unknown';
  }

  switch (schema.type) {
    case 'string':
      if (Array.isArray(schema.enum)) return schema.enum.map((e) => `'${String(e).replace(/'/g, "\\'")}'`).join(' | ');
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array': {
      const items = schemaToTs(schema.items || {}, schemas, currentName, imports);
      return `${items}[]`;
    }
    case 'object': {
      if (schema.additionalProperties !== undefined) {
        const value = schemaToTs(
          typeof schema.additionalProperties === 'object' ? schema.additionalProperties : { type: 'string' },
          schemas,
          currentName,
          imports
        );
        return `Record<string, ${value}>`;
      }
      return typeFromObject(schema, schemas, currentName, imports);
    }
    default:
      return 'unknown';
  }
}

function typeFromObject(schema, schemas, currentName, imports) {
  const props = schema.properties || {};
  const required = new Set(schema.required || []);
  const entries = Object.entries(props).map(([key, value]) => {
    const optional = required.has(key) ? '' : '?';
    const propSchema = typeof value === 'object' && value !== null ? value : {};
    const ts = schemaToTs(propSchema, schemas, currentName, imports);
    const safeKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : JSON.stringify(key);
    return `  ${safeKey}${optional}: ${ts};`;
  });
  if (entries.length === 0) return 'Record<string, never>';
  return `{\n${entries.join('\n')}\n}`;
}

function emitSchema(name, schema, schemas) {
  const imports = new Set();
  const body = schemaToTs(schema, schemas, name, imports);
  const importLines =
    imports.size > 0
      ? Array.from(imports)
          .sort()
          .map((dep) => `import type { ${dep} } from './${dep}';`)
          .join('\n') + '\n\n'
      : '';

  const isInline = body.startsWith('{') || body.startsWith('(');
  let out = `/** Generated from OpenAPI schema "${name}". Do not edit. */\n\n` + importLines;
  out += isInline ? `export type ${name} = ${body};\n` : `export type ${name} = ${body};\n`;

  // Export constant array for CommonChord enum (chord picker UI)
  if (name === 'CommonChord' && schema?.type === 'string' && Array.isArray(schema.enum)) {
    const values = schema.enum.map((v) => `'${String(v).replace(/'/g, "\\'")}'`).join(', ');
    out += `\n/** All common chord values for chord picker. */\nexport const COMMON_CHORDS: ${name}[] = [${values}];\n`;
  }

  return out;
}

function main() {
  const yamlText = fs.readFileSync(OPENAPI_SPEC, 'utf8');
  const doc = parse(yamlText);
  const schemas = doc?.components?.schemas || {};
  const names = Object.keys(schemas);

  if (names.length === 0) {
    console.error('No components.schemas found in', OPENAPI_SPEC);
    process.exit(1);
  }

  fs.mkdirSync(SCHEMAS_DIR, { recursive: true });

  for (const name of names) {
    const content = emitSchema(name, schemas[name], schemas);
    fs.writeFileSync(path.join(SCHEMAS_DIR, `${name}.ts`), content);
  }

  const indexLines = names.map((n) => `export type { ${n} } from './${n}';`);
  const commonChordExport =
    names.includes('CommonChord') ? "\nexport { COMMON_CHORDS } from './CommonChord';" : '';
  fs.writeFileSync(
    path.join(SCHEMAS_DIR, 'index.ts'),
    '/** Barrel: all API schema types. */\n\n' + indexLines.join('\n') + commonChordExport + '\n'
  );

  // Remove types.ts if it existed (we no longer generate it)
  const typesPath = path.join(WEB_ROOT, 'src/api/types.ts');
  if (fs.existsSync(typesPath)) fs.unlinkSync(typesPath);

  console.log('gen-api-types: schemas/*.ts updated (' + names.length + ' schemas).');
}

main();
