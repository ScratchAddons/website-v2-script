const simpleGit = require("simple-git").default

const args = process.argv.slice(2)
const ref = (args.length > 0) ? args[0] : "master"

const git = simpleGit("./")
const gitSA = simpleGit("../sa/")

;(async () => {

	const lastBranch = (await gitSA.branch()).current
	await gitSA.checkout(ref)

	require("../src/addons-data/compile-en")(
		"../sa/", 
		"data/addons/en.json"
	)
	
	await gitSA.checkout(lastBranch)

})()