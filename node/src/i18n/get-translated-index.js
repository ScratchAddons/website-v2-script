import fs from "fs-extra"
import yaml from "yaml"
import path from "path"
import chalkT from 'chalk-template';

export default (i18nLanguageDirPath, eni18nLanguageDirPath, ymlPath, options = {}) => {

	let languageCode = options.languageCode || undefined
	const translatedIndex = fs.existsSync(ymlPath) ? yaml.parse(fs.readFileSync(ymlPath, "utf-8")) : ["en"]

	if (!languageCode) {
		languageCode = path.basename(i18nLanguageDirPath)
	}
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	const i18nStrings = yaml.parse(fs.readFileSync(i18nLanguageDirPath + "hugo-i18n.yml", "utf-8"))

	if (!i18nStrings) return

	console.log(chalkT`Adding {inverse ${languageCodeHugo}} to the list of translated index page...`)
	translatedIndex.push(languageCodeHugo)
	fs.outputFileSync(ymlPath, yaml.stringify(translatedIndex, { lineWidth: 0 }))

}