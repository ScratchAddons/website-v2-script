cp ../script/danger/. ./
npx danger ci --text-only --verbose
rm -rf dangerfile.js
rm -rf danger-src/