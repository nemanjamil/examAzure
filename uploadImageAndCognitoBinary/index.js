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
const picturessk = process.env.PICTURESSK;
const {
    disconectFromDB,
    connectionToDB,
    readyStateMongoose,
    closeMongoDbConnection 
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

        let calculateCognitoResponse  = await calculateCongnito(requestComputerVisionResponse)

        let extensionJson = "json";
        let blobNameJson = createNamePath(verifyTokenResponse, eventId, uid, extensionJson);
        var putFileToContainerJsonResponse = await Utils.putFileToContainerJson(containerName, blobNameJson, requestComputerVisionResponse.body);

        await connectionToDB();
        const pictureSaveResult = await savePictureInDB(eventId, questionId, blobName, 
            verifyTokenResponse, requestComputerVisionResponse.body, uid,
            calculateCognitoResponse);

     
        let disconectFromDBRsp =  await disconectFromDB();
        let closeMongoDbConnectionResp = await closeMongoDbConnection();
        let stateOfMongoDb = await readyStateMongoose();

        response = {
            "uploadImageToContainderRes": uploadImageToContainderRes,
            "requestComputerVisionResponse": requestComputerVisionResponse.message,
            "putFileToContainerJsonResponse": putFileToContainerJsonResponse,
            "closeMongoDbConnectionResp" : closeMongoDbConnectionResp,
            "disconectFromDBRsp" : disconectFromDBRsp,
            "stateOfMongoDb" : stateOfMongoDb,
            "pictureSaveResult": pictureSaveResult
        }

        context.res = await responseOkJson(response);
        context.done();

    } catch (err) {
        context.res = await responseErrorJson(err);
    }
    context.done();
};

const  calculateCongnito = async (requestComputerVisionResponse) => {

    let cognitoRes = await JSON.parse(requestComputerVisionResponse.body)
    
    let numberOfObjects = cognitoRes.objects.length
    let numberOfFaces = cognitoRes.faces.length
    var numberOfPersons = cognitoRes.objects.reduce((acc, cur) => cur.object === "person" ? ++acc : acc, 0);

    let stateOfPicture = 0;
    if (numberOfPersons==1) {
        stateOfPicture = 1;
    } else if (numberOfPersons>1) {
        stateOfPicture = 2 
    } 

    return {
        "stateOfPicture" : stateOfPicture,
        "numberOfObjects" : numberOfObjects,
        "numberOfFaces" : numberOfFaces,
        "numberOfPersons" : numberOfPersons,
        "tags" : cognitoRes.tags
    }
}

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
            resolve({ "body" : body, "message" : "Cognito Resolved"})
        });
    });
}

const savePictureInDB = async (eventId, questionId, blobName, verifyTokenResponse, pictureJSON, uid, calculateCognitoResponse) => {


    let examId = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID;

    //const picturessk = examId;

    let insertObj = {
        pictureId: uid, //path.basename(blobName, '.jpeg'),
        eventId: eventId,
        time: new Date(),
        examId: examId,
        stateOfPicture: calculateCognitoResponse.stateOfPicture,
        numberOfObjects: calculateCognitoResponse.numberOfObjects,
        numberOfFaces: calculateCognitoResponse.numberOfFaces,
        numberOfPersons: calculateCognitoResponse.numberOfPersons,
        numberOfTags: calculateCognitoResponse.tags,
        questionId: questionId,
        pictureJSON: pictureJSON,
        picturessk: picturessk
    }

    const picture = new Picture(insertObj);

    try {
        let picSave = await picture.save();
        let picCost = await picture.db.db.command({getLastRequestStatistics:1});
        return {picSave,picCost}

    } catch (error) {
        Promise.reject(error);
    }
  
}