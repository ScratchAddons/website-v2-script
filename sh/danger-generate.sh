# cp -r ../script/danger/. ./
npm ci --prefix ../script
node ../script/danger/generate.js
# npx danger ci --text-only --verbose
# rm -rf dangerfile.js
# rm -rf danger-src/
echo $PR_NUMBER > ../pr-number
# mv dangerfile-new.js dangerfile.js