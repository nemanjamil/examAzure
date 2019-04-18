var accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
var storageAccount = 'firstazurefunctstorage';
const azureStorage = require('azure-storage');
const getStream = require('into-stream');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
const multiparty = require('multiparty');

module.exports = async function (context, req) {

    console.log("req", req);
    let containerName = "images";
    let blobName = "seat_shell.jpg";

    let stream = getStream(req.body.buffer);
    let streamLength = req.body.length;
    console.log("stream", stream);
    console.log("streamLength", streamLength);

   /*  let mikiVal = {
        "container": "forms",
        "file": "75e146dc-cf30-d749-d0b4-b34ffb24628f",
        "options": {
            "contentSettings": {
                "contenttype": "image/jpeg"
            },
            "metadata": {
                "contenttype": "image/jpeg"
            }
        }
    } */


    const msg = await putFileToContainer(containerName, blobName, stream, streamLength)

    context.res = {
        status: 200,
        body: msg
    };
};

/* module.exports = async function (context, req) {

    let mikiVal = {
        "container": "forms",
        "file": "75e146dc-cf30-d749-d0b4-b34ffb24628f",
        "options": {
            "contentSettings": {
                "contenttype": "image/jpeg"
            },
            "metadata": {
                "contenttype": "image/jpeg"
            }
        }
    }

   
    miki(mikiVal, req.body, function(val){
        console.log(val);
    }) 

    context.res = {
        status: 200,
        body: "aaa"
    };
} */
/* 
function miki(fileSpec, req, callback) {

    let form = new multiparty.Form({
        autoFields: true,
        autoFiles: true
    });
    form.parse(req, function (err, fields, files) {
        Object.keys(fields).forEach(function (name) {
            console.log('got field named ' + name);
        });

        Object.keys(files).forEach(function (name) {
            console.log('got file named ' + name);
        });

        console.log('Upload completed!');
    });
} */

function putFileToContainer(containerName, blobName, stream, streamLength) {
    return new Promise((resolve, reject) => {
        // createBlockBlobFromLocalFile createBlockBlobFromStream createPageBlobFromStream
        blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    message: "Image upload successfully"
                });
            }
        });
    });
}