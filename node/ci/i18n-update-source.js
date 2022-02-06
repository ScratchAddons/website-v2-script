const { 
	contentGlobPatterns, 
	translatableFrontMatterFields, 
	excludedFrontMatterFields,
	cleanUpGlobPatterns,
	txOrgSlug,
	txProjectSlug,
	gitEmail,
	gitName
} = require("./consts.js")
const fs = require("fs-extra")

if (fs.existsSync("en/")) {
	console.log("Cleaning up...")
	require("../src/remove-glob")(
		"en/",
		cleanUpGlobPatterns
	)
	console.log("All cleaned up!")
}
fs.ensureDirSync("en/")

require("../src/i18n/compile-en-to-i18n.js")(
	"../website/", 
	"en/", { 
		contentGlobPatterns,
		translatableFrontMatterFields,
		excludedFrontMatterFields
	}
)

require("../src/i18n/bulk-mapping")("./", txOrgSlug, txProjectSlug)

;(async () => {
	
	await require("../src/git-commit-all-and-push.js")(
		`Update source files (${new Date().toISOString()})`,
		gitEmail,
		gitName
	)

})()