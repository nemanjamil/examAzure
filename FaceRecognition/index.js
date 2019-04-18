'use strict';
const request = require('request');

module.exports = async function (context, req) {

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
        body: '{"url": ' + '"' + imageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    let rew = await requestQuery(options);

    context.res = {
        status: 200,
        body: rew
    }


};

function requestQuery(options) {

    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body)
            }
            ///let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
        });
    })


}