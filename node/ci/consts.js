module.exports = {
	gitEmail: "73682299+scratchaddons-bot[bot]@users.noreply.github.com",
	gitName: "scratchaddons-bot[bot]",
	contentGlobPatterns: [
		"_index.html", 
		"welcome.html", 
		"farewell.html", 
		"addons.html", 
		"feedback.html", 
		"scratch-messaging-transition.html", 
		"unsupported-browser.html", 
		"docs/_index.md"
	],
	translatableFrontMatterFields: ["title", "description"],
	excludedFrontMatterFields: ["aliases"],
	cleanUpGlobPatterns: ["**", "!addons-data.json"],
	txOrgSlug: "scratch-addons",
	txToken: process.env.TX_TOKEN,
	resourcesToPullWithAPI3: ["GITHUBMARKDOWN"]
}