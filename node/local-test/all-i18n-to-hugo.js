const fs = require("fs-extra")
const globby = require("globby")

if (fs.existsSync("output/hugo-ready/")) fs.removeSync("output/hugo-ready/")
fs.ensureDir("output/hugo-ready/")

console.log(globby.sync(["output/i18n/*", "!output/i18n/en"], {
	onlyDirectories: true
}))

fs.copyFileSync("../ScratchAddons-Website-Hugo/config.yml", "output/hugo-ready/config.yml")

globby.sync(["output/i18n/*", "!output/i18n/en"], {
	onlyDirectories: true
}).forEach(langPath => {

	require("../src/compile-i18n-to-hugo")(
		langPath + "/",
		"output/hugo-ready/",
	)

	require("../src/add-languages-on-config")(
		langPath + "/language.json",
		"output/hugo-ready/config.yml"
	)

})

