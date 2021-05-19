pip install transifex-client
tx pull --all --use-git-timestamps --skip --mode sourceastranslation
npm install --prefix ../script
node ../script/node/ci/i18n-update-i18n.js