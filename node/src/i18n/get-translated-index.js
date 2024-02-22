import fs from "fs-extra"
import yaml from "yaml"
import path from "path"
import chalk from 'chalk';

export default (i18nLanguageDirPath, eni18nLanguageDirPath, ymlPath, options = {}) => {

	let languageCode = options?.languageCode

	const prefixedLog = (...args) => {
		console.log(`${chalk.blue(languageCode)}:`, ...args)
	}

	const translatedIndex = fs.existsSync(ymlPath) ? yaml.parse(fs.readFileSync(ymlPath, "utf-8")) : ["en"]

	if (!languageCode) {
		languageCode = path.basename(i18nLanguageDirPath)
	}
	const languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	const i18nStrings = yaml.parse(fs.readFileSync(i18nLanguageDirPath + "hugo-i18n.yml", "utf-8"))

	if (!i18nStrings) return

	prefixedLog(`Adding ${chalk.inverse(languageCodeHugo)} to the list of translated index page...`)
	translatedIndex.push(languageCodeHugo)
	fs.outputFileSync(ymlPath, yaml.stringify(translatedIndex, { lineWidth: 0 }))

}