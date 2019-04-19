const azureStorage = require('azure-storage')
var multipart = require("parse-multipart");
// "dataType": "binary",
const miki = async function (context, req) {
    console.log("req", req);
    // var bodyBuffer = new Buffer(req.body, "binary");
     var bodyBuffer = new Buffer(req.body.toString(),"base64"); 
    // var bodyBuffer = Buffer.from(req.body,'base64'); 
    // var bodyBuffer = Buffer.from(req.body.toString('base64'));
    var boundary = multipart.getBoundary(req.headers['content-type']);
    let parts = multipart.Parse(bodyBuffer, boundary);

    console.log(parts);
    context.res = {
        status: 200,
        body: "aa"
    };
};
module.exports = miki;