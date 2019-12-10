const Utils = require('../utils/utilsBlob');
const containerName = process.env.examsuser;
const accessKey = process.env.accessKey;
const storageAccount = process.env.storageAccount;
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(storageAccount, accessKey);
const secret_key = process.env.secret_key;
const getStream = require('into-stream');
const multipartFormdata = require('multipart-formdata')
const request = require('request');
const Picture = require('../models/picture');
const {
    connectionToDB
} = require('../utils/database');

const {
    verifyToken,
    responseOkJson,
    responseErrorJson
} = require('../utils/common');

const uuidv1 = require('uuid/v1');

let subscriptionKey = process.env.COMPUTER_VISION_SUBSCRIPTION_KEY
let endpoint = process.env.COMPUTER_VISION_ENDPOINT
if (!subscriptionKey) {
    throw new Error('Set your environment variables for your subscription key and endpoint.');
}


module.exports = async function (context, req) {

    const uriBase = endpoint + 'vision/v2.1/analyze';

    const token = req.headers.authorization;
    const boundary = multipartFormdata.getBoundary(req.headers['content-type'])
    const parts = multipartFormdata.parse(req.body, boundary);

    const length = parts[0].data.length;
    const data = getStream(parts[0].data);
    const imageType = parts[0].type;
    const extensionImage = imageType.split("/")[1];
    const eventId = parts[1].field;
    const questionId = parts[2].field;
    const uid = uuidv1();


    try {
        let verifyTokenResponse = await verifyToken(token, secret_key);
        let blobName = createNamePath(verifyTokenResponse, eventId, uid, extensionImage);
        let uploadImageToContainderRes = await uploadImageToContainder(containerName, blobName, data, length);
        let requestComputerVisionResponse = await requestComputerVision(parts, uriBase, subscriptionKey);

        let extensionJson = "json";
        let blobNameJson = createNamePath(verifyTokenResponse, eventId, uid, extensionJson);
        var putFileToContainerJsonResponse = await Utils.putFileToContainerJson(containerName, blobNameJson, requestComputerVisionResponse);

        await connectionToDB();
        const pictureSaveResult = await savePictureInDB(eventId, questionId, blobName, verifyTokenResponse, requestComputerVisionResponse, uid);

        response = {
            "uploadImageToContainderRes": uploadImageToContainderRes,
            "requestComputerVisionResponse": requestComputerVisionResponse,
            "putFileToContainerJsonResponse": putFileToContainerJsonResponse,
            "pictureSaveResult": pictureSaveResult
        }

        context.res = await responseOkJson(response);


    } catch (err) {
        context.res = await responseErrorJson(err);
    }
};

function createNamePath(verifyTokenResponse, eventId, uid, extensionImage) {
    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/images/" +
        eventId + '/data/' +
        uid + "." +
        extensionImage;
}

const uploadImageToContainder = async (containerName, blobName, data, length) => {
    let opt = {
        contentSettings: {
            contentType: "image/jpeg",
        },
        metadata: {
            contentType: "image/jpeg"
        }
    }
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromStream(containerName, blobName, data, length, opt, function (error, result, response) {
            if (error) {
                reject(error)
            } else {
                resolve("Blob is created")
            }
        });
    })
}

const requestComputerVision = async (parts, uriBase, subscriptionKey) => {

    const params = {
        'visualFeatures': 'Categories,Description,Color,Objects,Faces,Tags',
        'details': '',
        'language': 'en'
    };

    const options = {
        uri: uriBase,
        qs: params,
        body: parts[0].data,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    return new Promise(function (resolve, reject) {
        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                reject(error)
            }
            resolve("Congnito resolved")
        });
    });
}

const savePictureInDB = async (eventId, questionId, blobName, verifyTokenResponse, pictureJSON, uid) => {


    let examId = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID;

    //const picturessk = examId;

    let insertObj = {
        pictureId: uid, //path.basename(blobName, '.jpeg'),
        eventId: eventId,
        time: new Date(),
        examId: examId,
        stateOfPicture: 1,
        questionId: questionId,
        pictureJSON: pictureJSON,
        picturessk: "picturesk" //picturessk
    }

    const picture = new Picture(insertObj);
    return new Promise((resolve, reject) => {
        picture.save(function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve("Inserted")
            }
        });
    })
}