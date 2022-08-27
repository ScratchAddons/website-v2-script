// Adapted from https://github.com/ScratchAddons/changed-files/blob/master/src/main.ts

import { context, getOctokit } from "@actions/github"

class ChangedFiles {
    updated = []
    created = []
    deleted = []

    apply(f) {
        switch (f.status) {
            case "added":
                this.created.push(f.filename)
                break
            case "removed":
                this.deleted.push(f.filename)
                break
            case "modified":
                this.updated.push(f.filename)
                break
            case "renamed":
                this.created.push(f.filename)
                if (f.previous_filename) {
                    this.deleted.push(f.previous_filename)
                }
        }
    }
}

async function getChangedFilesPR(client, prNumber, fileCount) {
    const changedFiles = new ChangedFiles()
    const fetchPerPage = 100
    for (let pageIndex = 1; (pageIndex - 1) * fetchPerPage < fileCount; pageIndex++) {
        const listFilesResponse = await client.pulls.listFiles({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: prNumber,
            page: pageIndex,
            per_page: fetchPerPage,
        })
        console.log(`Fetched page ${pageIndex} with ${listFilesResponse.data.length} changed files`)
        listFilesResponse.data.forEach(f => changedFiles.apply(f))
    }
    return changedFiles
}

async function getChangedFilesPush(client, commits) {
    const changedFiles = new ChangedFiles()
    
    await Promise.all(commits.map(async commit => {
        console.log(`Calling client.repos.getCommit() with ref ${commit.id}`)
        if (commit.distinct) {
            const commitData = await client.repos.getCommit({
                owner: context.repo.owner,
                repo: context.repo.repo,
                ref: commit.id
            });
            commitData.data.files.forEach(f => changedFiles.apply(f))    
        }
    }))		

    return changedFiles
}

async function fetchPush() {
    return context.payload.commits ? { commits: context.payload.commits } : undefined
}

async function fetchPR() {
    return context.payload.pull_request
        ? {
              number: context.payload.pull_request.number,
              changed_files: context.payload.pull_request["changed_files"],
          }
        : undefined
}

export async function run() {
    const token = process.env.GITHUB_TOKEN
    const event = context.eventName
    const client = getOctokit(token)

    let changedFiles

    switch(event) {
        case 'push':
            const push = await fetchPush()
            if (!push) {
                console.error(`Could not get push from context, exiting`)
                return
            }
            console.log(`${push.commits.length} commits found`)
            changedFiles = await getChangedFilesPush(client, push.commits)
            break;

        case 'pull_request':
            const pr = await fetchPR(client)
            if (!pr) {
                console.error(`Could not get pull request from context, exiting`)
                return
            }
            console.log(`${pr.changed_files} changed files for pr #${pr.number}`)
            changedFiles = await getChangedFilesPR(client, pr.number, pr.changed_files)
            break;
    }

    return {
		created: changedFiles.created,
		updated: changedFiles.updated,
		deleted: changedFiles.deleted,
	}

}

run().catch(err => {
    console.error(err)
    console.error(`Unhandled error: ${err}`)
})