const removeSimilarEntries = (objectTarget, objectReference) => {

	Object.keys(objectReference).forEach(keys => {
		if (!objectTarget || !objectTarget[keys]) return
		if (typeof objectReference[keys] === "object") {
			objectTarget[keys] = removeSimilarEntries(objectTarget[keys], objectReference[keys])
			if (Object.keys(objectTarget[keys]).length === 0) delete objectTarget[keys]
		}
		else if (objectTarget[keys] === objectReference[keys]) delete objectTarget[keys]
		else if (typeof objectTarget[keys] === "string" && objectTarget[keys] === "") delete objectTarget[keys]
	})
	return objectTarget

}

const addMissingEntries = (objectTarget, objectReference) => {

	if (!objectTarget || Object.keys(objectTarget).length === 0) return objectReference

	Object.keys(objectReference).forEach(keys => {
		if (!objectTarget[keys]) objectTarget[keys] = objectReference[keys]
		if (typeof objectReference[keys] === "object") {
			objectTarget[keys] = addMissingEntries(objectTarget[keys], objectReference[keys])
		}
	})

	return objectTarget

}

module.exports = {
	removeSimilarEntries,
	addMissingEntries
}
