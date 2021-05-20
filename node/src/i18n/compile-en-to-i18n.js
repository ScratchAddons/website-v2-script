const fs = require("fs-extra")
const globby = require("globby")
const yaml = require("yaml")
const chalk = require("chalk")

const allIndex = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])

module.exports = (hugoRepoPath, i18nRepoPath, options = {}) => {

	let contentGlobPatterns = options.contentGlobPatterns || ["**"]
	let translatableFrontMatterFields = options.translatableFrontMatterFields || []
	let excludedFrontMatterFields = options.excludedFrontMatterFields || []
	
	fs.ensureDir(i18nRepoPath)

	console.log("Compiling en from Hugo format into i18n repo format...")

	console.log(contentGlobPatterns.map(pattern => hugoRepoPath + "content/" + pattern))
	let contentFiles = globby.sync(contentGlobPatterns.map(pattern => hugoRepoPath + "content/" + pattern))
	let staticFrontYaml = {}

	;(() => { 
	
		let files = contentFiles.filter(path => path.endsWith(".html"))
		let htmlFrontYaml = {}

		files.forEach(file => {
			let filePath = file.replace(hugoRepoPath + "content/", "")
			console.log(chalk`Parsing {inverse ${filePath}}...`)

			let fileLines = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
			// console.log(fileLines)
			let frontMatterSeparator = allIndex(fileLines, "---")
			let frontMatterPart = fileLines.slice(frontMatterSeparator[0] + 1, frontMatterSeparator[1])
			const frontMatter = yaml.parse(frontMatterPart.join("\n"))
			if (frontMatter.ignore_i18n) {
				if (frontMatter.ignore_i18n === true) return
				delete frontMatter.ignore_i18n
			}
			let contentPart = fileLines.slice(frontMatterSeparator[1] + 1)			
			fs.outputFileSync(i18nRepoPath + "html-content/" + filePath, contentPart.join("\n"))

			const frontMatterToTranslate = {}
			const frontMatterToKeep = {}
			Object.keys(frontMatter).forEach(key => {
				if (translatableFrontMatterFields.includes(key)) frontMatterToTranslate[key] = frontMatter[key]
				else if (!excludedFrontMatterFields.includes(key)) frontMatterToKeep[key] = frontMatter[key]
			})
			htmlFrontYaml[filePath] = frontMatterToTranslate
			if (Object.keys(frontMatterToKeep).length > 0) staticFrontYaml[filePath] = frontMatterToKeep
			// fs.outputFileSync(i18nRepoPath + "html-front/" + filePath + ".yml", yaml.stringify(frontMatterToTranslate))
			// if (Object.keys(frontMatterToKeep).length > 0) fs.outputFileSync(i18nRepoPath + "static-front/" + filePath + ".yml", yaml.stringify(frontMatterToKeep))
		})

		fs.outputFileSync(i18nRepoPath + "html-front.yml", yaml.stringify(htmlFrontYaml))

	})()

	;(() => {

		let files = contentFiles.filter(path => path.endsWith(".md"))

		files.forEach(file => {
			let filePath = file.replace(hugoRepoPath + "content/", "")
			console.log(chalk`Parsing {inverse ${filePath}}...`)

			let fileLines = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)

			let frontMatterSeparator = allIndex(fileLines, "---")
			let frontMatterPart = fileLines.slice(frontMatterSeparator[0] + 1, frontMatterSeparator[1])
			const frontMatter = yaml.parse(frontMatterPart.join("\n"))
			if (frontMatter.ignore_i18n) {
				if (frontMatter.ignore_i18n === true) return
				delete frontMatter.ignore_i18n
			}
			let contentPart = fileLines.slice(frontMatterSeparator[1] + 1)

			const frontMatterToTranslate = {}
			const frontMatterToKeep = {}
			Object.keys(frontMatter).forEach(key => {
				if (translatableFrontMatterFields.includes(key)) frontMatterToTranslate[key] = frontMatter[key]
				else if (!excludedFrontMatterFields.includes(key)) frontMatterToKeep[key] = frontMatter[key]
			})

			if (Object.keys(frontMatterToKeep).length > 0) staticFrontYaml[filePath] = frontMatterToKeep
			fs.outputFileSync(i18nRepoPath + "markdown/" + filePath, [
				"---",
				yaml.stringify(frontMatterToTranslate).trim(),
				"---",
				contentPart.join("\n")
			].join("\n"))
		})

	})()

	if (Object.keys(staticFrontYaml).length > 0) fs.outputFileSync(i18nRepoPath + "static-front.yml", yaml.stringify(staticFrontYaml))

	;(() => {
		console.log(chalk`Copying Hugo i18n strings file...`)

		fs.copyFileSync(hugoRepoPath + "i18n/en.yaml", i18nRepoPath + "hugo-i18n.yml")
	})()

	console.log("Compiling done!")

}