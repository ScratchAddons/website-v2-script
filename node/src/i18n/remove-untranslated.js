import fs from "fs-extra"
import { globbySync } from "globby"
import path from "path"
import chalk from 'chalk-template';
import yaml from "yaml"
import stringSimilarity from "string-similarity"
import { removeSimilarEntries } from "../recursive-object-functions.js"

export default (i18nLanguageDirPath, eni18nLanguageDirPath, options = {}) => {

	let languageCode = options.languageCode || path.basename(i18nLanguageDirPath)

	console.log(chalk`Removing untranslated files on {inverse ${languageCode}}...`)

	let globPatterns = options.globPatterns || ["**"]

	const filesEn = globbySync(globPatterns.map(pattern => eni18nLanguageDirPath + pattern))
	const filesLang = globbySync(globPatterns.map(pattern => i18nLanguageDirPath + pattern))

	const filesRelEn = filesEn.map(path => path.slice(eni18nLanguageDirPath.length))
	const filesRelLang = filesLang.map(path => path.slice(i18nLanguageDirPath.length))

	filesRelLang.forEach(filePath => {
		if (!filesRelEn.includes(filePath)) {
			console.log(chalk`{inverse ${i18nLanguageDirPath}${filePath}} is not found on English. Removing...`)
			fs.removeSync(i18nLanguageDirPath + filePath)
		}
	})

	filesRelEn.forEach(filePath => {

		if (!fs.existsSync(i18nLanguageDirPath + filePath)) return

		if (filePath === "hugo-i18n.yml" || filePath === "html-front.yml" || filePath === "contributor-types.yml") {

			let result = removeSimilarEntries(
				yaml.parse(fs.readFileSync(i18nLanguageDirPath + filePath, "utf-8")),
				yaml.parse(fs.readFileSync(eni18nLanguageDirPath + filePath, "utf-8"))
			)

			if (JSON.stringify(result) === JSON.stringify(yaml.parse(fs.readFileSync(i18nLanguageDirPath + filePath, "utf-8")))) return

			console.log(chalk`Removing untranslated strings on {inverse ${i18nLanguageDirPath}${filePath}}...`)

			if (result && Object.keys(result).length) fs.writeFileSync(i18nLanguageDirPath + filePath, yaml.stringify(result, { lineWidth: 0 }))
			else fs.writeFileSync(i18nLanguageDirPath + filePath, "")

		// } else if (filePath === "html-front.yml") {

		// 	console.log(chalkT`Removing unused strings on {inverse ${i18nLanguageDirPath}${filePath}}...`)

		// 	let result = yaml.parse(fs.readFileSync(i18nLanguageDirPath + "html-front.yml", "utf-8"))

		// 	Object.keys(result).forEach(path => {
		// 		if (!fs.existsSync(i18nLanguageDirPath + "html-content/" + path) && !fs.existsSync(eni18nLanguageDirPath + "static-html-content/" + path)) delete result[path]
		// 	})

		// 	if (Object.keys(result).length) fs.writeFileSync(i18nLanguageDirPath + "html-front.yml", yaml.stringify(result, { lineWidth: 0 }))
		// 	else fs.writeFileSync(i18nLanguageDirPath + "html-front.yml", "")

		} else {

			if (
				fs.readFileSync(eni18nLanguageDirPath + filePath, "utf-8").trim() === fs.readFileSync(i18nLanguageDirPath + filePath, "utf-8").trim() ||
				stringSimilarity.compareTwoStrings(fs.readFileSync(eni18nLanguageDirPath + filePath, "utf-8").trim(), fs.readFileSync(i18nLanguageDirPath + filePath, "utf-8").trim()) === 1
			) {
				console.log(chalk`{inverse ${i18nLanguageDirPath}${filePath}} is similar. Removing...`)
				fs.removeSync(i18nLanguageDirPath + filePath)
			// } else {
			// 	console.log(i18nLanguageDirPath + filePath + " is different")
			}
	
		}

	})

}

