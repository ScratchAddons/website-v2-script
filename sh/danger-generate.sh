cp -r ../script/danger/. ./
npm ci --prefix ../script
npx danger ci --text-only --verbose
# node ../script/danger/generate.js
rm -rf dangerfile.js
rm -rf danger-src/
echo $PR_NUMBER > ./pr-number
mv dangerfile-new.js dangerfile.js