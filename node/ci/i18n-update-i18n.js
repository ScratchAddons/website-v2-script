import { gitEmail, gitName } from "./consts.js"
import { globby } from "globby"
import removeUntranslated from "../src/i18n/remove-untranslated.js";
import gitCommitAllAndPush from "../src/git-commit-all-and-push.js";

await Promise.all((await globby(["*", "!en"], {
	onlyDirectories: true
})).map(async langPath => {

	await removeUntranslated(
		langPath + "/",
		"en/"
	)

}))

// require("../src/i18n/generate-chinese-variants")("zh_TW/", "zh_CN/")
// require("../src/i18n/generate-chinese-variants")("zh_TW/", "zh_HK/")

await gitCommitAllAndPush(
	`Update localization files (${new Date().toISOString()})`,
	gitEmail,
	gitName
)