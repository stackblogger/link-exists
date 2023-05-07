![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/stackblogger/link-exists/master.yml?style=flat-square&logo=github&color=success)
![npm](https://img.shields.io/npm/v/link-exists?style=flat-square&color=success&logo=npm)

# link-exists

A simple JavaScript / TypeScript library to check whether a given url is valid and exists or not.

## Installation

```bash
npm install link-exists
```

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
```

### License

[MIT](https://choosealicense.com/licenses/mit/)
