const globby = require("globby")

globby.sync(["../i18n/*", "!../i18n/en"], {
	onlyDirectories: true
}).forEach(langPath => {

	require("../src/i18n/compile-i18n-to-hugo")(
		langPath + "/",
		"../i18n/en/",
		"./",
	)

	require("../src/i18n/add-languages-on-config")(
		langPath + "/language.json",
		"config.yml"
	)

})
