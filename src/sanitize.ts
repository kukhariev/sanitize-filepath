export type SanitizeOptions = {
  /**
   * Max filename length in bytes
   * @defaultValue 255
   */
  maxLength?: number;
  /**
   * Replacement for invalid characters
   * @defaultValue ""
   */
  replacement?: string;
  /**
   * Replacement for spaces, tabs, newlines
   */
  whitespaceReplacement?: string;
};

/**
 * Truncate utf8 string
 */
export function truncate(input: string, byteLength: number): string {
  if (4 * input.length <= byteLength) return input;
  const { read } = new TextEncoder().encodeInto(input, new Uint8Array(byteLength));
  return input.slice(0, read);
}

const secondRunOptions = { maxLength: Number.MAX_SAFE_INTEGER, replacement: '' };

const illegalRe = /[?<>/\\:*|"]/g;
const reservedRe = /^\.+$/;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const relativeRe = /\.{1,2}[\\/]+/g;
const winReservedRe = /^(aux|con|nul|prn|com\d|lpt\d)(?:\.|$)/i;

/**
 * Sanitize a string for use as a filename
 */
export function sanitize(input: string, options: SanitizeOptions = {}): string {
  const { replacement = '', maxLength = 255, whitespaceReplacement } = options;
  let sanitized = input.trim().slice(0, maxLength);
  sanitized = whitespaceReplacement ? sanitized.replace(/\s/g, whitespaceReplacement) : sanitized;
  sanitized = sanitized
    .replace(relativeRe, replacement)
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement);
  sanitized = truncate(sanitized, maxLength)
    .trimEnd()
    .replace(reservedRe, replacement)
    .replace(winReservedRe, replacement);
  while (sanitized[sanitized.length - 1] === '.') sanitized = sanitized.slice(0, -1) + replacement;
  return replacement ? sanitize(sanitized, secondRunOptions) : sanitized;
}

const pathIllegalRe = /[?<>:*|"]/g;
const absoluteRe = /^\w:[/\\]+|^\/+/;
const separatorsRe = /\/+|\\/g;

/**
 * Sanitize a string for use as a filepath
 */
export function sanitizePath(input: string, options: SanitizeOptions = {}): string {
  const { replacement = '', maxLength = 255, whitespaceReplacement } = options;
  let sanitized = input.trim().slice(0, 4096);
  sanitized = whitespaceReplacement ? sanitized.replace(/\s/g, whitespaceReplacement) : sanitized;
  sanitized = sanitized
    .replace(controlRe, replacement)
    .replace(separatorsRe, '/')
    .replace(absoluteRe, replacement)
    .replace(relativeRe, replacement)
    .replace(pathIllegalRe, replacement)
    .replace(reservedRe, replacement);

  const pathSegments = sanitized
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      let part = truncate(segment.trim(), maxLength).trimEnd().replace(winReservedRe, replacement);
      while (part[part.length - 1] === '.') part = part.slice(0, -1) + replacement;
      return part;
    });
  sanitized = pathSegments.join('/');
  return replacement ? sanitize(sanitized, secondRunOptions) : sanitized;
}
