var accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
var storageAccount = 'firstazurefunctstorage';
const azureStorage = require('azure-storage');
const getStream = require('into-stream');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
const multiparty = require('multiparty');
const streams = require('memory-streams');

const createHandler = require("azure-function-express").createHandler;
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const multer = require('multer')

var MulterAzureStorage = require('multer-azure-storage')
//  "dataType": "binary",

/* const upload = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: 'DefaultEndpointsProtocol=https;AccountName=firstazurefunctstorage;AccountKey=iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==;EndpointSuffix=core.windows.net',
        containerName: 'images',
        containerSecurity: 'blob'
    })
}) */

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("destination");
        cb(null, 'uploadImage/imagesnew')
    },
    filename: function (req, file, cb) {
        console.log("file.fieldname", file.fieldname);
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const inMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: storage }); //  dest: 'uploadImage/images',

app.use(function (req, res, next) {
    console.log("reqUse",req); // JSON Object
    next();
  });

const miki = app.post('/api/uploadImage', async  function (req, res, next) {
    console.log("req2",req);
    /* upload.single('image')(req, {}, function (err) {
        console.log("OVDE");
        if (err) throw err
    }) */
    console.log("req", req);
    let containerName = "images";
    let blobName = "test.jpg";

    let stream = new streams.ReadableStream(req.body);
    console.log("stream",stream);
    let streamLength = req.body.length;
    var data = await putFileToContainer(containerName, blobName, stream, streamLength)
    console.log("data",data);
     res.send("ok");
   

});

//module.exports = createHandler(app);

module.exports = function (context, req) {
    
    //console.log(req);
    //var stream = new streams.ReadableStream(req.body);

    context.res = {
        status: 200,
        body: "aaa"
    };
}

function putFileToContainer(containerName, blobName, stream, streamLength) {

    let opt = {
        "options": {
          "contentSettings": {
            "contenttype": "image/jpeg"
          },
          "metadata": {
            "contenttype":"image/jpeg"
          }
        }
     }
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
            if (err) {
                reject({
                    message: "Fail"
                });
            } else {
                resolve({
                    message: "Image upload successfully"
                });
            }
        });
    });
}