npm install --prefix ../script
bash ../script/sh/install-tx-go.sh
. ~/.bash_aliases
tx pull --all --use-git-timestamps --skip --mode sourceastranslation
node ../script/node/ci/i18n-update-i18n.js