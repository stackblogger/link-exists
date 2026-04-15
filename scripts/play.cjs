const path = require('path');
const { linkExists } = require(path.join(__dirname, '..', 'dist', 'index.js'));

function usage() {
  console.log(`
Usage:
  npm run play -- <url> [json-options]

Examples:
  npm run play -- https://example.com
  npm run play -- https://example.com '{"details":true}'
  npm run play -- example.com '{"ignoreProtocol":true,"details":true,"timeout":8000}'
`);
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    usage();
    process.exit(1);
  }

  let config;
  const raw = process.argv[3];
  if (raw) {
    try {
      config = JSON.parse(raw);
    } catch (err) {
      console.error('Invalid JSON for options:', err.message);
      process.exit(1);
    }
  }

  const result = await linkExists(url, config);
  if (typeof result === 'object' && result !== null) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
