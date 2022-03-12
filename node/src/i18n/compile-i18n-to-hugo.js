const fs = require("fs-extra")
const globby = require("globby")
const path = require("path")
const chalk = require("chalk")
const yaml = require("yaml")
const { addMissingEntries } = require("../recursive-object-functions")

module.exports = (i18nLanguageDirPath, eni18nLanguageDirPath, hugoRepoPath, options = {}) => {

	let languageCode = options.languageCode || undefined
	let contentGlobPatterns = options.contentGlobPatterns || ["**"]
	// let translatableFrontMatterFields = options.translatableFrontMatterFields || []
	
	fs.ensureDirSync(hugoRepoPath)

	if (!languageCode) languageCode = path.basename(i18nLanguageDirPath)
	languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	console.log(chalk`Compiling {inverse ${languageCodeHugo}} from i18n repo format into Hugo format...`)

	let enHtmlFrontYaml = fs.existsSync(eni18nLanguageDirPath + "html-front.yml") ? yaml.parse(fs.readFileSync(eni18nLanguageDirPath + "html-front.yml", {encoding: "utf-8"})) : {}
	let htmlFrontYaml = fs.existsSync(i18nLanguageDirPath + "html-front.yml") ? yaml.parse(fs.readFileSync(i18nLanguageDirPath + "html-front.yml", {encoding: "utf-8"})) : {}
	let staticFrontYaml = fs.existsSync(eni18nLanguageDirPath + "static-front.yml") ? yaml.parse(fs.readFileSync(eni18nLanguageDirPath + "static-front.yml", {encoding: "utf-8"})) : {}

	htmlFrontYaml = addMissingEntries(htmlFrontYaml, enHtmlFrontYaml)

	;(() => {
		const inputContentPath = [i18nLanguageDirPath + "html-content/", eni18nLanguageDirPath + "static-html-content/"]
		const files = globby.sync(contentGlobPatterns.map(pattern => inputContentPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".html")).map(path => path.split(i18nLanguageDirPath)[0])

		const enInputContentPath = [eni18nLanguageDirPath + "html-content/", eni18nLanguageDirPath + "static-html-content/"]
		const enFiles = globby.sync(contentGlobPatterns.map(pattern => enInputContentPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".html")).map(path => path.split(eni18nLanguageDirPath)[0])

		enFiles.forEach(enFile => {

			let filePath = enFile.split("html-content/")[1]
			let useEn = false

			if (!files.includes(enFile)) {
				file = eni18nLanguageDirPath + enFile
				useEn = true
			} else file = i18nLanguageDirPath + enFile

			filePath = file.split("html-content/")[1]

			if (useEn) console.log(chalk`Compiling {inverse ${filePath}} (using English)...`)
			else console.log(chalk`Compiling {inverse ${filePath}}...`)

			let output

			if (staticFrontYaml[filePath] !== false) {

				output = [
					"---",
					...((typeof htmlFrontYaml[filePath] !== "undefined") ? yaml.stringify(htmlFrontYaml[filePath], { lineWidth: 0 }).trim().split(/\r?\n/) : []),
					...((typeof staticFrontYaml[filePath] !== "undefined") ? yaml.stringify(staticFrontYaml[filePath], { lineWidth: 0 }).trim().split(/\r?\n/) : []),
					"---",
					...fs.readFileSync(file, {encoding: "utf-8"})
						.replace(/<script type="text\/javascript\+hugowrapper">(.+)<\/script>/g, "$1")
						.replace(/https:\/\/scratchaddons\.com\/(.+?)#hugo-link-placeholder-(ref|relref)/g, "{{< $2 \"/$1\" >}}")
						.replace(/https:\/\/scratchaddons\.com#(.+?)_hugo-link-placeholder-(ref|relref)/g, "{{< $2 \"$1\" >}}")
						 // HOTFIX: Remove after all instance of &lt;a and tx_gtsymbol gone on i18n repo
						.replace(/tx_gtsymbol/g, ">").replace(/&lt;a/g, "<a")
						.replace(/HESTART(.+?)HEEND/g, (match, p2, offset, string) => {
							return `\{\{${decodeURI(p2)}\}\}`
						})
						.split(/\r?\n/)
				]
	
			} else {

				output = fs.readFileSync(file, {encoding: "utf-8"}).split(/\r?\n/)
			}
		
			fs.outputFileSync(`${hugoRepoPath}content-i18n/${languageCodeHugo}/${filePath}`, output.join("\n"))

		})
	})()

	;(() => {	
		const inputMarkdownPath = [i18nLanguageDirPath + "markdown/", i18nLanguageDirPath + "static-markdown/"]
		const files = globby.sync(contentGlobPatterns.map(pattern => inputMarkdownPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".md")).map(path => path.split(i18nLanguageDirPath)[0])

		const enInputMarkdownPath = [eni18nLanguageDirPath + "markdown/", eni18nLanguageDirPath + "static-markdown/"]
		const enFiles = globby.sync(contentGlobPatterns.map(pattern => enInputMarkdownPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".md")).map(path => path.split(eni18nLanguageDirPath)[0])

		enFiles.forEach(enFile => {
			let filePath = enFile.split("markdown/")[1]
			let useEn = false

			if (!files.includes(enFile)) {
				file = eni18nLanguageDirPath + enFile
				useEn = true
			} else file = i18nLanguageDirPath + enFile

			filePath = file.split("markdown/")[1]

			if (useEn) console.log(chalk`Compiling {inverse ${filePath}} (using English)...`)
			else console.log(chalk`Compiling {inverse ${filePath}}...`)

			let output = fs.readFileSync(file, {encoding: "utf-8"})

			output = output.split("\n---\n")

			if (staticFrontYaml[filePath] !== false && typeof staticFrontYaml[filePath] !== "undefined") {
				output[0] += "\n" + yaml.stringify(staticFrontYaml[filePath], { lineWidth: 0 }).trim()
			}

			if (output[1]) {

				const excludedTags = ["title", "textarea", "style", "xmp", "iframe", "noembed", "noframes", "script", "plaintext"]

				output[1] = output[1]
					.replace(new RegExp(`<(\/?\s*?)(${excludedTags.join("|")})(.*?)>`, "gi"), "&lt;$1$2$3>")

			}

			output = output.join("\n---\n")

			fs.outputFileSync(
				`${hugoRepoPath}content-i18n/${languageCodeHugo}/${filePath}`,
				output
			)
		})
	})()

	;(() => {
		console.log(chalk`Copying Hugo i18n strings file...`)

		// fs.ensureDirSync(`${hugoRepoPath}i18n/`)
		fs.copyFileSync(i18nLanguageDirPath + "hugo-i18n.yml", hugoRepoPath + `i18n/${languageCodeHugo}.yaml`)
	})()

	;(() => {
		if (!fs.existsSync(i18nLanguageDirPath + "addons-data.json")) return
		console.log(chalk`Copying addons data...`)

		// fs.ensureDirSync(`${hugoRepoPath}data/addons/`)
		fs.copyFileSync(i18nLanguageDirPath + "addons-data.json", hugoRepoPath + `data/addons/${languageCodeHugo}.json`)
	})()

	;(() => {
		if (!fs.existsSync(i18nLanguageDirPath + "contributor-types.yml")) return
		console.log(chalk`Copying contributor types file...`)

		// fs.ensureDirSync(hugoRepoPath + 'data/credits/contributortypes/description/')
		fs.copyFileSync(i18nLanguageDirPath + "contributor-types.yml", hugoRepoPath + `data/credits/contributortypes/description/${languageCodeHugo}.yml`)
	})()

	console.log("Compiling done!")

}