![npm](https://img.shields.io/npm/v/link-exists?style=flat-square&color=success&logo=npm)
![npm](https://img.shields.io/npm/dm/link-exists?style=flat-square&color=success&logo=npm)
![GitHub](https://img.shields.io/github/license/stackblogger/link-exists?style=flat-square&logo=github&color=success)

# link-exists

A super lightweight JavaScript / TypeScript library to check whether a given url is valid and exists or not.

## Installation

```bash
npm install link-exists
```

## Features

A super lightweight library to validate if a given url is valid or not. Some additional features are-

- less than <b>1 kb</b> in size
- additional configuration to validate as per custom requirement
- supports node.js latest version
- TypeScript and JavaScript support
- built on ES6 modules
- Jest test cases with <b>100% coverage</b>
- Promise based result

## Usage (TypeScript)

```typescript
import { linkExists } from 'link-exists';

await linkExists('https://stackblogger.com'); // true when any HTTP answer comes back
// response: true

await linkExists('www.stackblogger.com'); // false: no protocol in the string by default
// response: false

await linkExists('www.stackblogger.com', { ignoreProtocol: true }); // same host, protocol added
// response: true

await linkExists('https://example.com', { details: true }); // object, exists follows ok status
// response: { exists: true, status: 200, url: 'https://example.com/' }

await linkExists('stackblogger.com', { ignoreProtocol: true }); // allow link with no protocol
// response: true

await linkExists('https://example.com', { timeout: 5000 }); // stop after 5 seconds
// response: true (or false on timeout / error)

await linkExists('https://example.com', { method: 'GET' }); // use GET not HEAD
// response: true

await linkExists('https://example.com', { fallbackToGet: false }); // no GET retry after HEAD
// response: true

await linkExists('https://example.com', { details: true, timeout: 8000, method: 'HEAD' }); // mix of options
// response: { exists: true, status: 200, url: 'https://example.com/' }
```

## Usage (JavaScript)

```javascript
const { linkExists } = require('link-exists');

await linkExists('https://stackblogger.com'); // true when any HTTP answer comes back
// response: true

await linkExists('www.stackblogger.com'); // false: no protocol in the string by default
// response: false

await linkExists('www.stackblogger.com', { ignoreProtocol: true }); // same host, protocol added
// response: true

await linkExists('https://example.com', { details: true }); // object, exists follows ok status
// response: { exists: true, status: 200, url: 'https://example.com/' }

await linkExists('stackblogger.com', { ignoreProtocol: true }); // allow link with no protocol
// response: true

await linkExists('https://example.com', { timeout: 5000 }); // stop after 5 seconds
// response: true (or false on timeout / error)

await linkExists('https://example.com', { method: 'GET' }); // use GET not HEAD
// response: true

await linkExists('https://example.com', { fallbackToGet: false }); // no GET retry after HEAD
// response: true

await linkExists('https://example.com', { details: true, timeout: 8000, method: 'HEAD' }); // mix of options
// response: { exists: true, status: 200, url: 'https://example.com/' }
```

### License

[MIT](https://choosealicense.com/licenses/mit/)
