var accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
var storageAccount = 'firstazurefunctstorage';

const azureStorage = require('azure-storage')
const blobService = azureStorage.createBlobService(storageAccount, accessKey)

module.exports = async function (context, req) {

    let containerName = req.body.containerName;
    let blobName = req.body.filename;
    let text = JSON.stringify(req.body.text); 

    // before this call
    // put information in Mongo DB ...... user, create JSON, time,,,, etc...... // we can do search DB
    // finished
    // put data to blob container

    const msg = await putFileToContainer(containerName, blobName, text)
    context.res = {
        status: 200,
        body: msg
    };
};

function putFileToContainer(containerName, blobName, text) {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromText(containerName, blobName, text, err => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    message: `Text "${text}" is written to blob storage`
                });
            }
        });
    });
}