const { 
	contentGlobPatterns, 
	translatableFrontMatterFields, 
	excludedFrontMatterFields,
	cleanUpGlobPatterns
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

require("../src/i18n/rename-resources-in-config").part1(
	".tx/config"
)