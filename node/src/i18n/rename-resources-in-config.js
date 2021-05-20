const fs = require("fs-extra")

module.exports = {
	part1(configFilePath) {
		let configFile = fs.readFileSync(configFilePath, "utf-8")
	
		configFile = configFile.replace(/\[scratch-addons-website.(.+)\]/g, (match, one) => {
			if (one.startsWith("en_")) return match
			return `[scractch-addons-website.en_${one}]`
		})
	
		fs.writeFileSync(configFilePath, configFile)
	},
	part2(configFilePath) {
		let configFile = fs.readFileSync(configFilePath, "utf-8")
	
		configFile = configFile.replace(/\[scratch-addons-website.en_(.+)\]/g, (match, one) => {
			return `[scractch-addons-website.${one.replace("\\", "_")}]`
		})
	
		fs.writeFileSync(configFilePath, configFile)
	}
}

