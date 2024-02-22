import { globbySync } from "globby"
import addLanguagesOnConfig from "../src/i18n/add-languages-on-config.js"
import compileI18nToHugo from "../src/i18n/compile-i18n-to-hugo.js"
import getTranslatedGiscus from "../src/i18n/get-translated-giscus.js"
import getTranslatedIndex from "../src/i18n/get-translated-index.js"
import { pathTranslationExceptionRegexPatterns } from "./consts.js"

const langPaths = globbySync(["../i18n/*", "!../i18n/en"], {
	onlyDirectories: true
})

Promise.all(langPaths.map(async langPath => {

	await compileI18nToHugo(
		langPath + "/",
		"../i18n/en/",
		"./",
		{
			pathTranslationExceptionRegexPatterns
		}
	)

}))

langPaths.forEach(langPath => {

	addLanguagesOnConfig(
		langPath + "/",
		"config.yml"
	)

	getTranslatedIndex(
		langPath + "/",
		"../i18n/en/",
		"data/translatedindex.yml"
	)

})

await getTranslatedGiscus(
	"data/giscuslangs.json"
)