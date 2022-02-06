npm install --prefix ../script
# pip install transifex-client
bash ../script/sh/install-tx-go.sh
. ~/.bash_aliases
node ../script/node/ci/i18n-update-source.js