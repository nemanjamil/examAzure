'use strict';
var accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
var storageAccount = 'firstazurefunctstorage';
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(storageAccount, accessKey);
const request = require('request');
// https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string
    
module.exports = async function (context, myBlob) {
        
    let responseFromCognitive = await requestCognitive(context);
    let uploadJsonToBlob = await uploadToBlobFromCognitive(responseFromCognitive,context); 
    let uploadImageToExamsData = await startCopyBlob(context); 

    context.log("### Function completed");

};


function startCopyBlob(context) {
   
    let opt = {
        contentSettings : {
            contentType: 'image/jpeg',
            contentEncoding: 'base64'
        }
    }

    console.log("context", context);
    console.log("context", context.bindingData.uri);
    return new Promise((resolve, reject) => {

        let targetContainer = "exams";
        let targetBlob = context.bindingData.blobname+".jpg";
        let sourceUri = context.bindingData.uri; 

        blobService.startCopyBlob(sourceUri,targetContainer, targetBlob, function(err, result, response) {
            console.log("err",err);
            console.log("result",result);
            console.log("response",response);
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

function uploadToBlobFromCognitive(responseFromCognitive,context){
    // "path": "images/{rand-guid}.json", 
    context.log("context : ", context);
    
    return new Promise((resolve, reject) => {
        let resp = {}
        resp.srcUrl = responseFromCognitive;
        resp.timestamp = new Date().getTime();
        resp.dateTime = new Date().toISOString();
        context.bindings.myOutputBlob = responseFromCognitive; 
        //context.bindingsMetadata.myOutputBlob.properties = {contentType:'application/json'};
        if (context.bindings.myOutputBlob) {
            resolve("Ok from Cognitive")
        } else {
            reject("error")
        } 
    })
}

function requestCognitive(context) {

    const subscriptionKey = '7b604bccc07842bca4ff933e495d2d4e';
    const uriBase = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect';
   
    const params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
            'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
    };

    const options = {
        uri: uriBase,
        qs: params,
        body: '{"url": ' + '"' + context.bindingData.uri + '"}',
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