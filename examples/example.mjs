import { sanitize, sanitizePath } from '../lib/index.mjs';

console.log(sanitize('/home/user/<file>.ext')); // homeuserfile.ext

console.log(sanitizePath('/home/user/<file>.ext')); // home/user/file.ext

console.log(sanitize('new <file>.ext', { whitespaceReplacement: '_', replacement: '#', maxLength: 100 })); // new_#file#.ext
