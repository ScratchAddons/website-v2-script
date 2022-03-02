const { gitEmail, gitName } = require("./consts.js")

;(async () => {

	await require("../src/git-commit-all-and-push.js")(
		`Force update localization files (${new Date().toISOString()})`,
		gitEmail,
		gitName
	)

})()