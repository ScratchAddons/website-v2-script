const fs = require("fs-extra")
const axios = require("axios").default
const simpleGit = require("simple-git").default
const chalk = require("chalk")

const sleep = (ms = 0) => new Promise(r => setTimeout(r, ms))

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

		await sleep(500)
		
	}

	console.log("Translation downloaded.")

	return checkRequest.data

}

module.exports = async (i18nPath, orgSlug, token, resourceId, resource, options = {}) => {

	const git = simpleGit(i18nPath)

	const headers = options.headers || {
		"Authorization": `Bearer ${token}`,
		"Content-Type": "application/vnd.api+json"
	}

	headers.Authorization = `Bearer ${token}`
	
	// Start downloading resources

	const [ projectSlug, resourceSlug ] = resourceId.split(".")

	console.log(chalk`Pulling {inverse ${resourceSlug}} using API 3.0...`)

	// let languages = downloadLanguagesWithAPI(orgSlug, projectSlug, headers)
	let languages = await getLanguagesToDownloadWithAPI(orgSlug, projectSlug, resourceSlug, headers, resourceId, git)

	if (!Object.keys(languages).length) {
		console.log(chalk`No languages ready in {inverse ${resourceSlug}}. Skipping.`)
		return
	}

	console.log(Object.keys(languages))
	
	for await (const languageCode of Object.keys(languages)) {

		console.log(chalk`Downloading ${languages[languageCode]} (${languageCode})`)

		const translation = await downloadResourcesWithAPI(orgSlug, projectSlug, resourceSlug, languageCode, headers)

		fs.outputFileSync(`${i18nPath}${resource.file_filter.replace("<lang>", languageCode)}`, translation)
	
	}

	console.log("Done!")

}