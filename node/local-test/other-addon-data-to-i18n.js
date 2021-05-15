const globby = require("globby")
const path = require("path")
const simpleGit = require("simple-git").default

const args = process.argv.slice(2)
const ref = (args.length > 0) ? args[0] : "master" 

const gitSA = simpleGit("../ScratchAddons")

;(async () => {

	const lastBranch = (await gitSA.branch()).current
	console.log((await gitSA.branch()).current)
	await gitSA.checkout(ref)
	console.log((await gitSA.branch()).current)

	globby.sync(["../ScratchAddons-Website-i18n/*", "!../ScratchAddons-Website-i18n/en", "!../ScratchAddons-Website-i18n/.*"], {
		onlyDirectories: true
	}).forEach(langPath => {

		const languageCode = path.basename(langPath)
		languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

		require("../src/addons-data/compile-other")(
			"../ScratchAddons/", 
			`output/i18n/${languageCode}/addons-data.json`, 
			languageCodeHugo
		)
	})

	await gitSA.checkout(lastBranch)
	console.log((await gitSA.branch()).current)

})()
