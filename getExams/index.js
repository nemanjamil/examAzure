
const Exam = require('../models/exam');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson } = require('../utils/common');


module.exports = async function (context, req) {

    try {
        await connectionToDB();
        await getDataFromDB(context);
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const getDataFromDB = async (context) => {
    try {
        const result = await Exam.find();
        context.res = {
            status: 200,
            body: result
            // headers: {
            //     // 'Location': redirect
            // },
        };
        context.done();
        // let messageBody = {
        //     message: "Data fetch successfully"
        // }
        // return Promise.resolve(messageBody);
    } catch (error) {
        let messageBody = {
            message: "Error fetching data"
        }
        return Promise.reject(messageBody)
    }
}






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


