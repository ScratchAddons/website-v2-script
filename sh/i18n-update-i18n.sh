npm install --prefix ../script
node ../script/node/ci/i18n-update-i18n.js
pip install transifex-client
tx pull --all --use-git-timestamps --skip --mode sourceastranslation --resource 'scratch-addons-website.hugo-*,scratch-addons-website.html-*'
node ../script/node/ci/i18n-update-i18n-2.js