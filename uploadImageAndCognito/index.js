var accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
var storageAccount = 'firstazurefunctstorage';
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
const { parse } = require('querystring');
const uuidv1 = require('uuid/v1');
const request = require('request');

module.exports = async function (context, req) {

    let parses = parse(req.body);
    let slika = parses.image;
    let folder = parses.folder;
    let eventId = parses.eventId;

    let matches = slika.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], 'base64');

    let containerName = "exams";
    let uid = uuidv1();
    let extensionImage = "jpg";
    let blobName = folder+'/'+eventId+'/data/'+uid+"."+extensionImage;
    

    // upload picture to container
    var data = await putFileToContainer(containerName, blobName, buffer)
   
    //await delay(5000)

    // call Cognito on uploaded image
    let responseFromCognitive = await requestQuery(containerName, blobName);
    

    // upload json that is received from cognito
    let extensionJson = "json";
    let blobNameJson = folder+'/'+eventId+'/data/'+uid+"."+extensionJson;
    var data = await putFileToContainerJson(containerName, blobNameJson, responseFromCognitive)

    context.res = {
        status: 200,
        body: data
    };

};
const delay = ms => new Promise(res => setTimeout(res, ms));

function requestQuery(containerName, blobName) {

    const subscriptionKey = '7b604bccc07842bca4ff933e495d2d4e';
    const uriBase = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect';
   
    const params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
            'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
    };
    let locationUri  = "https://firstazurefunctstorage.blob.core.windows.net/"+containerName+"/"+blobName;
    //let locationUri  = "https://firstazurefunctstorage.blob.core.windows.net/images/1.jpg";
    console.log("locationUri",locationUri);

    const options = {
        uri: uriBase,
        qs: params,
        body: '{"url": ' + '"' + locationUri + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    

    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body)
            }
        });
    })
}

function putFileToContainerJson(containerName, blobName, data) {
    let opt = {
        contentSettings : {
            contentType: 'application/json',
        }
    }
    return new Promise((resolve, reject) => {
        
        blobService.createBlockBlobFromText(containerName, blobName, data, opt, err => {
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


function putFileToContainer(containerName, blobName, data) {
    //https://azure.github.io/azure-storage-node/BlobService.html
    let opt = {
        contentSettings : {
            contentType: 'image/jpeg',
            contentEncoding: 'base64'
        }
    }
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromText(containerName, blobName, data, opt, err => {
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