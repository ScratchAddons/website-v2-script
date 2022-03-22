import fs from "fs-extra"
import { globbySync } from "globby"
import ini from "ini"

export default (i18nPath, orgSlug, projId) => {
	let txConfigIni = ini.parse(fs.readFileSync(`${i18nPath}.tx/config`, "utf-8"))
	
	const resourceFileInConfig = Object.entries(txConfigIni).filter(item => item[1].type && (item[1].type === 'HTML_FRAGMENT' || item[1].type === 'GITHUBMARKDOWN')).map(item => item[1].source_file)
	const resourceFilesInLocal = globbySync([`${i18nPath}en/html-content/**`, `${i18nPath}en/markdown/**`]).map(path => path.replace(i18nPath, ''))

	console.log(resourceFilesInLocal)

	resourceFilesInLocal.forEach(path => {
		if (resourceFileInConfig.indexOf(path) + 1) {
			// console.log("Found: " + path)
		} else {
			console.log("Missing: " + path)
			const resourceId = path.split('.').slice(0, -1).join('.').replace('en/', '').replace(/[^a-z0-9-_]/g, '_')
			let resourceType
			if (path.toLowerCase().endsWith('.html')) {
				resourceType = 'HTML_FRAGMENT'
			} else if (path.toLowerCase().endsWith('.md')) {
				resourceType = 'GITHUBMARKDOWN'
			}
			console.log(resourceId)
			txConfigIni[`o:${orgSlug}:p:${projId}:r:${resourceId}`] = {
				file_filter: path.replace('en/', '<lang>/'),
				minimum_perc: 0,
				source_file: path,
				source_lang: 'en',
				type: resourceType
			}
		}
	})

	resourceFileInConfig.forEach(path => {
		if (resourceFilesInLocal.indexOf(path) + 1) {
			// console.log("Found: " + path)
		} else {
			console.log("Missing: " + path)
			delete txConfigIni[Object.entries(txConfigIni).filter(item => item[1].source_file === path)[0][0]]
		}
	})

	fs.outputFileSync(`${i18nPath}.tx/config`, ini.stringify(txConfigIni).replace(/=/g, ' = '))

}