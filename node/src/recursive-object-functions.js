export const removeSimilarEntries = (objectTarget, objectReference) => {

	if (!objectTarget) return

	Object.keys(objectReference).forEach(keys => {
		
		if (!objectTarget[keys]) delete objectTarget[keys]
		else if (typeof objectReference[keys] === "object") {
			objectTarget[keys] = removeSimilarEntries(objectTarget[keys], objectReference[keys])
			if (Object.keys(objectTarget[keys]).length === 0) delete objectTarget[keys]
		}
		else if (objectTarget[keys] === objectReference[keys]) delete objectTarget[keys]
	})
	return objectTarget

}

export const addMissingEntries = (objectTarget, objectReference) => {

	if (!objectTarget || Object.keys(objectTarget).length === 0) return objectReference

	Object.keys(objectReference).forEach(keys => {
		if (!objectTarget[keys]) objectTarget[keys] = objectReference[keys]
		if (typeof objectReference[keys] === "object") {
			objectTarget[keys] = addMissingEntries(objectTarget[keys], objectReference[keys])
		}
	})

	return objectTarget

}