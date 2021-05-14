const { gitEmail, gitName } = require("./consts.js")
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
		"en/addons-data.json"
	)

	globby.sync(["./*", "!./en"], {
		onlyDirectories: true
	}).forEach(langPath => {

		const languageCode = path.basename(langPath)
		languageCodeHugo = languageCode.replace("_", "-").toLowerCase()

		require("../src/addons-data/compile-other")(
			"../sa/", 
			`${languageCode}/addons-data.json`, 
			languageCodeHugo
		)
	})

	await gitSA.checkout(lastBranch)

})()

;(async () => {

	await require("../src/git-commit-all-and-push.js")(
		`Update addons data (${new Date().toISOString()})`,
		gitEmail,
		gitName
	)

})()
