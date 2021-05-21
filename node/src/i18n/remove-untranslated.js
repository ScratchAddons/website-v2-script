const fs = require("fs-extra")
const globby = require("globby")
const path = require("path")
const chalk = require("chalk")
// const scmp = require("scmp")

module.exports = (i18nLanguageDirPath, eni18nLanguageDirPath, options = {}) => {

	let languageCode = options.languageCode || path.basename(i18nLanguageDirPath)

	console.log(chalk`Removing untranslated files on {inverse ${languageCode}}...`)

	let globPatterns = options.globPatterns || ["**"]

	const files = globby.sync(globPatterns.map(pattern => eni18nLanguageDirPath + pattern))

	files.forEach(file => {

		let filePath = file.replace(eni18nLanguageDirPath, "")

		if (!fs.existsSync(i18nLanguageDirPath + filePath)) return

		if (fs.readFileSync(eni18nLanguageDirPath + filePath, "utf-8").trim() === fs.readFileSync(i18nLanguageDirPath + filePath, "utf-8").trim()) {
			console.log(chalk`{inverse ${i18nLanguageDirPath}${filePath}} is similar. Removing...`)
			fs.removeSync(i18nLanguageDirPath + filePath)
		} else {
			// console.log(i18nLanguageDirPath + filePath + " is different")
		}

		// if (scmp(fs.readFileSync(eni18nLanguageDirPath + filePath), fs.readFileSync(i18nLanguageDirPath + filePath))) {
		// 	console.log(filePath + " is similar")
		// } else {
		// 	console.log(filePath + " is different")
		// }

	})

}

