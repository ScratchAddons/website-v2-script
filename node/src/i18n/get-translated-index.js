const fs = require("fs-extra")
const yaml = require("yaml")
const path = require("path")
const chalk = require("chalk")

module.exports = (i18nLanguageDirPath, eni18nLanguageDirPath, ymlPath, options = {}) => {

	let languageCode = options.languageCode || undefined
	const translatedIndex = fs.existsSync(ymlPath) ? yaml.parse(fs.readFileSync(ymlPath, "utf-8")) : []

	if (!languageCode) {
		languageCode = path.basename(i18nLanguageDirPath)
	}
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	const i18nStrings = yaml.parse(i18nLanguageDirPath + "hugo-i18n.yml")

	if (!i18nStrings.IndexPage) return
	if (!i18nStrings.IndexPage.Intro) return
	if (!i18nStrings.IndexPage.Intro.Tagline) return
	if (!i18nStrings.IndexPage.Intro.IndexPage) return

	console.log(chalk`Adding {inverse ${languageCodeHugo}} to the list of translated index page...`)
	translatedIndex.push(languageCodeHugo)
	fs.outputFileSync(ymlPath, yaml.stringify(translatedIndex))

}