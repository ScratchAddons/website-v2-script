const fs = require("fs-extra")
const globby = require("globby")
const path = require("path")
const chalk = require("chalk")

module.exports = (i18nLanguageDirPath, eni18nLanguageDirPath, options = {}) => {
	
	let languageCode = options.languageCode || undefined

	if (!languageCode) languageCode = path.basename(i18nLanguageDirPath)
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

    console.log(chalk`Preparing folders on {inverse ${languageCodeHugo}}...`)

	const folders = globby.sync(eni18nLanguageDirPath + "**", {
		onlyDirectories: true
	})

	folders.forEach(folder => {

		let folderPath = folder.split(eni18nLanguageDirPath)[1]
		// console.log(chalk`Ensuring {inverse ${folderPath}} exists...`)
		fs.ensureDirSync(i18nLanguageDirPath + folderPath)

	})

	// console.log("Preparation done!")

}