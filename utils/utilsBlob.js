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
        blobService.getBlobToText(containerName, blobLocation, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
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
        blobService.createBlockBlobFromText(containerName, blobName, data, opt, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
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

//getBlobToLocalFile(container, blob, localFileName [, options], callback)
// let getImageFromBlob = async (containerName, blobName) => {

//     // return new Promise((resolve, reject) => {
//     //     blobService.getBlobToText(containerName, blobName, (err, data) => {
//     //         if (err) {
//     //             reject(err);
//     //         } else {
//     //             resolve(data);
//     //         }
//     //     });
//     // })

//     // return new Promise((resolve, reject) => {
//     //     const name = path.basename(blobName);
//     // //    const blobService = azureStorage.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey); 
//     //     blobService.getBlobToLocalFile(containerName, blobName, `${downloadFilePath}${name}`, function(error, serverBlob) {
//     //         if (error) {
//     //             reject(error);
//     //         } else {
//     //             resolve(downloadFilePath);
//     //         }
//     //     });
//     // });

// }

module.exports = {
    getJsonExamBlob,
    log,
    putFileToContainerJson,
    uploadImageToContainder
}