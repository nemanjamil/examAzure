
const Exam = require('../models/exam');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');


module.exports = async function (context, req) {

    const tablePage = req.body.page;
    const rowsPerTablePage = req.body.rowsPerPage;

    try {
        await connectionToDB();
        const data = await getDataFromDB(tablePage, rowsPerTablePage);

        context.res = await responseOkJson(data);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const getDataFromDB = async (tablePage, rowsPerTablePage) => {
    try {

        const numberOfExams = await Exam.count();
        
        const result = await Exam.find({}, null, {sort: {_id: 'descending'}})
        .skip(tablePage*rowsPerTablePage)
        .limit(rowsPerTablePage);

        const data = {
            numberOfExams: numberOfExams,
            examsList: result
        }

        return data;

        // context.res = {
        //     status: 200,
        //     body: result
        //     // headers: {
        //     //     // 'Location': redirect
        //     // },
        // };
        // context.done();
        // // let messageBody = {
        // //     message: "Data fetch successfully"
        // // }
        // // return Promise.resolve(messageBody);
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


