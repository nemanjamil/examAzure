const createHandler = require("azure-function-express").createHandler;
const express = require("express");
const app = express();

const multer = require('multer');
const MulterAzureStorage = require('multer-azure-storage')

const upload = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: 'DefaultEndpointsProtocol=https;AccountName=firstazurefunctstorage;AccountKey=iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==;EndpointSuffix=core.windows.net',
        containerName: 'images',
        containerSecurity: 'blob'
    })
})


app.post("/api/uploadImage", upload.none(), (req, res) => {
    console.log("aaa");
    res.json({
        "name": "name",
        "dob": "ddmmyyyy"
    });

});


module.exports = createHandler(app);











/* var accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
var storageAccount = 'firstazurefunctstorage';

const express = require('express');
const app = express();

const azureStorage = require('azure-storage');
const getStream = require('into-stream');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)

const multer = require('multer');
//const inMemoryStorage = multer.memoryStorage()
const upload = multer().single('picture') // storage: inMemoryStorage { dest: 'images/' }

const createHandler = require('azure-function-express').createHandler; */
//const app = require('express')();

/* app.post("/api/uploadImage", uploadStrategy,  (req, res, next) => {
    //console.log(req.file);
    res.json({ "name": "name", "dob": "ddmmyyyy" });
});
 */


/* app.post('/api/uploadImage', upload, function (req, res, next) {
  // req.body contains the text fields
}) */

//module.exports = createHandler(app);

/* module.exports = async function (context, req) {

    let containerName = "images";
    let blobName = "seat_shell.jpg";
    //console.log("req", req);

     let stream = getStream(req.body);
    let streamLength = req.body.length;
    //console.log("stream", stream);
    //console.log("streamLength", streamLength); 

    //let contentLength = req.headers['content-length'];
    //console.log(contentLength);
    app.post('/', uploadStrategy.single('avatar'), function (request, response) {
        // req.file is the `avatar` file
        
        const blobName = getBlobName(request.file.originalname)

        context.res = {
            status: 200,
            body: "OK"
        };

        // req.body will hold the text fields, if there were any
      })
      
    

    //const msg = await putFileToContainer(containerName, blobName, stream, streamLength)
    
}; */

/* function putFileToContainer(containerName, blobName, stream, streamLength) {
    return new Promise((resolve, reject) => {
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
} */