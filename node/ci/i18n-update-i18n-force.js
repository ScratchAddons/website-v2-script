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

	// require("../src/i18n/generate-chinese-variants")("zh_TW/", "zh_CN/")
	// require("../src/i18n/generate-chinese-variants")("zh_TW/", "zh_HK/")

	await require("../src/git-commit-all-and-push.js")(
		`Force update localization files (${new Date().toISOString()})`,
		gitEmail,
		gitName
	)

})()