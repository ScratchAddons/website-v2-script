const { gitEmail, gitName } = require("./consts.js")

require("../src/git-commit-all-and-push.js")(
	`Update localization files (${new Date().toISOString()})`,
	gitEmail,
	gitName
)