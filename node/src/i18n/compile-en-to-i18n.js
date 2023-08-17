import fs from "fs-extra"
import { globbySync } from "globby"
import yaml from "yaml"
import chalk from 'chalk-template';
import htmlMinifier from "html-minifier"

const minifierOptions = {
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
}

const allIndex = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])

const buildIgnoreI18n = ignoreI18nRaw => {
	const ignoreI18n = {
		frontMatter: false,
		content: false
	}

	switch (ignoreI18nRaw) {
		case true:
		case "all":
			ignoreI18n.frontMatter = true
			ignoreI18n.content = true				
			break
		case "front-matter":
			ignoreI18n.frontMatter = true
			break
		case "content":
			ignoreI18n.content = true
			break
	}

	return ignoreI18n
}

export default (hugoRepoPath, i18nRepoPath, options = {}) => {

	let contentGlobPatterns = options.contentGlobPatterns || ["**"]
	let translatableFrontMatterFields = options.translatableFrontMatterFields || []
	let excludedFrontMatterFields = options.excludedFrontMatterFields || []

	excludedFrontMatterFields.push("ignore_i18n")
	
	fs.ensureDir(i18nRepoPath)

	console.log("Compiling en from Hugo format into i18n repo format...")

	console.log(contentGlobPatterns.map(pattern => hugoRepoPath + "content/" + pattern))
	let contentFiles = globbySync(contentGlobPatterns.map(pattern => {
		if (pattern.startsWith("!")) return "!" + hugoRepoPath + "content/" + pattern.slice("1")
		return hugoRepoPath + "content/" + pattern
	}))
	let staticFrontYaml = {}

	;(() => { 
	
		let files = contentFiles.filter(path => path.endsWith(".html"))
		let htmlFrontYaml = {}

		files.forEach(file => {
			let filePath = file.replace(hugoRepoPath + "content/", "")

			let fileLines = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
			// console.log(fileLines)
			let frontMatterSeparator = allIndex(fileLines, "---")

			if (frontMatterSeparator.length >= 2) {

				let frontMatterPart = fileLines.slice(frontMatterSeparator[0] + 1, frontMatterSeparator[1])
				const frontMatter = yaml.parse(frontMatterPart.join("\n"))
				const ignoreI18n = buildIgnoreI18n(frontMatter?.ignore_i18n)
	
				if (ignoreI18n.frontMatter && ignoreI18n.content) return
				console.log(chalk`Compiling {inverse ${filePath}}...`)
	
				if (frontMatter) {

					const frontMatterToTranslate = {}
					const frontMatterToKeep = {}
					Object.keys(frontMatter).forEach(key => {
						if (translatableFrontMatterFields.includes(key) && !ignoreI18n.frontMatter) frontMatterToTranslate[key] = frontMatter[key]
						else if (!excludedFrontMatterFields.includes(key)) frontMatterToKeep[key] = frontMatter[key]
					})
					if (Object.keys(frontMatterToTranslate).length > 0) htmlFrontYaml[filePath] = frontMatterToTranslate
					if (Object.keys(frontMatterToKeep).length > 0) staticFrontYaml[filePath] = frontMatterToKeep	

				}
	
				// fs.outputFileSync(i18nRepoPath + "html-front/" + filePath + ".yml", yaml.stringify(frontMatterToTranslate, { lineWidth: 0 }))
				// if (Object.keys(frontMatterToKeep).length > 0) fs.outputFileSync(i18nRepoPath + "static-front/" + filePath + ".yml", yaml.stringify(frontMatterToKeep, { lineWidth: 0 }))
	
				let contentPart = fileLines.slice(frontMatterSeparator[1] + 1)			
				let contentMinified = htmlMinifier.minify(contentPart.join("\n"), minifierOptions)
					.replace(/(^|[\n>])(\{\{.+\}\})([\n<]|$)/g, '$1<script type="text/javascript+hugowrapper">$2</script>$3')
					.replace(/\"?\{\{< ?(ref|relref) "\/(.+?)" ?>\}\}\"?/g, "https://scratchaddons.com/$2#hugo-link-placeholder-$1")
					.replace(/\"?\{\{< ?(ref|relref) "(?!\/)(.+?)" ?>\}\}\"?/g, "https://scratchaddons.com#$2_hugo-link-placeholder-$1")
					.replace(/=(["'])(.+?)\{\{(.+?)\}\}/g, (match, p0, p1, p2, offset, string) => {
						return `=${p0}${p1}HESTART${encodeURI(p2)}HEEND`
					})
					.replace(/<script type="text\/javascript\+hugowrapper">HESTART(.+)HEEND<\/script>/g, (match, p1, offset, string) => {
						return '<script type="text/javascript+hugowrapper">{{' + decodeURI(p1) +'}}</script>'
					})
				if (ignoreI18n.content) fs.outputFileSync(i18nRepoPath + "static-html-content/" + filePath, contentMinified)
				else fs.outputFileSync(i18nRepoPath + "html-content/" + filePath, contentMinified)

			} else {

				console.log(chalk`Compiling {inverse ${filePath}}...`)
				staticFrontYaml[filePath] = false
				let contentMinified = htmlMinifier.minify(fileLines.join("\n"), minifierOptions)
				fs.outputFileSync(i18nRepoPath + "html-content/" + filePath, contentMinified)

			}

		})

		if (Object.keys(htmlFrontYaml).length > 0) fs.outputFileSync(i18nRepoPath + "html-front.yml", yaml.stringify(htmlFrontYaml, { lineWidth: 0 }))

	})()

	;(() => {

		let files = contentFiles.filter(path => path.endsWith(".md"))

		files.forEach(file => {
			let filePath = file.replace(hugoRepoPath + "content/", "")

			let fileLines = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
			let frontMatterSeparator = allIndex(fileLines, "---")

			if (frontMatterSeparator.length >= 2) {

				let frontMatterPart = fileLines.slice(frontMatterSeparator[0] + 1, frontMatterSeparator[1])
				const frontMatter = yaml.parse(frontMatterPart.join("\n"))
				const ignoreI18n = buildIgnoreI18n(frontMatter?.ignore_i18n)
	
				if (ignoreI18n.frontMatter && ignoreI18n.content) return
				console.log(chalk`Compiling {inverse ${filePath}}...`)
	
				const frontMatterToTranslate = {}
				const frontMatterToKeep = {}
				Object.keys(frontMatter).forEach(key => {
					if (translatableFrontMatterFields.includes(key) && !ignoreI18n.frontMatter) frontMatterToTranslate[key] = frontMatter[key]
					else if (!excludedFrontMatterFields.includes(key)) frontMatterToKeep[key] = frontMatter[key]
				})
				if (Object.keys(frontMatterToKeep).length > 0) staticFrontYaml[filePath] = frontMatterToKeep	
	
				let contentPart = fileLines.slice(frontMatterSeparator[1] + 1)
	
				let fileOutput = [
					"---",
					yaml.stringify(frontMatterToTranslate, { lineWidth: 0 }).trim(),
					"---",
					contentPart.join("\n")
				].join("\n")
	
				if (ignoreI18n.content) fs.outputFileSync(i18nRepoPath + "static-markdown/" + filePath, fileOutput)
				else fs.outputFileSync(i18nRepoPath + "markdown/" + filePath, fileOutput)

			} else {

				console.log(chalk`Compiling {inverse ${filePath}}...`)
				staticFrontYaml[filePath] = false
				fs.outputFileSync(i18nRepoPath + "markdown/" + filePath, fileOutput)
			}

		})

		if (Object.keys(staticFrontYaml).length > 0) fs.outputFileSync(i18nRepoPath + "static-front.yml", yaml.stringify(staticFrontYaml, { lineWidth: 0 }))

	})()

	;(() => {
		console.log(chalk`Copying Hugo i18n strings file...`)

		fs.copyFileSync(hugoRepoPath + "i18n/en.yaml", i18nRepoPath + "hugo-i18n.yml")
	})()

	;(() => {
		if (!fs.existsSync(hugoRepoPath + "data/credits/contributortypes/description/en.yml")) return

		console.log(chalk`Copying contributor types file...`)

		fs.copyFileSync(hugoRepoPath + "data/credits/contributortypes/description/en.yml", i18nRepoPath + "contributor-types.yml")
	})()

	console.log("Compiling done!")

}