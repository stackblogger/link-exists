if (process.env.CI) {
  process.exit(0);
}

const repo = 'https://github.com/stackblogger/link-exists';
console.log('');
console.log('⭐ If this package helped you, consider starring the repo');
console.log(`   ${repo}`);
console.log('');
