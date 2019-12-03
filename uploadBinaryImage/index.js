const Utils = require('../utils/utilsBlob');
const containerName = process.env.examsuser;
const accessKey = process.env.accessKey;
const storageAccount = process.env.storageAccount;
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(storageAccount, accessKey);
//const formidable = require('formidable')
//const multiparty = require('multiparty')
//const parse = require('urlencoded-body-parser')
const getStream = require('into-stream');
//const streams = require('memory-streams');
const multipart = require("parse-multipart");

const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = {
    bufferSize: 4 * ONE_MEGABYTE,
    maxBuffers: 20
};


module.exports = async function (context, req) {
    let blobName = "miki.jpeg"

    var bodyBuffer = Buffer.from(req.body); // encode body to base64 string
    var boundary = multipart.getBoundary(req.headers['content-type']);
    var parts = multipart.Parse(bodyBuffer, boundary);

    let length = parts[0].data.length;
    let data = getStream(parts[0].data);

    uploadImageToContainder(containerName, blobName, data, length);

};

const uploadImageToContainder = async (containerName, blobName, data, length) => {
    //https://azure.github.io/azure-storage-node/BlobService.html
    let opt = {
        contentSettings: {
            contentType: "image/jpeg",
            // contentEncoding: 'base64'
        },
        metadata: {
            contentType: "image/jpeg"
        }
    }

    blobService.createBlockBlobFromStream(containerName, blobName, data, length, opt, function (error) {

        if (error) {
            //console.error(`ERROR in storage.writeFileWithStream\nFile Spec was: ${JSON.stringify(fileSpec)}\nError:\n${err}`);
        }

        //callback(null, 'File uploaded successfully');

    });

    /* return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromStream(containerName, blobName, req, "551900", opt, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }); */

}

// console.log(req.body.buffer.byteLength);
// const stream = getStream(req.body.buffer);
// console.log("stream", stream);
// //const contentType = context.bindingData.data.contentType;
// console.log("context", context);

// const data = await parse(req)
// console.log("data",data)

// var streamnew = new streams.ReadableStream(req.body); 
// for (const key in req) {
//     if (req.hasOwnProperty(key)) {
//         streamnew[key] = req[key];
//     }
// }
// context.stream = streamnew; 

// console.log("context.stream", context.stream);




// var form = new formidable.IncomingForm();
// form.onPart = function(part){
//     part.pipe(res);
//   };
// form.parse(req);

// var form = new multiparty.Form();
// form.parse(stream, function(err, fields, files) {
//     console.log(fields);
// });

//const stream = getStream(req.file.buffer);
//console.log(stream);