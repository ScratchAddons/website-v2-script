const globby = require("globby")

globby.sync(["*", "!en"], {
	onlyDirectories: true
}).forEach(langPath => {

	require("../src/i18n/prepare-folders.js")(
		langPath + "/",
		"en/"
	)

})