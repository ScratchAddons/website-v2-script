npm ci --prefix ../script
tx pull --all --use-git-timestamps --skip
node ../script/node/ci/i18n-update-i18n.js