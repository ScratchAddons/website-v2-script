const fs = require("fs-extra")
const ini = require("ini")
const axios = require("axios").default

const downloadResourcesWithAPI = async (orgSlug, projectSlug, resourceSlug, languageCode, headers) => {

	console.log("Sending download request...")

	const downloadRequest = await axios.post("https://rest.api.transifex.com/resource_translations_async_downloads", {
		"data": {
			"attributes": {
				"content_encoding": "text",
				"file_type": "default",
				"mode": "default",
				"pseudo": false
			},
			"relationships": {
				"language": {
					"data": {
						"id": `l:${languageCode}`,
						"type": "languages"
					}
				},
				"resource": {
					"data": {
						"id": `o:${orgSlug}:p:${projectSlug}:r:${resourceSlug}`,
						"type": "resources"
					}
				}
			},
			"type": "resource_translations_async_downloads"
		}
	}, { headers })

	const checkRequestUrl = downloadRequest.data.data.links.self
	let isReady = false
	let attempts = 1

	let checkRequest

	while (!isReady) {

		console.log(`Checking status... (attempt ${attempts++})`)

		checkRequest = await axios.get(checkRequestUrl, { headers })
			.catch(error => {
				console.log(error.response.data.errors)
			})

		if (typeof checkRequest.data === "string") isReady = true
		
	}

	console.log("Translation downloaded.")

	return checkRequest.data

}

const languagesCache = {}

const downloadLanguagesWithAPI = async (orgSlug, projectSlug, headers) => {

	if (languagesCache[orgSlug + "." + projectSlug]) return languagesCache[orgSlug + "." + projectSlug]

	console.log("Getting project languages...")

	const languagesRequest = await axios.get(`https://rest.api.transifex.com/projects/o:${orgSlug}:p:${projectSlug}/languages`, { headers })

	const languages = {}

	languagesRequest.data.data.forEach(language => {
		languages[language.attributes.code] = language.attributes.name
	})

	return languages

}

module.exports = async (i18nPath, orgSlug, token, options = {}) => {

	console.log("Pulling resources using API 3.0...")

	const resourcesToFetch = options.resourcesToFetch	
	const headers = options.headers || {
		"Authorization": `Bearer ${token}`,
		"Content-Type": "application/vnd.api+json"
	}

	headers.Authorization = `Bearer ${token}`
	
	// Figure out what resources to fetch

	console.log("Getting list of resources...")

	const txConfig = ini.parse(fs.readFileSync(`${i18nPath}.tx/config`, "utf-8"))

	const resources = {}

	Object.keys(txConfig).filter(el => el !== "main").forEach(projectSlug => {
		Object.keys(txConfig[projectSlug]).forEach(resourceSlug => {
			if (!resourcesToFetch.includes(txConfig[projectSlug][resourceSlug].type)) return
			resources[projectSlug + "." + resourceSlug] = txConfig[projectSlug][resourceSlug]
		})
	})

	console.log(Object.keys(resources).length)

	let languages = {}

	// Start downloading resources

	for await (const resourceId of Object.keys(resources)) {

		const [ projectSlug, resourceSlug ] = resourceId.split(".")
		languages = await downloadLanguagesWithAPI(orgSlug, projectSlug, headers)
		
		for await (const languageCode of Object.keys(languages)) {

			console.log(`Downloading ${resourceSlug}, ${languages[languageCode]} (${languageCode})`)

			const translation = await downloadResourcesWithAPI(orgSlug, projectSlug, resourceSlug, languageCode, headers)

			fs.outputFileSync(`${i18nPath}${txConfig["scratch-addons-website"][resourceSlug].file_filter.replace("<lang>", languageCode)}`, translation)
		
		}
	}

	console.log("Done!")

}