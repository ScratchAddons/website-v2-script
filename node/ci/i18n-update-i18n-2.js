const { gitEmail, gitName, txOrgSlug, resourcesToPullWithAPI3: resourcesToFetchWithApi3 } = require("./consts.js")
const globby = require("globby")

require("../src/i18n/pull-resources-with-api-3")(
	"./",
	txOrgSlug, 
	txToken,
	{
		resourcesToFetch: resourcesToPullWithAPI3
	}
)

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