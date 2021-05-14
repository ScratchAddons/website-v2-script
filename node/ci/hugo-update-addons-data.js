const simpleGit = require("simple-git").default

;(async () => {

	require("../src/addons-data/compile-en")(
		"../sa/", 
		"data/addons/en.json"
	)

})()