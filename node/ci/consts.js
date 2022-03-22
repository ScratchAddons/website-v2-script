export const gitEmail = "73682299+scratchaddons-bot[bot]@users.noreply.github.com";
export const gitName = "scratchaddons-bot[bot]";
export const contentGlobPatterns = [
	"*",
	"!contributors.html",
	"docs/**",
	"!docs/policies/**",    // Decided not to translate
	"!docs/reference/**",   // Hold it for later
	"!blog/**"              // Decided not to translate (ScratchAddons/website-v2#159)
];
export const translatableFrontMatterFields = ["title", "description"];
export const excludedFrontMatterFields = [];
export const cleanUpGlobPatterns = ["**", "!addons-data.json"];
export const txOrgSlug = "scratch-addons";
export const txProjectSlug = "scratch-addons-website";
export const txToken = process.env.TX_TOKEN;
