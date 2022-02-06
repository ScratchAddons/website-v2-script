npm install --prefix ../script
bash ../script/sh/install-tx-go.sh
shopt -s expand_aliases 
alias tx='${RUNNER_TEMP}/tx'
node ../script/node/ci/i18n-update-source.js