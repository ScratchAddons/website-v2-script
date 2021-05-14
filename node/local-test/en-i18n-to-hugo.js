const fs = require("fs-extra")

if (fs.existsSync("output/hugo-ready/")) fs.removeSync("output/hugo-ready/")
fs.ensureDir("output/hugo-ready/")

require("../src/compile-i18n-to-hugo")(
	"output/i18n/en/",
	"output/hugo-ready/",
)
require("../src/add-languages-on-config")(
	"output/i18n/en/language.json",
	"output/hugo-ready/config.yml"
)