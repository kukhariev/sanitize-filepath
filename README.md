# sanitize-filepath

[![npm version](https://badge.fury.io/js/sanitize-filepath.svg)](https://badge.fury.io/js/sanitize-filepath)

Sanitize a string for use as a filename/filepath.

## Installation

```sh
npm i sanitize-filepath
```

## Example

```js
import { sanitize, sanitizePath } from 'sanitize-filepath';

console.log(sanitize('/home/user/<file>.ext')); // homeuserfile.ext

console.log(sanitizePath('/home/user/<file>.ext')); // home/user/file.ext
```
