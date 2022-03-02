wget https://raw.githubusercontent.com/ScratchAddons/contributors/with-commits/contributors.json -O "./data/credits/contributors.json"
npm ci --prefix ../script
node ../script/node/ci/hugo-add-i18n.js