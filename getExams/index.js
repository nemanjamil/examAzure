const Picture = require('../models/picture');
const Exam = require('../models/exam');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');


module.exports = async function (context, req) {

    const tablePage = req.body.page;
    const rowsPerTablePage = req.body.rowsPerPage;

    try {
        await connectionToDB();
        const data = await getDataFromDB(tablePage, rowsPerTablePage);
        let getPictureInfo = await getData(data); 
        let jsonOfPicture = await getJsonOfPictures(data,getPictureInfo);
        context.res = await responseOkJson(jsonOfPicture);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const getData = async (seVar) => {
    return await Promise.all(seVar.examsList.map(item => anAsyncFunction(item)));
}

const anAsyncFunction = async item => {
     try {
         let value =  await item.examId;
         let result = await Picture.find({ examId: value});
         return Promise.resolve(result)
     } catch (error) {
         let messageBody = {
             message: "Error Picture fetching data"
         }
         return Promise.reject(messageBody)
     }
 }

 const getJsonOfPictures = async (data,getPictureInfo) => {
    return Promise.all(getPictureInfo.map(item => onelistOfPictures(item))).then(response => {
        
         let newArray = []
         data.examsList.forEach((element,i) => {
              let newObj = {...element._doc}
              newObj.pictures = response[i]
              newArray.push(newObj)
         });
         finalObject = {};
         finalObject.numberOfExams = data.numberOfExams;
         finalObject.examsList = newArray;
         return finalObject; 
    })
 }

const onelistOfPictures = async item => {
    return await Promise.all(item.map(element => oneJsonPicture(element))).then(data => {
        var noFaces = 0;
        var oneFace = 0;
        var moreFaces = 0;
        
        data.forEach(element => {
            let numberOfFaces = element.numberOfFaces
            if (numberOfFaces==0) {
                noFaces++
            } else if (numberOfFaces==1) {
                oneFace++
            } else {
                moreFaces++
            }
        });
        return {noFaces, oneFace, moreFaces}
    });
}
const oneJsonPicture = async element => {
    let pictureJSON =  await element.pictureJSON;
    let numberOfFaces = await JSON.parse(pictureJSON).length;
    return Promise.resolve({numberOfFaces});
}

const getDataFromDB = async (tablePage, rowsPerTablePage) => {
    try {

        const numberOfExams = await Exam.estimatedDocumentCount();
        
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


