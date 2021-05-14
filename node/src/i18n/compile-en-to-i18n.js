const fs = require("fs-extra")
const globby = require("globby")
const yaml = require("yaml")
const chalk = require("chalk")

module.exports = (inputPath, outputPath) => {
	
	fs.ensureDir(outputPath)

	console.log("Compiling en from Hugo format into i18n repo format...")

	// const allIndex = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])

	// ;(() => {
	// 	const files = globby.sync(inputPath + "content/"+ "**/*.html")

	// 	files.forEach(file => {
	// 		let filePath = file.replace(inputPath + "content/", "")
	// 		console.log(chalk`Separating {inverse ${filePath}}...`)

	// 		let fileLines = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
	// 		// console.log(fileLines)
	// 		let frontMatterSeparator = allIndex(fileLines, "---")
	// 		let frontMatterPart = fileLines.slice(frontMatterSeparator[0] + 1, frontMatterSeparator[1])
	// 		const frontMatter = yaml.parse(frontMatterPart.join("\n"))
	// 		if (frontMatter.ignore_i18n) {
	// 			if (frontMatter.ignore_i18n === true) return
	// 			delete frontMatter.ignore_i18n
	// 		}
	// 		let contentPart = fileLines.slice(frontMatterSeparator[1] + 1)
	// 		fs.outputFileSync(outputPath + "html-front/" + filePath + ".yml", yaml.stringify(frontMatter))
	// 		fs.outputFileSync(outputPath + "html-content/" + filePath, contentPart.join("\r\n"))
	// 	})
	// })()

	// ;(() => {
	// 	const files = globby.sync(inputPath + "content/" + "**/*.md")

	// 	files.forEach(file => {
	// 		let filePath = file.replace(inputPath + "content/", "")
	// 		console.log(chalk`Copying {inverse ${filePath}}...`)

	// 		let fileLines = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
	// 		fs.outputFileSync(outputPath + "markdown/" + filePath, fileLines.join("\r\n"))
	// 	})
	// })()

	;(() => {
		console.log(chalk`Copying Hugo i18n strings file...`)

		fs.copyFileSync(inputPath + "i18n/en.yaml", outputPath + "hugo-i18n.yml")
	})()

	console.log("Compiling done!")

}