const globby = require("globby")
const chalk = require("chalk")
const fs = require("fs-extra")

module.exports = (folderPath, globPatterns) => {
	const filesToRemove = globby.sync(globPatterns.map(pattern => {
		if (pattern.startsWith("!")) return "!" + folderPath + pattern.slice("1")
		return folderPath + pattern
	}))
	console.log(filesToRemove)
	filesToRemove.forEach(file => {
		console.log(chalk`Removing {inverse ${file}}...`)
		fs.removeSync(file)
	})
}