const fs = require("fs-extra")
const globby = require("globby")
const path = require("path")
const chalk = require("chalk")

module.exports = (i18nLanguageDirPath, hugoRepoPath, languageCode) => {
	
	fs.ensureDir(hugoRepoPath)

	if (!languageCode) languageCode = path.basename(i18nLanguageDirPath)
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	// console.log(chalk`Compiling {inverse ${languageCodeHugo}} from i18n repo format into Hugo format...`)

	// ;(() => {
	// 	const inputContentPath = i18nLanguageDirPath + "html-content/"
	// 	const files = globby.sync(inputContentPath + "**/*.html")

	// 	files.forEach(file => {
	// 		let filePath = file.replace(inputContentPath, "")
	// 		console.log(chalk`Merging {inverse ${filePath}}...`)
		
	// 		const output = [
	// 			"---",
	// 			...fs.readFileSync(file.replace("content", "front") + ".yml", {encoding: "utf-8"}).split(/\r?\n/),
	// 			"---",
	// 			...fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
	// 		]

	// 		fs.outputFileSync(`${hugoRepoPath}content-i18n/${languageCodeHugo}/${filePath}`, output.join("\r\n"))

	// 	})
	// })()

	// ;(() => {	
	// 	const inputMarkdownPath = i18nLanguageDirPath + "markdown/"
	// 	const files = globby.sync(inputMarkdownPath + "**/*.md")

	// 	files.forEach(file => {
	// 		let filePath = file.replace(inputMarkdownPath, "")
	// 		console.log(chalk`Copying {inverse ${filePath}}...`)

	// 		fs.outputFileSync(`${hugoRepoPath}content-i18n/${languageCodeHugo}/${filePath}`, fs.readFileSync(file, {encoding: "utf-8"}))
	// 	})
	// })()

	;(() => {
		console.log(chalk`Copying Hugo i18n strings file...`)

		fs.ensureDirSync(`${hugoRepoPath}i18n/`)
		fs.copyFileSync(i18nLanguageDirPath + "hugo-i18n.yml", hugoRepoPath + `i18n/${languageCodeHugo}.yaml`)
	})()

	// ;(() => {
	// 	console.log(chalk`Copying Hugo i18n strings file...`)

	// 	fs.ensureDirSync(`${hugoRepoPath}data/addons/`)
	// 	fs.copyFileSync(i18nLanguageDirPath + "addons-data.json", hugoRepoPath + `data/addons/${languageCodeHugo}.json`)
	// })()

	console.log("Compiling done!")

}