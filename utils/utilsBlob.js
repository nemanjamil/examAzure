const accessKey = process.env.accessKey;
const storageAccount = process.env.storageAccount;
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(storageAccount, accessKey);
const path = require('path');


let log = (msg) => {
    console.log(msg);
}

let getJsonExamBlob = async (blobLocation, containerName) => {
    return new Promise((resolve, reject) => {
        blobService.getBlobToText(containerName, blobLocation, (error, data) => {
            if (error) {
                reject({
                    message : error,
                    error: error,
                    stateoferror: 50
                });
            } else {
                resolve(data);
            }
        });
    });
}

function createBlobInAzure(containerName, blobName, data, contentType) {
    let opt = {
        contentSettings: {
            contentType: contentType,
        }
    }
    return new Promise((resolve, reject) => {

        blobService.createBlockBlobFromText(containerName, blobName, data, opt, (error, data) => {
            if (error) {
                reject({
                    message : "Blob Failed to Create",
                    error : error,
                    stateoferror: 136
                });
            } else {
                resolve({
                    message: data
                });
            }
        });
    });
}

let putFileToContainerJson = async (containerName, blobName, data) => {
    let opt = {
        contentSettings: {
            contentType: 'application/json',
        }
    }
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromText(containerName, blobName, data, opt, (error, data) => {
            if (error) {
                reject({
                    message : error,
                    error: error,
                    stateoferror: 50
                });
            } else {
                resolve("Inserted Data");
            }
        });
    });
}

let uploadImageToContainder = async (containerName, blobName, data, type) => {
    //https://azure.github.io/azure-storage-node/BlobService.html
    let opt = {
        contentSettings: {
            contentType: type,
            contentEncoding: 'base64'
        }
    }
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromText(containerName, blobName, data, opt, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

}

const getContainerFilesDetails = async (containerName) => {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmented(containerName, null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}


// const getPictureJsonFromBlob = async (containerName, blobName) => {
//     return new Promise((resolve, reject) => {
//         blobService.getBlobToText(containerName, blobName, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         });
//     })
// }


module.exports = {
    getJsonExamBlob,
    log,
    putFileToContainerJson,
    uploadImageToContainder,
    getContainerFilesDetails,
    path,
    createBlobInAzure
}