import fs from "fs-extra"
import prettier from "prettier"
import chalk from "chalk"

export default async (inputPath, outputPath, options = {}) => {

	let languageCode = options?.languageCode

	const prefixedLog = (...args) => {
		console.log(`${chalk.blue(languageCode)}:`, ...args)
	}

	const data = []

	if (languageCode === "en") throw Error("Language can't be en. Use the other script!")
	
	prefixedLog(`Start compiling ${chalk.inverse(languageCode)} addon dataset.`)

	prefixedLog(`Fetching addons list...`)
	let addons = JSON.parse(await fs.readFile(`${inputPath}addons/addons.json`, "utf-8"))
	addons = addons.filter(addon => !addon.startsWith("//"))

	prefixedLog(`Found ${chalk.greenBright(addons.length)} addons.`)
	prefixedLog("Start fetching and pushing all manifests...")

	await Promise.all(addons.map(async addon => {

		const manifest = JSON.parse(await fs.readFile(`${inputPath}addons/${addon}/addon.json`, "utf-8"))

		if (await fs.exists(`${inputPath}addons-l10n/${languageCode}/${addon}.json`)) {

			const l10nFile = JSON.parse(await fs.readFile(`${inputPath}addons-l10n/${languageCode}/${addon}.json`, "utf-8"))

			prefixedLog(`Pushing manifest of ${chalk.inverse(addon)}...`)

			for (let i in manifest.info) {
				const id = manifest.info[i].id
				manifest.info[i].text = l10nFile?.[`${addon}/@info-${id}`] || manifest.info[i].text 
			}

			data.push({
				id: addon,
				name: l10nFile?.[`${addon}/@name`] || manifest.name,
				description: l10nFile?.[`${addon}/@description`] || manifest.description,
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

		} else {

			prefixedLog(`No manifest found. Pushing English manifest of ${chalk.inverse(addon)}...`)
			
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

		}

	}))

	prefixedLog("Sorting...")	
	data.sort((a, b) => a.id.localeCompare(b.id))
	prefixedLog("Writing file...")
	await fs.outputFile(outputPath, await prettier.format(JSON.stringify(data), { parser: "json", useTabs: true }))
	prefixedLog("All done!")

}