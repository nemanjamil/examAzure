var http = require('http');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    console.log("context", context);
    var timeStamp = new Date().toISOString();
    context.log('Node.js timer trigger function ran!', timeStamp);
    context.log("AzureWebJobsStorage: " + process.env["AzureWebJobsStorage"]);
    context.log("WEBSITE_SITE_NAME: " + process.env["WEBSITE_SITE_NAME"]);

    context.res = {
        body: { 
            body : req.body,
            plaintext : "OK",
            timestamp : timeStamp,
            contextbindingData: context.bindingData
            
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };
    //context.bindings.outputBlob = "Nemanja Test : "+ timeStamp; 

    context.done();
    
    
};