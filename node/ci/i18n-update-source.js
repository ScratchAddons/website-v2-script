const { 
	gitEmail, 
	gitName, 
	contentGlobPatterns, 
	translatableFrontMatterFields, 
	excludedFrontMatterFields,
	cleanUpGlobPatterns
} = require("./consts.js")
const fs = require("fs-extra")
const globby = require("globby")
const chalk = require("chalk")

if (fs.existsSync("en/")) {
	console.log("Cleaning up...")
	require("../src/remove-glob")("en/", cleanUpGlobPatterns)
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

