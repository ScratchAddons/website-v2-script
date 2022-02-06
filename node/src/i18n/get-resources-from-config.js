const fs = require("fs-extra")
const ini = require("ini")

module.exports = (i18nPath) => {
	console.log("Getting list of resources...")

	const txConfig = ini.parse(fs.readFileSync(`${i18nPath}.tx/config`, "utf-8"))

	const resources = {}

	Object.keys(txConfig).filter(el => el !== "main").forEach(resourceSlug => {
		resources[resourceSlug] = txConfig[resourceSlug]
	})

	return resources
}