import { run, bench, group, baseline } from 'mitata';
import sanitizeFilename from 'sanitize-filename';
import { sanitize } from '../lib/index.mjs';

const bad = '/?illegal<>*..';
const utf8 = 'Привет буфет 😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊.txt';
const long = utf8.repeat(10);

group('sanitize(utf8)', () => {
  baseline('sanitize-filepath', () => sanitize(utf8));
  bench('sanitize-filename', () => sanitizeFilename(utf8));
});

group('sanitize(bad)', () => {
  baseline('sanitize-filepath', () => sanitize(bad));
  bench('sanitize-filename', () => sanitizeFilename(bad));
});

group('sanitize(long)', () => {
  baseline('sanitize-filepath', () => sanitize(long));
  bench('sanitize-filename', () => sanitizeFilename(long));
});

await run({
  percentiles: false
});
