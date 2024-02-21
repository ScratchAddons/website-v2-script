import { gitEmail, gitName } from "./consts.js"
import { globbySync } from "globby"
import path from "path"
import compileEn from "../src/addons-data/compile-en.js";
import compileOther from "../src/addons-data/compile-other.js"
import removeUntranslated from "../src/i18n/remove-untranslated.js"
import gitCommitAllAndPush from "../src/git-commit-all-and-push.js";

await compileEn(
	"../sa/", 
	"en/addons-data.json"
)

await Promise.all(globbySync(["./*", "!./en"], {
	onlyDirectories: true
}).map(async langPath => {

	const languageCode = path.basename(langPath)
	const languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	await compileOther(
		"../sa/", 
		`${languageCode}/addons-data.json`, {
			languageCode: languageCodeHugo
		}
	)

	await removeUntranslated(
		langPath + "/",
		"en/",
		{
			globPatterns: ["addons-data.json"]
		}
	)
	
}))

await gitCommitAllAndPush(
	`Update addons data (${new Date().toISOString()})`,
	gitEmail,
	gitName
)