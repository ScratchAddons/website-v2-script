const fs = require("fs-extra")

module.exports = configFilePath => {
	const configFile = fs.readFileSync(configFilePath, "utf-8")

	configFile = configFile.replace(/\[scratch-addons-website.en_(.+)\]/g, (match, one) => {
		return `[scractch-addons-website.${one.replace("\\", "/")}]`
	})

	fs.writeFileSync(configFile)
}