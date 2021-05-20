npm install --prefix ../script
pip install transifex-client
node ../script/node/ci/i18n-update-source.js
tx config mapping-bulk --project scratch-addons-website --source-language en --type GITHUBMARKDOWN --file-extension .md --source-file-dir en/markdown --expression \<lang\>/markdown/{filepath}/{filename}{extension} --minimum-perc=0 --execute
tx config mapping-bulk --project scratch-addons-website --source-language en --type HTML_FRAGMENT --file-extension .html --source-file-dir en/html-content --expression \<lang\>/html-content/{filepath}/{filename}{extension} --minimum-perc=0 --execute
node ../script/node/ci/i18n-update-source-2.js