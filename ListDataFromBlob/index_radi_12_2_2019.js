const accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
const storageAccount = 'firstazurefunctstorage';
const storage = require('azure-storage');
const blobService = storage.createBlobService(storageAccount, accessKey);
const containerName = 'images';
const prefix = 'id333';

module.exports = async function (context, req) {

    
    let listAllBlobs = await listAllBlobInAllContainer(containerName);
    let listAllContainersData = await listAllContainers();
    let listContainersSegmentedWithPrefixData = await listContainersSegmentedWithPrefix(containerName);
    let listBlobBySpecificContainerData = await listBlobBySpecificContainer(containerName,prefix);

    context.res = {
        status: 200,
        body: listBlobBySpecificContainerData
    };

    //console.log("listAllBlobs ", listAllBlobs);
    //console.log("listAllContainersData ", listAllContainersData);
    //console.log("listContainersSegmentedWithPrefixData ", listContainersSegmentedWithPrefixData);

};

async function listBlobBySpecificContainer(containerName,prefix) {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmentedWithPrefix(containerName, prefix, null, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result.entries) // console.log(result.continuationToken);
            }
        })
    })
}

async function listContainersSegmentedWithPrefix(prefix) {
    return new Promise((resolve, reject) => {
        blobService.listContainersSegmentedWithPrefix(prefix, null, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result.entries) // console.log(result.continuationToken);
            }
        })
    })
}

async function listAllBlobInAllContainer(containerName) {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmented(containerName, null, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result.entries) // console.log(result.continuationToken);
            }
        })
    })
}

async function listAllContainers() {
    return new Promise((resolve, reject) => {
        blobService.listContainersSegmented(null, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result.entries)
            }
        })
    })
}



async function showBlobNames(aborter, containerURL) {

    let response;
    let marker;

    do {
        response = await containerURL.listBlobFlatSegment(aborter);
        marker = response.marker;
        for (let blob of response.segment.blobItems) {
            console.log(` - ${ blob.name }`);
        }
    } while (marker);
}