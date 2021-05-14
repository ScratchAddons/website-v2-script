const fs = require("fs-extra")
const yaml = require("yaml")
const path = require("path")
const chalk = require("chalk")

const getLanguageDisplayName = languageCode => {
	try {
		let intlObj = new Intl.DisplayNames([languageCode], {type: 'language'})
		if (intlObj.of(languageCode) === languageCode) {
			let intlObjEn = new Intl.DisplayNames(["en"], {type: 'language'})
			return intlObjEn.of(languageCode)
		}
		return intlObj.of(languageCode)
	} catch (e) {
		if (e instanceof RangeError) return languageCode
		else throw e
	}
}

module.exports = (langaugeJsonPath, configPath, languageCode) => {

	if (!languageCode) {
		const languageJsonPathPath = path.parse(langaugeJsonPath)
		languageCode = path.basename(languageJsonPathPath.dir)
	}
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	console.log(chalk`Adding {inverse ${languageCodeHugo}} to the site config...`)

	const languageName = getLanguageDisplayName(languageCodeHugo)

	const config = yaml.parse(fs.readFileSync(configPath, "utf-8"))
	config.languages[languageCodeHugo] = {
		languageName,
		weight: 2,
		contentDir: "content-i18n/" + languageCodeHugo
	}
	fs.writeFileSync(configPath, yaml.stringify(config))

	console.log("Done!")

}