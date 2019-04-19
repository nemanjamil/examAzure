
var mongoose = require('mongoose');
const Exam = require('../models/exam');


module.exports = async function (context, req) {

    await mongoose.connect(`${process.env.COSMOSDB_CONNSTR}/exams` + "?ssl=true&replicaSet=globaldb", {
        useNewUrlParser: true,
        auth: {
            user: process.env.COSMODDB_USER,
            password: process.env.COSMOSDB_PASSWORD
        }
    })
        .then(() => {
            console.log('Connection to CosmosDB successful');
        })
        .catch((err) => console.error(err));

    await Exam.find()
        .then(result => {
            context.res = {
                status: 200,
                body: result
                // headers: {
                //     // 'Location': redirect
                // },
            };
            context.done();
        })
        .catch(err => {
            console.log(err);
        })





    // var MongoClient = require('mongodb').MongoClient;
    // module.exports = function (context, req) {
    //     MongoClient.connect(process.env.CosmosDBConnectionString, {
    //         useNewUrlParser: true
    //     }, (err, client) => {    
    //         let send = response(client, context);

    //         if (err) send(500, err.message);

    //         let db = client.db('admin');

    //         db
    //             .collection('heros')
    //             .find({})
    //             .toArray((err, result) => {
    //                 if (err) send(500, err.message);

    //                 send(200, JSON.parse(JSON.stringify(result)));
    //             });
    //     });
    // };

    // function response(client, context) {
    //     return function (status, body) {
    //         context.res = {
    //             status: status,
    //             body: body
    //         };

    //         client.close();
    //         context.done();
    //     };
}

