module.exports = {
	gitEmail: "73682299+scratchaddons-bot[bot]@users.noreply.github.com",
	gitName: "scratchaddons-bot[bot]",
	contentGlobPatterns: [
		"*",
		"!contributors.html",
		"docs/**",
		"!docs/policies/**",   // Decided not to translate
		"!docs/reference/**",  // Hold it for later
		"!blog/**"              // Decided not to translate (ScratchAddons/website-v2#159)
],
	translatableFrontMatterFields: ["title", "description"],
	excludedFrontMatterFields: [],
	cleanUpGlobPatterns: ["**", "!addons-data.json"],
	txOrgSlug: "scratch-addons",
	txProjectSlug: "scratch-addons-website",
	txToken: process.env.TX_TOKEN,
	// resourcesToPullWithAPI3: ["type:GITHUBMARKDOWN"]
}
