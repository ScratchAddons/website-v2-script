const { gitEmail, gitName, txOrgSlug, resourcesToPullWithAPI3, txToken } = require("./consts.js")
const globby = require("globby")
const spawn = require("cross-spawn")
const chalk = require("chalk")

globby.sync(["*", "!en"], {
	onlyDirectories: true
}).forEach(langPath => {

	require("../src/i18n/prepare-folders.js")(
		langPath + "/",
		"en/"
	)

})

const resources = require("../src/i18n/get-resources-from-config")("./")

const resourcesClient = {}
const resourcesAPI3 = {}

Object.keys(resources).forEach(resource => {
	if (resourcesToPullWithAPI3.filter(item => item.startsWith("type:")).map(item => item.replace("type:", "")).includes(resources[resource].type)) {
		resourcesAPI3[resource] = resources[resource]
		return
	}
	if (resourcesToPullWithAPI3.filter(item => item.startsWith("resource:")).map(item => item.replace("resource:", "")).filter(item => matcher.isMatch(resource, item)).length
	) {
		resourcesAPI3[resource] = resources[resource]
		return
	}
	resourcesClient[resource] = resources[resource]
})

// console.log(Object.keys(resourcesAPI3))
// console.log(Object.keys(resourcesClient))

;(async () => {

	for await (const resource of Object.keys(resourcesClient)) {
		console.log(chalk`Pulling {inverse ${resource.split(".")[1]}} using the client...`)
		const result = spawn.sync("tx", ["pull", "--all", "--use-git-timestamps", "--skip", "--mode", "sourceastranslation", "--resource", resource])
		console.log(result.stdout.toString())
		if (result.status !== 0) {
			console.log(result.stderr.toString())
			console.log(`Run returned status code ${result.status}. Fetching using API 3...`)
			await require("../src/i18n/pull-resources-with-api-3")(
				"./",
				txOrgSlug, 
				txToken,
				resource,
				resourcesClient[resource]
			)
		}
	}

	for await (const resource of Object.keys(resourcesAPI3)) {
		await require("../src/i18n/pull-resources-with-api-3")(
			"./",
			txOrgSlug, 
			txToken,
			resource,
			resourcesAPI3[resource]
		)
	}

	globby.sync(["*", "!en"], {
		onlyDirectories: true
	}).forEach(langPath => {

		require("../src/i18n/remove-untranslated.js")(
			langPath + "/",
			"en/"
		)

	})

	// require("../src/i18n/generate-chinese-variants")("zh_TW/", "zh_CN/")
	// require("../src/i18n/generate-chinese-variants")("zh_TW/", "zh_HK/")

	await require("../src/git-commit-all-and-push.js")(
		`Update localization files (${new Date().toISOString()})`,
		gitEmail,
		gitName
	)

})()