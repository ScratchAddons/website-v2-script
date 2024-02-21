import fs from "fs-extra"
import prettier from "prettier"
import chalk from "chalk"

export default async (inputPath, outputPath) => {

	const data = []
	
	console.log(`Start compiling English addon dataset.`)

	console.log("Fetching addons list...")
	let addons = JSON.parse(await fs.readFile(`${inputPath}addons/addons.json`, "utf-8"))
	addons = addons.filter(addon => !addon.startsWith("//"))

	console.log(`Found ${chalk.greenBright(addons.length)} addons.`)
	console.log("Start fetching and pushing all manifests...")

	await Promise.all(addons.map(async addon => {

		const manifest = JSON.parse(await fs.readFile(`${inputPath}addons/${addon}/addon.json`, "utf-8"))

		console.log(`Pushing manifest of ${chalk.inverse(addon)}...`)

		data.push({
			id: addon,
			name: manifest.name,
			description: manifest.description,
			tags: manifest.tags,
			credits: manifest?.credits,
			info: manifest?.info,
			dynamicEnable: manifest?.dynamicEnable,
			dynamicDisable: manifest?.dynamicDisable,
			enabledByDefault: manifest?.enabledByDefault,
			libraries: manifest?.libraries,
			versionAdded: manifest.versionAdded,
			latestUpdate: manifest?.latestUpdate,
			injectAsStyleElt: manifest?.injectAsStyleElt,
			updateUserstylesOnSettingsChange: manifest?.updateUserstylesOnSettingsChange
		})

	}))

	console.log("Sorting...")	
	data.sort((a, b) => a.id.localeCompare(b.id))
	console.log("Writing file...")
	await fs.outputFile(outputPath, await prettier.format(JSON.stringify(data), { parser: "json", useTabs: true }))
	console.log("All done!")

}