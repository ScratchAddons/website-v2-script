const axios = require("axios").default
const fs = require("fs-extra")
const prettier = require("prettier")
const chalk = require("chalk")

const dataset = []

const args = process.argv.slice(2)
const ref = (args.length > 0) ? args[0] : "master" 

;(async () => {

	console.log("Fetching addons list...")
	let addons = await axios.get(`https://raw.githubusercontent.com/ScratchAddons/ScratchAddons/${ref}/addons/addons.json`).then(response => response.data)
	addons = addons.filter(addon => !addon.startsWith("//"))

	console.log(`Found ${chalk.greenBright(addons.length)} addons.`)
	console.log("Start fetching and pushing all manifests...")

	await Promise.all(addons.map(async addon => {

		console.log(`Fetcing manifest of ${chalk.inverse(addon)}...`)

		const manifest = await axios.get(`https://raw.githubusercontent.com/ScratchAddons/ScratchAddons/${ref}/addons/${addon}/addon.json`).then(response => response.data)

		console.log(`Manifest of ${chalk.inverse(addon)} fetched. Pushing...`)

		dataset.push({
			id: addon,
			name: manifest.name,
			description: manifest.description,
			tags: manifest.tags,
			credits: manifest.credits,
			image: `/assets/images/addons/${addon}.png`
		})

		console.log(`Manifest of ${chalk.inverse(addon)} pushed.`)

	}))

	console.log("All manifests fetched and pushed.")

	console.log("Sorting...")	
	dataset.sort((a, b) => a.id.localeCompare(b.id))
	console.log("Writing file...")
	fs.outputFileSync("data/addons.json", prettier.format(JSON.stringify(dataset), { parser: "json", useTabs: true }))
	console.log("All done!")

	// await addons.forEach(async addon => {
	// 	if (!addon.startsWith("//")) {
	// 		const manifest = await axios.get(`https://raw.githubusercontent.com/ScratchAddons/ScratchAddons/master/addons/${addon}/addon.json`).then(response => response.data)
			
	// 		dataset.push({
	// 			id: addon,
	// 			name: manifest.name,
	// 			description: manifest.description,
	// 			image: `/assets/addons/${addon}.png`
	// 		})
	// 	}
	// })	

})().catch(e => {
	console.error(`${chalk.bgRed("ERR")} Something went wrong.`, e)
	process.exit(1)
})

// fetch("https://raw.githubusercontent.com/ScratchAddons/ScratchAddons/master/addons/addons.json").then(response => response.json()).then(data => {
// 	data.forEach(addon => {
// 		if (!addon.startsWith("//")) {
// 			console.log(addon)
// 		}
// 	})	
// })
