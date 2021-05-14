const fs = require("fs-extra")
const prettier = require("prettier")
const chalk = require("chalk")

const dataset = []

module.exports = (inputPath, outputPath) => {
	
	console.log(`Start compiling English addon dataset.`)

	console.log("Fetching addons list...")
	let addons = JSON.parse(fs.readFileSync(`${inputPath}addons/addons.json`, "utf-8"))
	addons = addons.filter(addon => !addon.startsWith("//"))

	console.log(`Found ${chalk.greenBright(addons.length)} addons.`)
	console.log("Start fetching and pushing all manifests...")

	addons.forEach(addon => {

		const manifest = JSON.parse(fs.readFileSync(`${inputPath}addons/${addon}/addon.json`, "utf-8"))

		console.log(`Pushing manifest of ${chalk.inverse(addon)}...`)

		dataset.push({
			id: addon,
			name: manifest.name,
			description: manifest.description,
			tags: manifest.tags,
			credits: manifest.credits,
		})

	})

	console.log("Sorting...")	
	dataset.sort((a, b) => a.id.localeCompare(b.id))
	console.log("Writing file...")
	fs.outputFileSync(outputPath, prettier.format(JSON.stringify(dataset), { parser: "json", useTabs: true }))
	console.log("All done!")

}