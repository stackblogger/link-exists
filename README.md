![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/stackblogger/link-exists/master.yml?style=flat-square&logo=github&color=success)
![npm](https://img.shields.io/npm/v/link-exists?style=flat-square&color=success&logo=npm)
![npm](https://img.shields.io/npm/dw/link-exists?style=flat-square&color=success&logo=npm)
![npm bundle size](https://img.shields.io/bundlephobia/min/link-exists?style=flat-square&logo=npm)
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

const result = await linkExists('https://stackblogger.com');
console.log(result);
// OUTPUT true

const result = await linkExists('https://some-invalid-url.com');
console.log(result);
// OUTPUT false

const result = await linkExists('stackblogger.com');
console.log(result);
// OUTPUT false

// Configuration
const result = await linkExists('stackblogger.com', { ignoreProtocol: true });
console.log(result);
// OUTPUT true
```

## Usage (JavaScript)

```javascript
const { linkExists } = require('link-exists');

const result = await linkExists('https://stackblogger.com');
console.log(result);
// OUTPUT true

const result = await linkExists('https://some-invalid-url.com');
console.log(result);
// OUTPUT false

const result = await linkExists('stackblogger.com');
console.log(result);
// OUTPUT false

// Configuration
const result = await linkExists('stackblogger.com', { ignoreProtocol: true });
console.log(result);
// OUTPUT true
```

### License

[MIT](https://choosealicense.com/licenses/mit/)
