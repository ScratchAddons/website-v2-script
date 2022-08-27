echo > ../dangerfile.js
npm ci --prefix ../script
node ../script/node/ci/danger-generate.js
echo $PR_NUMBER > ../pr-number