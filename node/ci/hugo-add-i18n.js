import { globbySync } from "globby"
import addLanguagesOnConfig from "../src/i18n/add-languages-on-config.js"
import compileI18nToHugo from "../src/i18n/compile-i18n-to-hugo.js"
import getTranslatedGiscus from "../src/i18n/get-translated-giscus.js"
import getTranslatedIndex from "../src/i18n/get-translated-index.js"
import { pathTranslationExceptionRegexPatterns } from "./consts.js"

globbySync(["../i18n/*", "!../i18n/en"], {
	onlyDirectories: true
}).forEach(langPath => {

	compileI18nToHugo(
		langPath + "/",
		"../i18n/en/",
		"./",
		{
			pathTranslationExceptionRegexPatterns
		}
	)

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