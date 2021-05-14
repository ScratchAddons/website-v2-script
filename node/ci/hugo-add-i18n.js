const globby = require("globby")
const { gitEmail, gitName } = require("./consts")

globby.sync(["../i18n/*", "!../i18n/en"], {
	onlyDirectories: true
}).forEach(langPath => {

	require("../src/i18n/compile-i18n-to-hugo")(
		langPath + "/",
		"./",
	)

	require("../src/i18n/add-languages-on-config")(
		langPath + "/language.json",
		"config.yml"
	)

})

require("../src/git-commit-all-and-push.js")(
	`Update localization files (${new Date().toISOString()})`,
	gitEmail,
	gitName
)