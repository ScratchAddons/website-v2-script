cp -r ../script/danger/. ./
npx danger ci --text-only --verbose
rm -rf dangerfile.js
rm -rf danger-src/
echo $PR_NUMBER > ./pr-number
mv dangerfile-new.js dangerfile.js