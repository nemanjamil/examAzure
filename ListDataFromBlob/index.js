const accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
const storageAccount = 'firstazurefunctstorage';
const storage = require('azure-storage');
const blobService = storage.createBlobService(storageAccount, accessKey);
const {
    parse
} = require('querystring');
const path = require('path');
const fetch = require('node-fetch');

module.exports = async function (context, req) {

    let parses = parse(req.body);
    let containerName = parses.containerName;
    let prefix = parses.prefix;
    let link = "https://firstazurefunctstorage.blob.core.windows.net/exams";

    let listBlobBySpecificContainerData = await listBlobBySpecificContainer(containerName, prefix);
    let getListOfJsonFilesData = await getListOfJsonFiles(listBlobBySpecificContainerData);
    let parseAllData = await parseAll(getListOfJsonFilesData,link);

    context.res = {
        status: 200,
        body: parseAllData 
    };

};

async function parseAll(getListOfJsonFilesData,link) {
    let queryAll = getListOfJsonFilesData.map(query => {
        let rqs = link + '/' + query.name;
        let patbn = path.basename(rqs);
        return fetch(rqs)
            .then(res => res.json());
    })
    console.log("queryAll", queryAll);
    let array = [];
    return Promise.all(queryAll)
        .then(responses => {
            let i = 0;
            for (let response of responses) {
                let newObj = {}
                newObj.jsonfile = path.basename(getListOfJsonFilesData[i].name);
                newObj.jsondata = getListOfJsonFilesData[i];
                newObj.imagedata = response
                i++;
                array.push(newObj);
            }
            return array;
        })
}

async function getListOfJsonFiles(listBlobBySpecificContainerData) {
    return listBlobBySpecificContainerData.filter(element => {
        let pathex = path.extname(element.name);
        if (pathex === ".json") {
            return element
        }
    }).map(function (jedi) {
        return jedi
    })
}

async function listBlobBySpecificContainer(containerName, prefix) {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmentedWithPrefix(containerName, prefix, null, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result.entries)
            }
        })
    })
}