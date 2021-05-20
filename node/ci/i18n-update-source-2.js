const { 
	gitEmail, 
	gitName, 
} = require("./consts.js")
const fs = require("fs-extra")

require("../src/i18n/rename-resources-in-config").part2(
	".tx/config"
)

;(async () => {
	
	await require("../src/git-commit-all-and-push.js")(
		`Update source files (${new Date().toISOString()})`,
		gitEmail,
		gitName
	)

})()
