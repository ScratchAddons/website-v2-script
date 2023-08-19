import fs from "fs-extra"
import { globbySync } from "globby"
import path from "path"
import chalk from 'chalk-template';
import yaml from "yaml"
import { addMissingEntries } from "../recursive-object-functions.js"

export default (i18nLanguageDirPath, eni18nLanguageDirPath, hugoRepoPath, options = {}) => {

	let languageCode = options.languageCode || undefined
	let contentGlobPatterns = options.contentGlobPatterns || ["**"]
	// let translatableFrontMatterFields = options.translatableFrontMatterFields || []
	let pathTranslationExceptionRegexPatterns = options.pathTranslationExceptionRegexPatterns || []
	
	fs.ensureDirSync(hugoRepoPath)

	if (!languageCode) languageCode = path.basename(i18nLanguageDirPath)
	const languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

	console.log(chalk`Compiling {inverse ${languageCodeHugo}} from i18n repo format into Hugo format...`)

	let enHtmlFrontYaml = fs.existsSync(eni18nLanguageDirPath + "html-front.yml") ? yaml.parse(fs.readFileSync(eni18nLanguageDirPath + "html-front.yml", {encoding: "utf-8"})) : {}
	let htmlFrontYaml = fs.existsSync(i18nLanguageDirPath + "html-front.yml") ? yaml.parse(fs.readFileSync(i18nLanguageDirPath + "html-front.yml", {encoding: "utf-8"})) : {}
	let staticFrontYaml = fs.existsSync(eni18nLanguageDirPath + "static-front.yml") ? yaml.parse(fs.readFileSync(eni18nLanguageDirPath + "static-front.yml", {encoding: "utf-8"})) : {}

	for (const page in staticFrontYaml) {
		if (staticFrontYaml[page].aliases) staticFrontYaml[page].aliases = staticFrontYaml[page].aliases.map(alias => "/" + languageCodeHugo + alias)
	}

	htmlFrontYaml = addMissingEntries(htmlFrontYaml, enHtmlFrontYaml)

	const inputTestPath = [i18nLanguageDirPath + "html-content/", i18nLanguageDirPath + "markdown/"]
	const filesTest = globbySync(contentGlobPatterns.map(pattern => inputTestPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".md") || path.endsWith(".html")).length

	if (!filesTest) {
		console.log('No HTML and Markdown files that are translated. Skipping these!')
	}

	if (filesTest) (() => {

		const inputContentPath = [i18nLanguageDirPath + "html-content/"]
		const files = globbySync(contentGlobPatterns.map(pattern => inputContentPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".html")).map(path => path.replace(i18nLanguageDirPath, ''))

		const enInputContentPath = [eni18nLanguageDirPath + "html-content/", eni18nLanguageDirPath + "static-html-content/"]
		const enFiles = globbySync(contentGlobPatterns.map(pattern => enInputContentPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".html")).map(path => path.replace(eni18nLanguageDirPath, ''))

		// console.log(inputContentPath, files, enInputContentPath, enFiles)

		enFiles.forEach(enFile => {

			let filePath = enFile.split("html-content/")[1]
			let useEn = false
			let file = i18nLanguageDirPath + enFile

			if (!files.includes(enFile) || fs.readFileSync(file, {encoding: "utf-8"}).includes("504 Gateway Time-out")) {
				file = eni18nLanguageDirPath + enFile
				useEn = true
			}

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

	if (filesTest) (() => {

		const inputMarkdownPath = [i18nLanguageDirPath + "markdown/"]
		const files = globbySync(contentGlobPatterns.map(pattern => inputMarkdownPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".md")).map(path => path.replace(i18nLanguageDirPath, ''))

		const enInputMarkdownPath = [eni18nLanguageDirPath + "markdown/", eni18nLanguageDirPath + "static-markdown/"]
		const enFiles = globbySync(contentGlobPatterns.map(pattern => enInputMarkdownPath.map(path => path + pattern)).flat()).filter(path => path.endsWith(".md")).map(path => path.replace(eni18nLanguageDirPath, ''))

		enFiles.forEach(enFile => {
			let filePath = enFile.split("markdown/")[1]
			let useEn = false
			let file = i18nLanguageDirPath + enFile

			if (!files.includes(enFile) || fs.readFileSync(file, {encoding: "utf-8"}).includes("504 Gateway Time-out")) {
				file = eni18nLanguageDirPath + enFile
				useEn = true
			}

			filePath = file.split("markdown/")[1]

			if (useEn) console.log(chalk`Compiling {inverse ${filePath}} (using English)...`)
			else console.log(chalk`Compiling {inverse ${filePath}}...`)

			let output = fs.readFileSync(file, {encoding: "utf-8"})

			output = output.split("\n---\n")

			if (staticFrontYaml[filePath] !== false && typeof staticFrontYaml[filePath] !== "undefined") {
				output[0] += "\n" + yaml.stringify(staticFrontYaml[filePath], { lineWidth: 0 }).trim()
			}

			if (output[1]) {

				// Sanitize by converting 
				const excludedTags = ["title", "textarea", "style", "xmp", "iframe", "noembed", "noframes", "script", "plaintext"]

				output[1] = output[1]

					// Sanitize elements with excluded tags.
					.replace(new RegExp(`<(\/?\s*?)(${excludedTags.join("|")})(.*?)>`, "gi"), "&lt;$1$2$3>")

					// Translate paths to their respective languages
					.replace(/(?<!!)\[([^\[]+)\]\((.*)\)/g, (match, linkText, linkHref) => {
						if (!linkHref.startsWith('/')) return match
						if (pathTranslationExceptionRegexPatterns.some(pattern => {
							return new RegExp(pattern, "g").test(linkHref)
						})) return match
						return `[${linkText}](/${languageCodeHugo}${linkHref})`
					})
	

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

		fs.ensureDirSync(`${hugoRepoPath}i18n/`)
		fs.copyFileSync(i18nLanguageDirPath + "hugo-i18n.yml", hugoRepoPath + `i18n/${languageCodeHugo}.yaml`)
	})()

	;(() => {
		if (!fs.existsSync(i18nLanguageDirPath + "addons-data.json")) return
		console.log(chalk`Copying addons data...`)

		fs.ensureDirSync(`${hugoRepoPath}data/addons/`)
		fs.copyFileSync(i18nLanguageDirPath + "addons-data.json", hugoRepoPath + `data/addons/${languageCodeHugo}.json`)
	})()

	;(() => {
		if (!fs.existsSync(i18nLanguageDirPath + "contributor-types.yml")) return
		console.log(chalk`Copying contributor types file...`)

		fs.ensureDirSync(hugoRepoPath + 'data/credits/contributortypes/description/')
		fs.copyFileSync(i18nLanguageDirPath + "contributor-types.yml", hugoRepoPath + `data/credits/contributortypes/description/${languageCodeHugo}.yml`)
	})()

	;(() => {
		if (!fs.existsSync(i18nLanguageDirPath + "changelog.yml")) return
		console.log(chalk`Copying translatable changelog file...`)

		fs.ensureDirSync(hugoRepoPath + 'data/changelogi18n/')
		fs.copyFileSync(i18nLanguageDirPath + "changelog.yml", hugoRepoPath + `data/changelogi18n/${languageCodeHugo}.yml`)
	})()

	console.log("Compiling done!")

}