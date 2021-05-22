const fs = require("fs-extra")
const globby = require("globby")
const yaml = require("yaml")
const chalk = require("chalk")
const htmlMinifier = require("html-minifier")

const allIndex = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])

module.exports = (hugoRepoPath, i18nRepoPath, options = {}) => {

	let contentGlobPatterns = options.contentGlobPatterns || ["**"]
	let translatableFrontMatterFields = options.translatableFrontMatterFields || []
	let excludedFrontMatterFields = options.excludedFrontMatterFields || []

	excludedFrontMatterFields.push("ignore_i18n")
	
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

			let fileLines = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
			// console.log(fileLines)
			let frontMatterSeparator = allIndex(fileLines, "---")
			let frontMatterPart = fileLines.slice(frontMatterSeparator[0] + 1, frontMatterSeparator[1])
			const frontMatter = yaml.parse(frontMatterPart.join("\n"))

			if (frontMatter.ignore_i18n && frontMatter.ignore_i18n === true || frontMatter.ignore_i18n === "all") return
			console.log(chalk`Parsing {inverse ${filePath}}...`)

			const frontMatterToTranslate = {}
			const frontMatterToKeep = {}
			Object.keys(frontMatter).forEach(key => {
				if (translatableFrontMatterFields.includes(key) && ! (frontMatter.ignore_i18n && frontMatter.ignore_i18n === "front-matter")) frontMatterToTranslate[key] = frontMatter[key]
				else if (!excludedFrontMatterFields.includes(key)) frontMatterToKeep[key] = frontMatter[key]
			})
			if (Object.keys(frontMatterToTranslate).length > 0) htmlFrontYaml[filePath] = frontMatterToTranslate
			if (Object.keys(frontMatterToKeep).length > 0) staticFrontYaml[filePath] = frontMatterToKeep

			// fs.outputFileSync(i18nRepoPath + "html-front/" + filePath + ".yml", yaml.stringify(frontMatterToTranslate))
			// if (Object.keys(frontMatterToKeep).length > 0) fs.outputFileSync(i18nRepoPath + "static-front/" + filePath + ".yml", yaml.stringify(frontMatterToKeep))

			let contentPart = fileLines.slice(frontMatterSeparator[1] + 1)			
			let contentMinified = htmlMinifier.minify(contentPart.join("\n"), {
				collapseWhitespace: true,
				conservativeCollapse: true,
				collapseInlineTagWhitespace: true,
				minifyCSS: true,
				minifyJS: true,
				preserveLineBreaks: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeEmptyAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				ignoreCustomFragments: [ /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/, /\{\{.+\}\}/ ],
				processScripts: [ "application/ld+json" ]
			}).replace(/(\n|^)(\{\{.+\}\})(\n|$)/g, '$1<script type="text/javascript+hugowrapper">$2</script>$3')
			if (frontMatter.ignore_i18n && frontMatter.ignore_i18n === "content") fs.outputFileSync(i18nRepoPath + "html-content/" + filePath, contentMinified)
			else fs.outputFileSync(i18nRepoPath + "static-html-content/" + filePath, contentMinified)

		})

		if (Object.keys(htmlFrontYaml).length > 0) fs.outputFileSync(i18nRepoPath + "html-front.yml", yaml.stringify(htmlFrontYaml))

	})()

	;(() => {

		let files = contentFiles.filter(path => path.endsWith(".md"))

		files.forEach(file => {
			let filePath = file.replace(hugoRepoPath + "content/", "")

			let fileLines = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
			let frontMatterSeparator = allIndex(fileLines, "---")
			let frontMatterPart = fileLines.slice(frontMatterSeparator[0] + 1, frontMatterSeparator[1])
			const frontMatter = yaml.parse(frontMatterPart.join("\n"))

			if (frontMatter.ignore_i18n && frontMatter.ignore_i18n === true || frontMatter.ignore_i18n === "all") return
			console.log(chalk`Parsing {inverse ${filePath}}...`)

			const frontMatterToTranslate = {}
			const frontMatterToKeep = {}
			Object.keys(frontMatter).forEach(key => {
				if (translatableFrontMatterFields.includes(key) && ! (frontMatter.ignore_i18n && frontMatter.ignore_i18n === "front-matter")) frontMatterToTranslate[key] = frontMatter[key]
				else if (!excludedFrontMatterFields.includes(key)) frontMatterToKeep[key] = frontMatter[key]
			})
			if (Object.keys(frontMatterToKeep).length > 0) staticFrontYaml[filePath] = frontMatterToKeep	

			let contentPart = fileLines.slice(frontMatterSeparator[1] + 1)

			let fileOutput = [
				"---",
				yaml.stringify(frontMatterToTranslate).trim(),
				"---",
				contentPart.join("\n")
			].join("\n")

			if (frontMatter.ignore_i18n && frontMatter.ignore_i18n === "content") fs.outputFileSync(i18nRepoPath + "static-markdown/" + filePath, fileOutput)
			else fs.outputFileSync(i18nRepoPath + "static-markdown/" + filePath, fileOutput)


		})

		if (Object.keys(staticFrontYaml).length > 0) fs.outputFileSync(i18nRepoPath + "static-front.yml", yaml.stringify(staticFrontYaml))

	})()

	;(() => {
		console.log(chalk`Copying Hugo i18n strings file...`)

		fs.copyFileSync(hugoRepoPath + "i18n/en.yaml", i18nRepoPath + "hugo-i18n.yml")
	})()

	console.log("Compiling done!")

}