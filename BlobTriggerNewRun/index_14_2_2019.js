'use strict';
const request = require('request');
// https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string
    
module.exports = async function (context, myBlob) {
    
    const subscriptionKey = '7b604bccc07842bca4ff933e495d2d4e';
    const uriBase = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect';
    const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg';

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

    
    let responseFromCognitive = await requestQuery(options);
    let getCogitive = await requestCongnitive(responseFromCognitive,context); 

    context.log("### Function completed");
    //return;

};

function requestCongnitive(responseFromCognitive,context){
    // "path": "images/{rand-guid}.json", 
    context.log("context.bindingData : ", context.bindingData);
    return new Promise((resolve, reject) => {
        let resp = {}
        resp.srcUrl = responseFromCognitive;
        resp.timestamp = new Date().getTime();
        resp.dateTime = new Date().toISOString();
        context.bindings.myOutputBlob = responseFromCognitive; 
        if (context.bindings.myOutputBlob) {
            resolve("Ok from Cognitive")
        } else {
            reject("error")
        } 
    })
}

function requestQuery(options) {
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