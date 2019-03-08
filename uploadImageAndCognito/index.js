const Utils = require('../utils/utilsBlob');
const examtemplatecontainer = process.env.examtemplatecontainer;
const examsuser = process.env.examsuser;
const {
    parse
} = require('querystring');
const uuidv1 = require('uuid/v1');
const request = require('request');

module.exports = async function (context, req) {

    let parses = parse(req.body);
    let slika = parses.image;
    let folder = parses.folder;
    let eventId = parses.eventId;

    let matches = slika.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = Buffer.from(matches[2], 'base64');

    let containerName = "exams";
    let uid = uuidv1();
    let extensionImage = type.split("/")[1];
    let blobName = folder + '/' + eventId + '/data/' + uid + "." + extensionImage;

    try {
        var data = await Utils.uploadImageToContainder(containerName, blobName, buffer, type)  // upload picture to container
        //await delay(5000)
        let responseFromCognitive = await requestQuery(containerName, blobName); // call Cognito on uploaded image

        let extensionJson = "json"; // upload json that is received from cognito
        let blobNameJson = folder + '/' + eventId + '/data/' + uid + "." + extensionJson;
        var data = await Utils.putFileToContainerJson(containerName, blobNameJson, responseFromCognitive)

        context.res = {
            status: 200,
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.res = {
            status: 400,
            body: err,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

const delay = ms => new Promise(res => setTimeout(res, ms));

function requestQuery(containerName, blobName) {

    const subscriptionKey = '0bcf36451df241baa2cad1ba5839cfcc';
    const uriBase = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect';

    const params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
            'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
    };
    let locationUri = "https://bpmstoragespace.blob.core.windows.net/" + containerName + "/" + blobName;
    //let locationUri  = "https://firstazurefunctstorage.blob.core.windows.net/images/1.jpg";
    console.log("locationUri", locationUri);

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

// function putFileToContainerJson(containerName, blobName, data) {
//     let opt = {
//         contentSettings : {
//             contentType: 'application/json',
//         }
//     }
//     return new Promise((resolve, reject) => {

//         blobService.createBlockBlobFromText(containerName, blobName, data, opt, err => {
//             if (err) {
//                 reject({
//                     message: "Fail"
//                 });
//             } else {
//                 resolve({
//                     message: "Image upload successfully"
//                 });
//             }
//         });
//     });
// }


// function putFileToContainer(containerName, blobName, data) {
//     //https://azure.github.io/azure-storage-node/BlobService.html
//     let opt = {
//         contentSettings : {
//             contentType: 'image/jpeg',
//             contentEncoding: 'base64'
//         }
//     }
//     return new Promise((resolve, reject) => {
//         blobService.createBlockBlobFromText(containerName, blobName, data, opt, (err,data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         });
//     });
// }