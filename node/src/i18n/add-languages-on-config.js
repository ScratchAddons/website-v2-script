import fs from "fs-extra"
import yaml from "yaml"
import path from "path"
import chalk from 'chalk';

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

export default (i18nLanguageDirPath, configPath, options = {}) => {

	let languageCode = options?.languageCode

	if (!languageCode) {
		languageCode = path.basename(i18nLanguageDirPath)
	}
	const languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	console.log(`Adding ${chalk.inverse(languageCodeHugo)} to the site config...`)

	const languageName = getLanguageDisplayName(languageCodeHugo)

	const config = yaml.parse(fs.readFileSync(configPath, "utf-8"))
	config.languages[languageCodeHugo] = {
		languageName,
		weight: 2,
		contentDir: "content-i18n/" + languageCodeHugo
	}
	fs.writeFileSync(configPath, yaml.stringify(config, { lineWidth: 0 }))

}