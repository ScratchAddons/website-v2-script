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
import fs from "fs-extra"
import gitCommitAllAndPush from "../src/git-commit-all-and-push.js"
import bulkMapping from "../src/i18n/bulk-mapping.js"
import compileEnToI18n from "../src/i18n/compile-en-to-i18n.js"

if (fs.existsSync("en/")) {
	console.log("Cleaning up...")
	require("../src/remove-glob")(
		"en/",
		cleanUpGlobPatterns
	)
	console.log("All cleaned up!")
}
fs.ensureDirSync("en/")

compileEnToI18n(
	"../website/", 
	"en/", { 
		contentGlobPatterns,
		translatableFrontMatterFields,
		excludedFrontMatterFields
	}
)

bulkMapping("./", txOrgSlug, txProjectSlug)

await gitCommitAllAndPush(
	`Update source files (${new Date().toISOString()})`,
	gitEmail,
	gitName
)