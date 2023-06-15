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

const secondRunOptions = { maxLength: Number.MAX_SAFE_INTEGER, replacement: '' };
const maxExtensionLength = 15;

/**
 * Truncate utf8 string
 */
export function truncate(input: string, byteLength: number, ext = ''): string {
  if (4 * input.length <= byteLength) return input;
  const extLen = ext ? new TextEncoder().encode(ext).byteLength : 0;
  const { read } = new TextEncoder().encodeInto(input, new Uint8Array(byteLength - extLen));
  return input.slice(0, read) + ext;
}

export function extname(filename: string): string {
  const base = filename.trim().slice(-maxExtensionLength);
  const idx = base.lastIndexOf('.');
  return idx > 0 ? base.slice(idx) : '';
}

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
  const ext = extname(input);
  let sanitized = input.trimStart().slice(0, maxLength).trimEnd();
  sanitized = whitespaceReplacement ? sanitized.replace(/\s/g, whitespaceReplacement) : sanitized;
  sanitized = sanitized
    .replace(relativeRe, replacement)
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement);
  sanitized = truncate(sanitized, maxLength, ext)
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
  let sanitized = input.trim();
  sanitized = whitespaceReplacement ? sanitized.replace(/\s/g, whitespaceReplacement) : sanitized;
  sanitized = sanitized
    .replace(controlRe, replacement)
    .replace(separatorsRe, '/')
    .replace(absoluteRe, replacement)
    .replace(relativeRe, replacement)
    .replace(pathIllegalRe, replacement)
    .replace(reservedRe, replacement);

  const pathSegments = sanitized
    .split('/') // FIXME: .split is slow
    .filter(Boolean)
    .map((segment, idx, segments) => {
      const ext = idx === segments.length - 1 ? extname(segment) : '';
      let part = truncate(segment.trim(), maxLength, ext).trimEnd().replace(winReservedRe, replacement);
      while (part[part.length - 1] === '.') part = part.slice(0, -1) + replacement;
      return part;
    });
  sanitized = pathSegments.join('/');
  return replacement ? sanitize(sanitized, secondRunOptions) : sanitized;
}
