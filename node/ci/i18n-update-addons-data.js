import { gitEmail, gitName } from "./consts.js"
import globby from "globby"
import path from "path"
import compileEn from "../src/addons-data/compile-en";
import compileOther from "../src/addons-data/compile-other"
import removeUntranslated from "../src/i18n/remove-untranslated"
import gitCommitAllAndPush from "../src/git-commit-all-and-push.js";

compileEn(
	"../sa/", 
	"en/addons-data.json"
)

globby.sync(["./*", "!./en"], {
	onlyDirectories: true
}).forEach(langPath => {

	const languageCode = path.basename(langPath)
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	compileOther(
		"../sa/", 
		`${languageCode}/addons-data.json`, {
			languageCode: languageCodeHugo
		}
	)

	removeUntranslated(
		langPath + "/",
		"en/",
		{
			globPatterns: ["addons-data.json"]
		}
	)
	
})

await gitCommitAllAndPush(
	`Update addons data (${new Date().toISOString()})`,
	gitEmail,
	gitName
)