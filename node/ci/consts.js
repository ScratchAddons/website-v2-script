module.exports = {
	gitEmail: "73682299+scratchaddons-bot[bot]@users.noreply.github.com",
	gitName: "scratchaddons-bot[bot]",
	contentGlobPatterns: [
		"*",
		"!contributor.html",
		"docs/**",
		"!docs/faq.md",        // Hold until it is deemed to be fine to be translated
		"!docs/privacy/**",    // Decided not to translate
		"!docs/policies/**",   // Same as above just in case it got moved
		"!docs/reference/**",  // Hold it for later
],
	translatableFrontMatterFields: ["title", "description"],
	excludedFrontMatterFields: ["aliases"],
	cleanUpGlobPatterns: ["**", "!addons-data.json"],
	txOrgSlug: "scratch-addons",
	txToken: process.env.TX_TOKEN,
	resourcesToPullWithAPI3: ["GITHUBMARKDOWN"]
}