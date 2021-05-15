const { gitEmail, gitName } = require("./consts.js")
const globby = require("globby")
const path = require("path")

require("../src/addons-data/compile-en")(
	"../sa/", 
	"en/addons-data.json"
)

globby.sync(["./*", "!./en"], {
	onlyDirectories: true
}).forEach(langPath => {

	const languageCode = path.basename(langPath)
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	require("../src/addons-data/compile-other")(
		"../sa/", 
		`${languageCode}/addons-data.json`, 
		languageCodeHugo
	)
})

;(async () => {

	await require("../src/git-commit-all-and-push.js")(
		`Update addons data (${new Date().toISOString()})`,
		gitEmail,
		gitName
	)

})()
