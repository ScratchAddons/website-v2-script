const fs = require("fs-extra")
const globby = require("globby")
const path = require("path")
const chalk = require("chalk")

module.exports = (inputPath, outputPath, languageCode) => {
	
	fs.ensureDir(outputPath)

	if (!languageCode) languageCode = path.basename(inputPath)
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	console.log(chalk`Compiling {inverse ${languageCodeHugo}} from i18n repo format into Hugo format...`)

	;(() => {
		const inputContentPath = inputPath + "html-content/"
		const files = globby.sync(inputContentPath + "**/*.html")

		files.forEach(file => {
			let filePath = file.replace(inputContentPath, "")
			console.log(chalk`Merging {inverse ${filePath}}...`)
		
			const output = [
				"---",
				...fs.readFileSync(file.replace("content", "front") + ".yml", {encoding: "utf-8"}).split(/\r?\n/),
				"---",
				...fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
			]

			fs.outputFileSync(`${outputPath}content-i18n/${languageCodeHugo}/${filePath}`, output.join("\r\n"))

		})
	})()

	;(() => {	
		const inputMarkdownPath = inputPath + "markdown/"
		const files = globby.sync(inputMarkdownPath + "**/*.md")

		files.forEach(file => {
			let filePath = file.replace(inputMarkdownPath, "")
			console.log(chalk`Copying {inverse ${filePath}}...`)

			fs.outputFileSync(`${outputPath}content-i18n/${languageCodeHugo}/${filePath}`, fs.readFileSync(file, {encoding: "utf-8"}))
		})
	})()

	;(() => {
		console.log(chalk`Copying Hugo i18n strings file...`)

		fs.ensureDirSync(`${outputPath}i18n/`)
		fs.copyFileSync(inputPath + "hugo-i18n.yml", outputPath + `i18n/${languageCodeHugo}.yaml`)
	})()

	console.log("Compiling done!")

}