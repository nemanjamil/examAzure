var accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
var storageAccount = 'firstazurefunctstorage';
const azureStorage = require('azure-storage');
const getStream = require('into-stream');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)

module.exports =  async function (context, req) {

  
    console.log(req);
    let parse = parseQuery(req.body);
    let image = parse.image;

    let buff = new Buffer(image, 'base64');  
    let text = buff.toString('ascii');

    var uintArray = Base64Binary.decode(image);  
    var byteArray = Base64Binary.decodeArrayBuffer(image); 

    let containerName = "images";
    let blobName = "test.jpg";
    let stream =  getStream(byteArray);
    let streamLength = stream.length;

    var data = await putFileToContainer(containerName, blobName, stream, streamLength)


    context.res = {
        status : 200,
        body: "aaa"
    };

    //context.done();
};

function parseQuery(qstr) {
    var query = {};
    var a = qstr.substr(0).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '').replace(new RegExp("\\+", 'g'), ' ');
    }
    return query;
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