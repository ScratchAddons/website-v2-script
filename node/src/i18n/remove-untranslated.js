import fs from "fs-extra"
import { globby } from "globby"
import path from "path"
import chalk from 'chalk';
import yaml from "yaml"
import stringSimilarity from "string-similarity"
import { removeSimilarEntries } from "../recursive-object-functions.js"
import htmlMinifier from "html-minifier-terser"

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

export default async (i18nLanguageDirPath, eni18nLanguageDirPath, options = {}) => {

	let languageCode = options?.languageCode ?? path.basename(i18nLanguageDirPath)
	let globPatterns = options?.globPatterns ?? ["**"]

	const prefixedLog = (...args) => {
		console.log(`${chalk.blue(languageCode)}:`, ...args)
	}

	prefixedLog(`Removing untranslated files on ${chalk.inverse(languageCode)}...`)

	const filesEn = await globby(globPatterns.map(pattern => eni18nLanguageDirPath + pattern))
	const filesLang = await globby(globPatterns.map(pattern => i18nLanguageDirPath + pattern))

	const filesRelEn = filesEn.map(path => path.slice(eni18nLanguageDirPath.length))
	const filesRelLang = filesLang.map(path => path.slice(i18nLanguageDirPath.length))

	await Promise.all(filesRelLang.map(async filePath => {
		if (!filesRelEn.includes(filePath)) {
			prefixedLog(`${chalk.inverse(`${i18nLanguageDirPath}${filePath}`)} is not found on English. Removing...`)
			await fs.remove(i18nLanguageDirPath + filePath)
		}
	}))

	await Promise.all(filesRelEn.map(async filePath => {

		if (!await fs.exists(i18nLanguageDirPath + filePath)) return

		if (filePath === "hugo-i18n.yml" || filePath === "html-front.yml" || filePath === "contributor-types.yml" || filePath === "changelog.yml") {

			let result = removeSimilarEntries(
				yaml.parse(await fs.readFile(i18nLanguageDirPath + filePath, "utf-8")),
				yaml.parse(await fs.readFile(eni18nLanguageDirPath + filePath, "utf-8"))
			)

			if (JSON.stringify(result) === JSON.stringify(yaml.parse(await fs.readFile(i18nLanguageDirPath + filePath, "utf-8")))) return

			prefixedLog(`Removing untranslated strings on ${chalk.inverse(`${i18nLanguageDirPath}${filePath}`)}...`)

			if (result && Object.keys(result).length) await fs.writeFile(i18nLanguageDirPath + filePath, yaml.stringify(result, { lineWidth: 0 }))
			else await fs.writeFile(i18nLanguageDirPath + filePath, "")

		// } else if (filePath === "html-front.yml") {

		// 	prefixedLog(chalkT`Removing unused strings on {inverse ${i18nLanguageDirPath}${filePath}}...`)

		// 	let result = yaml.parse(await fs.readFile(i18nLanguageDirPath + "html-front.yml", "utf-8"))

		// 	Object.keys(result).forEach(path => {
		// 		if (!await fs.exists(i18nLanguageDirPath + "html-content/" + path) && !await fs.exists(eni18nLanguageDirPath + "static-html-content/" + path)) delete result[path]
		// 	})

		// 	if (Object.keys(result).length) await fs.writeFile(i18nLanguageDirPath + "html-front.yml", yaml.stringify(result, { lineWidth: 0 }))
		// 	else await fs.writeFile(i18nLanguageDirPath + "html-front.yml", "")

		} else {

			let enContents = (await fs.readFile(eni18nLanguageDirPath + filePath, "utf-8")).trim()
			let langContents = (await fs.readFile(i18nLanguageDirPath + filePath, "utf-8")).trim()

			if ( enContents === langContents || stringSimilarity.compareTwoStrings(enContents, langContents) === 1 ) {
				// To avoid minfication 
				langContents = enContents
			} else {
				try {
					enContents = await htmlMinifier.minify(enContents.trim(), minifierOptions)
				} catch (e) {}
				try {
					langContents = await htmlMinifier.minify(langContents.trim(), minifierOptions)
				} catch (e) {}
			}

			if (enContents === langContents) {
				prefixedLog(`${chalk.inverse(`${i18nLanguageDirPath}${filePath}`)} is similar. Removing...`)
				await fs.remove(i18nLanguageDirPath + filePath)
			// } else {
			// 	prefixedLog(i18nLanguageDirPath + filePath + " is different")
			}
	
		}

	}))

}

