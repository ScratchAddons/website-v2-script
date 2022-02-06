module.exports = {
	gitEmail: "73682299+scratchaddons-bot[bot]@users.noreply.github.com",
	gitName: "scratchaddons-bot[bot]",
	contentGlobPatterns: [
		"*",
		"!contributors.html",
		"docs/**",
		"!docs/privacy/**",    // Decided not to translate
		"!docs/policies/**",   // Same as above just in case it got moved
		"!docs/reference/**",  // Hold it for later
],
	translatableFrontMatterFields: ["title", "description"],
	excludedFrontMatterFields: ["aliases"],
	cleanUpGlobPatterns: ["**", "!addons-data.json"],
	txOrgSlug: "scratch-addons",
	txProjectSlug: "scratch-addons-website",
	txToken: process.env.TX_TOKEN,
	// resourcesToPullWithAPI3: ["type:GITHUBMARKDOWN"]
}
