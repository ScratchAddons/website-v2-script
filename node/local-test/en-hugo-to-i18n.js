const fs = require("fs-extra")

if (fs.existsSync("output/i18n/en/")) fs.removeSync("output/i18n/en/")
fs.ensureDir("output/i18n/en/")

require("../src/compile-en-to-i18n.js")(
	"../ScratchAddons-Website-Hugo/", 
	"output/i18n/en/"
)