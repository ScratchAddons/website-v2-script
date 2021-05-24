const { gitEmail, gitName } = require("./consts.js")
const globby = require("globby")

globby.sync(["*", "!en"], {
	onlyDirectories: true
}).forEach(langPath => {

	require("../src/i18n/remove-untranslated.js")(
		langPath + "/",
		"en/"
	)

})

;(async () => {

	require("../src/git-commit-all-and-push.js")(
		`Update localization files (${new Date().toISOString()})`,
		gitEmail,
		gitName
	)

})()