const Utils = require('../utils/utilsBlob');
//const examtemplatecontainer = process.env.examtemplatecontainer;
const containerName = process.env.examsuser;
const subscriptionKeyCognito = process.env.subscriptionKeyCognito;
const secret_key = process.env.secret_key;
const { verifyToken, responseOkJson, responseErrorJson } = require('../utils/common');
const Picture = require('../models/picture');
const picturessk = process.env.PICTURESSK;
const path = require('path');
const { connectionToDB } = require('../utils/database');

const {
    parse
} = require('querystring');
const uuidv1 = require('uuid/v1');
const request = require('request');
const COGNITO_URL = process.env.COGNITO_URL;
const REACT_APP_SHARED_ACCESS_SIGNATURES = process.env.REACT_APP_SHARED_ACCESS_SIGNATURES;

module.exports = async function (context, req) {

    const token = req.headers.authorization;
    //let parses = parse(req.body);
    let slika = req.body.image;
    var eventId = req.body.eventId;
    var questionId = req.body.questionId;

    let matches = slika.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = Buffer.from(matches[2], 'base64');

    let uid = uuidv1();
    let extensionImage = type.split("/")[1];


    try {

        let verifyTokenResponse = await verifyToken(token, secret_key);

        // ovo izgleda nista ne radi kad console.log ne dobijem nista???????
        let blobName = await createNamePath(verifyTokenResponse, eventId, uid, extensionImage);

        var data = await Utils.uploadImageToContainder(containerName, blobName, buffer, type)  // upload picture to container
        //await delay(5000)
        let responseFromCognitive = await requestQuery(containerName, blobName); // call Cognito on uploaded image

        let extensionJson = "json"; // upload json that is received from cognito
        let blobNameJson = await createNamePath(verifyTokenResponse, eventId, uid, extensionJson);
        var data = await Utils.putFileToContainerJson(containerName, blobNameJson, responseFromCognitive);

        // Remove sensible information from uploadImage response data
        delete data.container;
        delete data.name;

        // Saving picture data to Database
        await connectionToDB();
        const pictureSaveResult = await savePictureInDB(context, eventId, questionId, blobName, verifyTokenResponse, responseFromCognitive);

        response = {
            putFileToContainerJSON: data,
            pictureSaveResult: pictureSaveResult
        }

        context.res = await responseOkJson(response);

    } catch (err) {
        context.res = await responseErrorJson(err);
    }
};


const savePictureInDB = async (context, eventId, questionId, blobName, verifyTokenResponse, pictureJSON) => {

    const examId = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID;

    try {

        //const picturessk = examId;

        const picture = new Picture({
            pictureId: path.basename(blobName, '.jpeg'),
            eventId: eventId,
            time: new Date(),
            examId: examId,
            questionId: questionId,
            pictureJSON: pictureJSON,
            picturessk: picturessk
        });

        let pictureSave = await picture.save();
        pictureSave = pictureSave.toObject();
        delete pictureSave['_id'];
        delete pictureSave['picturessk'];

        return pictureSave;

    } catch (error) {
        return Promise.reject("Error saving picture data");
    }

}

const delay = ms => new Promise(res => setTimeout(res, ms));

function createNamePath(verifyTokenResponse, eventId, uid, extensionImage) {
    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/images/" +
        eventId + '/data/' +
        uid + "." +
        extensionImage;
}

function requestQuery(containerName, blobName) {

    const uriBase = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect';
    const params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
            'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
    };
    // "https://bpmstoragespace.blob.core.windows.net/"
    let locationUri = COGNITO_URL + containerName + "/" + blobName+REACT_APP_SHARED_ACCESS_SIGNATURES;
    
    const options = {
        uri: uriBase,
        qs: params,
        // json: true
        body: '{"url": ' + '"' + locationUri + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKeyCognito
        }
    };

    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                // let bodyParse = JSON.parse(body);
                // if (bodyParse.error) {
                //     reject(bodyParse.error.message)
                // }
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