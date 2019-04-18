var MongoClient = require('mongodb').MongoClient;
module.exports = function (context, req) {
    MongoClient.connect(process.env.CosmosDBConnectionString, {
        useNewUrlParser: true
    }, (err, client) => {    
        let send = response(client, context);

        if (err) send(500, err.message);

        let db = client.db('admin');

        db
            .collection('heros')
            .find({})
            .toArray((err, result) => {
                if (err) send(500, err.message);

                send(200, JSON.parse(JSON.stringify(result)));
            });
    });
};

function response(client, context) {
    return function (status, body) {
        context.res = {
            status: status,
            body: body
        };

        client.close();
        context.done();
    };
}

// module.exports = async function (context, req) {
//     context.log('JavaScript HTTP trigger function processed a request.');

//     if (req.query.name || (req.body && req.body.name)) {
//         context.res = {
//             // status: 200, /* Defaults to 200 */
//             body: "Hello " + (req.query.name || req.body.name)+ ". How are you?"
//         };
//     }
//     else {
//         context.res = {
//             status: 400,
//             body: "Please pass a name on the query string or in the request body."
//         };
//     }
// };