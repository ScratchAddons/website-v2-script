const { gitEmail, gitName } = require("./consts.js")
const fs = require("fs-extra")

if (fs.existsSync("en/")) fs.removeSync("en/")
fs.ensureDirSync("en/")

require("../src/i18n/compile-en-to-i18n.js")(
	"../website/", 
	"en/"
)

require("../src/git-commit-all-and-push.js")(
	`Update source files (${new Date().toISOString()})`,
	gitEmail,
	gitName
)