export type SanitizeOptions = {
  truncate?: number;
  windows?: boolean;
  replacer?: string;
  whitespaceReplacer?: string;
};

const illegalRe = /[?<>/\\:*|"]/g;
const reservedRe = /^\.+$/;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const winReservedRe = /^(aux|con|nul|prn|com\d|lpt\d)(?:\.|$)/i;
const winTrailingRe = /[. ]+$/;

export function truncateUtf8(sanitized: string, truncate: number) {
  if (4 * sanitized.length <= truncate) return sanitized;
  const { read } = new TextEncoder().encodeInto(sanitized, new Uint8Array(truncate));
  return sanitized.slice(0, read);
}

export function sanitize(filename: string, options: SanitizeOptions = {}): string {
  const { replacer = '', windows = true, truncate = 255, whitespaceReplacer = '' } = options;
  let sanitized = filename
    .trim()
    .replace(illegalRe, replacer)
    .replace(controlRe, replacer)
    .replace(reservedRe, replacer);
  sanitized = windows ? sanitized.replace(winReservedRe, replacer).replace(winTrailingRe, replacer) : sanitized;
  sanitized = whitespaceReplacer.trim() ? sanitized.replace(/\s/g, whitespaceReplacer) : sanitized;
  if (truncate) sanitized = truncateUtf8(sanitized, truncate);
  return replacer ? sanitize(sanitized, { ...options, replacer: '' }) : sanitized;
}

const pathIllegalRe = /[?<>:*|"]/g;
const relativeRe = /\.+\/+/g;
const absoluteRe = /^\w:[/\\]+|^\/+/;
const separatorsRe = /\/+|\\/g;
export function sanitizePath(filepath: string, options: SanitizeOptions = {}): string {
  const { replacer = '', windows = true, truncate = 255, whitespaceReplacer = '' } = options;
  let sanitized = filepath
    .trim()
    .replace(controlRe, replacer)
    .replace(separatorsRe, '/')
    .replace(reservedRe, replacer)
    .replace(absoluteRe, replacer)
    .replace(relativeRe, replacer)
    .replace(pathIllegalRe, replacer);

  sanitized = windows ? sanitized.replace(winReservedRe, replacer).replace(winTrailingRe, replacer) : sanitized;
  sanitized = whitespaceReplacer.trim() ? sanitized.replace(/\s/g, whitespaceReplacer) : sanitized;
  if (truncate) sanitized = truncateUtf8(sanitized, truncate);
  return replacer ? sanitize(sanitized, { ...options, replacer: '' }) : sanitized;
}
