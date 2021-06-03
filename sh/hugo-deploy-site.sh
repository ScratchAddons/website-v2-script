wget "https://raw.githubusercontent.com/ScratchAddons/contributors/master/.all-contributorsrc" -O "data/contributors.json"
npm install --prefix ../script
node ../script/node/ci/hugo-add-i18n.js