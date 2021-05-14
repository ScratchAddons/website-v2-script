const fs = require("fs-extra")
const prettier = require("prettier")
const chalk = require("chalk")

const dataset = []

module.exports = (inputPath, outputPath, languageCode) => {

	if (languageCode === "en") throw Error("Language can't be en. Use the other script!")
	
	console.log(`Start compiling ${chalk.inverse(languageCode)} addon dataset.`)

	console.log("Fetching addons list...")
	let addons = JSON.parse(fs.readFileSync(`${inputPath}addons/addons.json`, "utf-8"))
	addons = addons.filter(addon => !addon.startsWith("//"))

	console.log(`Found ${chalk.greenBright(addons.length)} addons.`)
	console.log("Start fetching and pushing all manifests...")

	addons.forEach(addon => {

		const manifest = JSON.parse(fs.readFileSync(`${inputPath}addons/${addon}/addon.json`, "utf-8"))

		if (fs.existsSync(`${inputPath}addons-l10n/${languageCode}/${addon}.json`)) {

			const l10nFile = JSON.parse(fs.readFileSync(`${inputPath}addons-l10n/${languageCode}/${addon}.json`, "utf-8"))

			console.log(`Pushing manifest of ${chalk.inverse(addon)}...`)

			dataset.push({
				id: addon,
				name: l10nFile[`${addon}/@name`] ? l10nFile[`${addon}/@name`] : manifest.name,
				description: l10nFile[`${addon}/@description`] ? l10nFile[`${addon}/@description`] : manifest.description,
				tags: manifest.tags,
				credits: manifest.credits,
			})

		} else {

			console.log(`No manifest found. Pushing English manifest of ${chalk.inverse(addon)}...`)
			
			dataset.push({
				id: addon,
				name: manifest.name,
				description: manifest.description,
				tags: manifest.tags,
				credits: manifest.credits,
			})	

		}

	})

	console.log("Sorting...")	
	dataset.sort((a, b) => a.id.localeCompare(b.id))
	console.log("Writing file...")
	fs.outputFileSync(outputPath, prettier.format(JSON.stringify(dataset), { parser: "json", useTabs: true }))
	console.log("All done!")

}