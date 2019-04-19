var mongoose = require('mongoose');
const Question = require('../models/question');


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

    await Question.find({
        examName: '222/123/444/222_123_444_score.json'
    })
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
        });

}