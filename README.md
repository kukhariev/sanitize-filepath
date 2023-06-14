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

const filename = sanitize('/home/user/<file>.ext'); // homeuserfile.ext

const filepath = sanitizePath('/home/user/<file>.ext'); // home/user/file.ext


```

## Configure
```ts
const options: SanitizeOptions =  {
    maxLength: 255, // max filename length in bytes
    replacement: "" // replacement for invalid characters
    whitespaceReplacement: undefined // replacement for spaces, tabs, and newlines
};

const filename = sanitize('/home/user/<file>.ext', options)
```

## License

[MIT](LICENSE)