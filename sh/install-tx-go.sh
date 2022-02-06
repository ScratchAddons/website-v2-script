shopt -s expand_aliases 
source ~/.bashrc
wget https://github.com/transifex/cli/releases/download/v1.0.0/tx-linux-amd64.tar.gz -O ${RUNNER_TEMP}/tx.tar.gz
tar -zxvf ${RUNNER_TEMP}/tx.tar.gz -C ${RUNNER_TEMP} tx
chmod -x ${RUNNER_TEMP}/tx'
alias tx='${RUNNER_TEMP}/tx'
echo "alias tx='${RUNNER_TEMP}/tx'" >> ~/.bash_aliases