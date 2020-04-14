const Exam = require('../models/exam');
const Picture = require('../models/picture');
const { handleMongoConnection } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');

module.exports = async function (context, req) {
    context.log('Get PICTURES INFO FROM LIST OF EXAMS - context');

    const tablePage = req.body.page;
    const rowsPerTablePage = req.body.rowsPerPage;

    try {
        // await connectionToDB("getPicturesInfoFromListOfExams");
        let data = await getDataFromDB(tablePage, rowsPerTablePage);

        let getPictureInfo = await getData(data); // https://flaviocopes.com/javascript-async-await-array-map/
        
        let jsonOfPicture = await getJsonOfPictures(data,getPictureInfo);
      
        let handleMongoConn = await handleMongoConnection()

        context.res = await responseOkJson(jsonOfPicture, handleMongoConn);
       
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }
};
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
            message: "Error Picture fetching data -> "
        }
        return Promise.reject(messageBody)
    }
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

    } catch (error) {
        let messageBody = {
            message: error
        }
        return Promise.reject(messageBody)
    }
}