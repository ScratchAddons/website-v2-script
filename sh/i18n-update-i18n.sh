npm install --prefix ../script
bash ../script/sh/install-tx-go.sh
shopt -s expand_aliases 
alias tx='${RUNNER_TEMP}/tx'
tx pull --all --use-git-timestamps --skip
node ../script/node/ci/i18n-update-i18n.js