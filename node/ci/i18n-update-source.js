import { 
	contentGlobPatterns, 
	translatableFrontMatterFields, 
	excludedFrontMatterFields,
	cleanUpGlobPatterns,
	txOrgSlug,
	txProjectSlug,
	gitEmail,
	gitName
} from "./consts.js"
import fs from "fs-extra"
import removeGlob from "../src/remove-glob.js"
import compileEnToI18n from "../src/i18n/compile-en-to-i18n.js"
import bulkMapping from "../src/i18n/bulk-mapping.js"
import gitCommitAllAndPush from "../src/git-commit-all-and-push.js"

if (fs.existsSync("en/")) {
	console.log("Cleaning up...")
	removeGlob(
		"en/",
		cleanUpGlobPatterns
	)
	console.log("All cleaned up!")
}
fs.ensureDirSync("en/")

await compileEnToI18n(
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