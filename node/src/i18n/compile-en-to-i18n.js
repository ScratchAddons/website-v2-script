const fs = require("fs-extra")
const globby = require("globby")
const yaml = require("yaml")
const chalk = require("chalk")

module.exports = (hugoRepoPath, i18nRepoPath) => {
	
	fs.ensureDir(i18nRepoPath)

	// console.log("Compiling en from Hugo format into i18n repo format...")

	// const allIndex = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])

	// ;(() => {
	// 	const files = globby.sync(hugoRepoPath + "content/"+ "**/*.html")

	// 	files.forEach(file => {
	// 		let filePath = file.replace(hugoRepoPath + "content/", "")
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
	// 		fs.outputFileSync(i18nRepoPath + "html-front/" + filePath + ".yml", yaml.stringify(frontMatter))
	// 		fs.outputFileSync(i18nRepoPath + "html-content/" + filePath, contentPart.join("\r\n"))
	// 	})
	// })()

	// ;(() => {
	// 	const files = globby.sync(hugoRepoPath + "content/" + "**/*.md")

	// 	files.forEach(file => {
	// 		let filePath = file.replace(hugoRepoPath + "content/", "")
	// 		console.log(chalk`Copying {inverse ${filePath}}...`)

	// 		let fileLines = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
	// 		fs.outputFileSync(i18nRepoPath + "markdown/" + filePath, fileLines.join("\r\n"))
	// 	})
	// })()

	;(() => {
		console.log(chalk`Copying Hugo i18n strings file...`)

		fs.copyFileSync(hugoRepoPath + "i18n/en.yaml", i18nRepoPath + "hugo-i18n.yml")
	})()

	console.log("Compiling done!")

}