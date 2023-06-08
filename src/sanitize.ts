export type SanitizeOptions = {
  /**
   * Max filename/filepath length in bytes
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

const illegalRe = /[?<>/\\:*|"]/g;
const reservedRe = /^\.+$/;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const relativeRe = /\.+[\\/]+/g;
const winReservedRe = /^(aux|con|nul|prn|com\d|lpt\d)(?:\.|$)/i;
const winTrailingRe = /[. ]+$/;

/**
 * Sanitize a string for use as a filename
 */
export function sanitize(input: string, options: SanitizeOptions = {}): string {
  const { replacement = '', maxLength = 255, whitespaceReplacement } = options;
  let sanitized = input.trim();
  sanitized = whitespaceReplacement ? sanitized.replace(/\s/g, whitespaceReplacement) : sanitized;
  sanitized = sanitized
    .replace(relativeRe, replacement)
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement);
  sanitized = truncate(sanitized, maxLength)
    .replace(reservedRe, replacement)
    .replace(winReservedRe, replacement)
    .replace(winTrailingRe, replacement);
  return replacement ? sanitize(sanitized, { ...options, replacement: '' }) : sanitized;
}

const pathIllegalRe = /[?<>:*|"]/g;
const absoluteRe = /^\w:[/\\]+|^\/+/;
const separatorsRe = /\/+|\\/g;

/**
 * Sanitize a string for use as a filepath
 */
export function sanitizePath(input: string, options: SanitizeOptions = {}): string {
  const { replacement = '', maxLength = 255, whitespaceReplacement } = options;
  let sanitized = input.trim();
  sanitized = whitespaceReplacement ? sanitized.replace(/\s/g, whitespaceReplacement) : sanitized;
  sanitized = sanitized
    .replace(controlRe, replacement)
    .replace(separatorsRe, '/')
    .replace(absoluteRe, replacement)
    .replace(relativeRe, replacement)
    .replace(pathIllegalRe, replacement);
  sanitized = truncate(sanitized, maxLength)
    .replace(reservedRe, replacement)
    .replace(winReservedRe, replacement)
    .replace(winTrailingRe, replacement);
  return replacement ? sanitizePath(sanitized, { ...options, replacement: '' }) : sanitized;
}
