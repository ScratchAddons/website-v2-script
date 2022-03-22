import { gitEmail, gitName } from "./consts.js"
import globby from "globby"
import removeUntranslated from "../src/i18n/remove-untranslated.js";
import gitCommitAllAndPush from "../src/git-commit-all-and-push.js";

globby.sync(["*", "!en"], {
	onlyDirectories: true
}).forEach(langPath => {

	removeUntranslated(
		langPath + "/",
		"en/"
	)

})

// require("../src/i18n/generate-chinese-variants")("zh_TW/", "zh_CN/")
// require("../src/i18n/generate-chinese-variants")("zh_TW/", "zh_HK/")

await gitCommitAllAndPush(
	`Force update localization files (${new Date().toISOString()})`,
	gitEmail,
	gitName
)