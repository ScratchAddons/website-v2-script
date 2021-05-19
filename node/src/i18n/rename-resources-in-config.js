const fs = require("fs-extra")

module.exports = configFilePath => {
	let configFile = fs.readFileSync(configFilePath, "utf-8")

	configFile = configFile.replace(/\[scratch-addons-website.en_(.+)\]/g, (match, one) => {
		return `[scractch-addons-website.${one.replace("\\", "/")}]`
	})

	fs.writeFileSync(configFilePath, configFile)
}