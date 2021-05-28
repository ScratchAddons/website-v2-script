const fs = require("fs-extra")
const globby = require("globby")
const path = require("path")
const chalk = require("chalk")
const yaml = require("yaml")

module.exports = (i18nLanguageDirPath, eni18nLanguageDirPath, hugoRepoPath, options = {}) => {

	let languageCode = options.languageCode || undefined
	let contentGlobPatterns = options.contentGlobPatterns || ["**"]
	// let translatableFrontMatterFields = options.translatableFrontMatterFields || []
	
	fs.ensureDir(hugoRepoPath)

	if (!languageCode) languageCode = path.basename(i18nLanguageDirPath)
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	console.log(chalk`Compiling {inverse ${languageCodeHugo}} from i18n repo format into Hugo format...`)

	let htmlFrontYaml = fs.existsSync(i18nLanguageDirPath + "html-front.yml") ? yaml.parse(fs.readFileSync(i18nLanguageDirPath + "html-front.yml", {encoding: "utf-8"})) : {}
	let staticFrontYaml = fs.existsSync(eni18nLanguageDirPath + "static-front.yml") ? yaml.parse(fs.readFileSync(eni18nLanguageDirPath + "static-front.yml", {encoding: "utf-8"})) : {}

	;(() => {
		const inputContentPath = [i18nLanguageDirPath + "html-content/", i18nLanguageDirPath + "static-html-content/"]
		const files = globby.sync(contentGlobPatterns.map(pattern => inputContentPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".html"))

		files.forEach(file => {
			let filePath = file.split("html-content/")[1]
			console.log(chalk`Parsing {inverse ${filePath}}...`)
		
			const output = [
				"---",
				...((typeof htmlFrontYaml[filePath] !== "undefined") ? yaml.stringify(htmlFrontYaml[filePath]).trim().split(/\r?\n/) : []),
				...((typeof staticFrontYaml[filePath] !== "undefined") ? yaml.stringify(staticFrontYaml[filePath]).trim().split(/\r?\n/) : []),
				"---",
				...fs.readFileSync(file, {encoding: "utf-8"})
					.replace(/<script type="text\/javascript\+hugowrapper">(.+)<\/script>/g, "$1")
					.replace(/https:\/\/scratchaddons\.com\/(.+?)#hugo-link-placeholder-(ref|relref)/g, "{{< $2 \"/$1\" >}}")
					.replace(/https:\/\/scratchaddons\.com#(.+?)_hugo-link-placeholder-(ref|relref)/g, "{{< $2 \"$1\" >}}")
					.split(/\r?\n/)
			]

			fs.outputFileSync(`${hugoRepoPath}content-i18n/${languageCodeHugo}/${filePath}`, output.join("\n"))

		})
	})()

	;(() => {	
		const inputMarkdownPath = [i18nLanguageDirPath + "markdown/", i18nLanguageDirPath + "static-markdown/"]
		const files = globby.sync(contentGlobPatterns.map(pattern => inputMarkdownPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".md"))

		files.forEach(file => {
			let filePath = file.split("markdown/")[1]
			console.log(chalk`Parsing {inverse ${filePath}}...`)

			let output = fs.readFileSync(file, {encoding: "utf-8"})

			if (typeof staticFrontYaml[filePath] !== "undefined") {
				output = output.split("\n---\n")
				output[0] += "\n" + yaml.stringify(staticFrontYaml[filePath]).trim()
				output = output.join("\n---\n")
			}

			let occurence = 0
			fs.outputFileSync(
				`${hugoRepoPath}content-i18n/${languageCodeHugo}/${filePath}`,
				output
			)
		})
	})()

	;(() => {
		console.log(chalk`Copying Hugo i18n strings file...`)

		fs.ensureDirSync(`${hugoRepoPath}i18n/`)
		fs.copyFileSync(i18nLanguageDirPath + "hugo-i18n.yml", hugoRepoPath + `i18n/${languageCodeHugo}.yaml`)
	})()

	;(() => {
		if (!fs.existsSync(i18nLanguageDirPath + "addons-data.json")) return
		console.log(chalk`Copying addons data...`)

		fs.ensureDirSync(`${hugoRepoPath}data/addons/`)
		fs.copyFileSync(i18nLanguageDirPath + "addons-data.json", hugoRepoPath + `data/addons/${languageCodeHugo}.json`)
	})()

	console.log("Compiling done!")

}