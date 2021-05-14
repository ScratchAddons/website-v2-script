const args = process.argv.slice(2)
const ref = (args.length > 0) ? args[0] : "master" 

require("../src/addons-data/compile-other")("../ScratchAddons/", "output/i18n/zh_TW/addon-dataset.json", "zh-tw")