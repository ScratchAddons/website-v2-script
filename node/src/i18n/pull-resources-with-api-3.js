const fs = require("fs-extra")
const ini = require("ini")
const axios = require("axios").default
const simpleGit = require("simple-git").default

const getLanguagesToDownloadWithAPI = async (orgSlug, projectSlug, resourceSlug, headers, { minimum_perc: threshold, file_filter: filePattern, source_lang: sourceLanguageId }, git = simpleGit("./")) => {

	console.log("Getting project languages to download...")

	const languages = {}
	let intlObj = new Intl.DisplayNames(["en"], {type: 'language'})

	let statsRequestData = []
	let requestPath = `/resource_language_stats?filter[project]=o:${orgSlug}:p:${projectSlug}&filter[resource]=o:${orgSlug}:p:${projectSlug}:r:${resourceSlug}`

	while (requestPath) {
		const statsRequest = await axios.get(`https://rest.api.transifex.com${requestPath}`, { headers }).catch(e => console.log(e.response.data.errors))

		statsRequestData.push(...statsRequest.data.data)

		requestPath = statsRequest.data.links.next
	}

	
	// console.log("Threshold is " + threshold + "%")

	for await (const language of statsRequestData) {
		const languageCode = language.relationships.language.data.id.replace("l:", "")
		if (languageCode === sourceLanguageId) continue
		const attributes = language.attributes
		const percentage = (attributes.translated_strings / attributes.total_strings)*100
		// console.log(languageCode + " is " + percentage + "%")
		if (percentage < threshold) continue
		try {
			const log = await git.log({ file: filePattern.replace("<lang>", languageCode) })
			if (new Date(log.latest.date).getTime() >= new Date(attributes.last_update).getTime()) continue
		} catch (e) {}
		languages[languageCode] = intlObj.of(languageCode.replace("_", "-").toLowerCase())
	}

	return languages

}

const getLanguagesWithAPI = async (orgSlug, projectSlug, headers) => {

	if (languagesCache[orgSlug + "." + projectSlug]) return languagesCache[orgSlug + "." + projectSlug]

	console.log("Getting project languages...")

	const languagesRequest = await axios.get(`https://rest.api.transifex.com/projects/o:${orgSlug}:p:${projectSlug}/languages`, { headers })

	const languages = {}

	languagesRequest.data.data.forEach(language => {
		languages[language.attributes.code] = language.attributes.name
	})

	return languages

}

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

		isReady = typeof checkRequest.data === "string"
		
	}

	console.log("Translation downloaded.")

	return checkRequest.data

}

module.exports = async (i18nPath, orgSlug, token, options = {}) => {

	console.log("Pulling resources using API 3.0...")

	const git = simpleGit(i18nPath)

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

	console.log(Object.keys(resources))
	

	// Start downloading resources

	for await (const resourceId of Object.keys(resources)) {

		const [ projectSlug, resourceSlug ] = resourceId.split(".")

		// let languages = downloadLanguagesWithAPI(orgSlug, projectSlug, headers)
		let languages = await getLanguagesToDownloadWithAPI(orgSlug, projectSlug, resourceSlug, headers, resources[resourceId], git)

		console.log(Object.keys(languages))
		
		for await (const languageCode of Object.keys(languages)) {

			console.log(`Downloading ${resourceSlug}, ${languages[languageCode]} (${languageCode})`)

			const translation = await downloadResourcesWithAPI(orgSlug, projectSlug, resourceSlug, languageCode, headers)

			fs.outputFileSync(`${i18nPath}${txConfig[projectSlug][resourceSlug].file_filter.replace("<lang>", languageCode)}`, translation)
		
		}
	}

	console.log("Done!")

}