import { baseline, bench, group, run } from 'mitata';
import sanitizeFilename from 'sanitize-filename';
import { sanitize, sanitizePath } from '../lib/index.mjs';

const bad = '/?illegal<>*..';
const utf8 = 'Привет буфет 😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊.txt';
const long = utf8.repeat(10);
const danger1 = `x${'.'.repeat(40)}`.repeat(40);
const danger2 = `x${' '.repeat(40)}`.repeat(40);
const danger3 = `x${'-'.repeat(40)}`.repeat(40);
const longPath = 'Привет/😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊.txt'.repeat(10);

group('sanitize(utf8)', () => {
  baseline('sanitize-filepath', () => sanitize(utf8));
  bench('sanitize-filename', () => sanitizeFilename(utf8));
});

group('sanitizePath(longPath)', () => {
  baseline('sanitize', () => sanitize(longPath));
  bench('sanitizePath', () => sanitizePath(longPath));
  bench('sanitize-filename', () => sanitizeFilename(longPath));
});

group('sanitize(bad)', () => {
  baseline('sanitize-filepath', () => sanitize(bad));
  bench('sanitize-filename', () => sanitizeFilename(bad));
});

group('sanitize(long)', () => {
  baseline('sanitize-filepath', () => sanitize(long));
  bench('sanitize-filename', () => sanitizeFilename(long));
});

group('sanitize(long, replacement)', () => {
  baseline('sanitize-filepath', () => sanitize(long, { replacement: '#' }));
  bench('sanitize-filename', () => sanitizeFilename(long, { replacement: '#' }));
});

group('sanitize(danger1)', () => {
  baseline('sanitize-filepath', () => sanitize(danger1));
  bench('sanitize-filename', () => sanitizeFilename(danger1));
});

group('sanitize(danger2)', () => {
  baseline('sanitize-filepath', () => sanitize(danger2));
  bench('sanitize-filename', () => sanitizeFilename(danger2));
});

group('sanitize(danger3)', () => {
  baseline('sanitize-filepath', () => sanitize(danger3));
  bench('sanitize-filename', () => sanitizeFilename(danger3));
});

await run({
  percentiles: false
});
