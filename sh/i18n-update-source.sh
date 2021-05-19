npm install --prefix ../script
node ../script/node/ci/i18n-update-source.js
tx config mapping-bulk --project scratch-addons-website --source-language en --type GITHUBMARKDOWN --file-extension .md --source-file-dir en/markdown --expression <lang>/markdown/{filepath}/{filename}{extension} --execute
tx config mapping-bulk --project scratch-addons-website --source-language en --type HTML --file-extension .html --source-file-dir en/html-content --expression <lang>/html-content/{filepath}/{filename}{extension} --execute
node ../script/node/ci/i18n-update-source-2.js