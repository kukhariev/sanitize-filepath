export type SanitizeOptions = {
  maxLength?: number;
  replacement?: string;
  whitespaceReplacement?: string;
};

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
const winTrailingRe = /[.]+$/;

export function sanitize(filename: string, options: SanitizeOptions = {}): string {
  const { replacement = '', maxLength = 255, whitespaceReplacement = '' } = options;
  let sanitized = filename
    .trim()
    .replace(relativeRe, replacement)
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement);
  sanitized = truncate(sanitized, maxLength)
    .replace(reservedRe, replacement)
    .replace(winReservedRe, replacement)
    .replace(winTrailingRe, replacement);
  sanitized = whitespaceReplacement ? sanitized.replace(/\s/g, whitespaceReplacement) : sanitized;
  return replacement ? sanitize(sanitized, { ...options, replacement: '' }) : sanitized;
}

const pathIllegalRe = /[?<>:*|"]/g;
const absoluteRe = /^\w:[/\\]+|^\/+/;
const separatorsRe = /\/+|\\/g;

export function sanitizePath(filepath: string, options: SanitizeOptions = {}): string {
  const { replacement = '', maxLength = 255, whitespaceReplacement = '' } = options;
  let sanitized = filepath
    .trim()
    .replace(controlRe, replacement)
    .replace(separatorsRe, '/')
    .replace(absoluteRe, replacement)
    .replace(relativeRe, replacement)
    .replace(pathIllegalRe, replacement);
  sanitized = truncate(sanitized, maxLength)
    .replace(reservedRe, replacement)
    .replace(winReservedRe, replacement)
    .replace(winTrailingRe, replacement);
  sanitized = whitespaceReplacement ? sanitized.replace(/\s/g, whitespaceReplacement) : sanitized;
  return replacement ? sanitizePath(sanitized, { ...options, replacement: '' }) : sanitized;
}
