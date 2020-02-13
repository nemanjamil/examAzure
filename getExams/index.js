const Picture = require('../models/picture');
const Exam = require('../models/exam');
const { commonstrings } = require('../utils/strings');
const {
    connectionToDB
} = require('../utils/database');
const {
    responseErrorJson,
    responseOkJson
} = require('../utils/common');

const examssk = process.env.EXAMSSK;
const picturessk = process.env.PICTURESSK;


module.exports = async function (context, req) {

    const tablePage = req.body.page;
    const rowsPerTablePage = req.body.rowsPerPage;
    const searchText = req.body.searchText;

    try {
        await connectionToDB();
        const data = await getDataFromDB(tablePage, rowsPerTablePage, searchText);
        let getPictureInfo = await getData(data);
        let jsonOfPicture = await getJsonOfPicturesV2(data, getPictureInfo);
        await setStatusOfExam(jsonOfPicture);
        context.res = await responseOkJson(jsonOfPicture);

        //let jsonOfPicture = await getJsonOfPictures(data,getPictureInfo); // obsolete
        
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}


const setStatusOfExam = async (examDataObject) => {
    return await Promise.all(examDataObject.examsList.map(item => countStatusOfExam(item)));
}

const countStatusOfExam = async (el) => {
    if (el.finishTime === null && el.finished === false && el.status === commonstrings.inProgress) {

        let ts = Date.now();
        let currentDT = new Date(ts);

        let examDurationTime = (el.examDurationTime) ? el.examDurationTime : 1;
        let startTime = (el.startTime) ? el.startTime : currentDT;

        var inputDate = new Date(+startTime + 1000 * 60 * examDurationTime);

        let difference = (currentDT - inputDate) / 1000; // difference in milliseconds/1000 =  seconds

        if (difference > 0) {
            try {
                await updateDBforStatusOfExam(el.examId, currentDT);
            } catch (error) {
                let messageBody = {
                    message: "Something has broken " + el.examVersionExternalId
                }
                return Promise.reject(messageBody)
            }
            el.status = difference;
        }


    } else {
        //el.status = "ok"  
    }

    return el
}


const getData = async (seVar) => {
    return await Promise.all(seVar.examsList.map(item => anAsyncFunction(item)));
}
const updateDBforStatusOfExam = async (examId, currentDT) => {

    try {
        data = {
            status: 'Aborted by user',
            finishTime: currentDT,
            finished: true
        }

        let examUpdate = await Exam.findOneAndUpdate({
            examId: examId,
            examssk: examssk
        }, {
            $set: data
        }, {
            new: true
        });

        // [TODO]  if (examUpdate.length>0)
        return examUpdate;

    } catch (error) {

        let messageBody = {
            message : "Error updating exam start time",
            error: error,
            stateoferror: 90
        }
        return Promise.reject(messageBody);
    }
}


const anAsyncFunction = async item => {
    try {
        let value = await item.examId;
        let result = await Picture.find({
            examId: value,
            picturessk : picturessk
        });
        return Promise.resolve(result)
    } catch (error) {
        let messageBody = {
            message: "Error Picture fetching data"
        }
        return Promise.reject(messageBody)
    }
}

const getJsonOfPicturesV2 = async (data, getPictureInfo) => {
    return Promise.all(getPictureInfo.map(item => onelistOfPicturesv2(item))).then(response => {

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
// obsolete
const getJsonOfPictures = async (data, getPictureInfo) => {
    return Promise.all(getPictureInfo.map(item => onelistOfPictures(item))).then(response => {

        let newArray = []
        data.examsList.forEach((element, i) => {
            let newObj = {
                ...element._doc
            }
            newObj.pictures = response[i]
            newArray.push(newObj)
        });
        finalObject = {};
        finalObject.numberOfExams = data.numberOfExams;
        finalObject.examsList = newArray;
        return finalObject;
    })
}

const onelistOfPicturesv2 = async item => {
    
    return await Promise.all(item.map(element => oneJsonPictureV2(element))).then(data => {

        var noFaces = 0;
        var oneFace = 0;
        var moreFaces = 0;

        data.forEach(element => {
            let numberOfFaces = element.stateOfPicture
            if (numberOfFaces == 0) {
                noFaces++
            } else if (numberOfFaces == 1) {
                oneFace++
            } else {
                moreFaces++
            }
        });
        return {
            noFaces,
            oneFace,
            moreFaces
        }
    });
}

// obsolete
const onelistOfPictures = async item => {
    return await Promise.all(item.map(element => oneJsonPicture(element))).then(data => {
        var noFaces = 0;
        var oneFace = 0;
        var moreFaces = 0;

        data.forEach(element => {
            let numberOfFaces = element.numberOfFaces
            if (numberOfFaces == 0) {
                noFaces++
            } else if (numberOfFaces == 1) {
                oneFace++
            } else {
                moreFaces++
            }
        });
        return {
            noFaces,
            oneFace,
            moreFaces
        }
    });
}

// obsolete
const oneJsonPicture = async element => {
    let pictureJSON = await element.pictureJSON;
    let numberOfFaces = await JSON.parse(pictureJSON).length;
    return Promise.resolve({
        numberOfFaces
    });
}

const oneJsonPictureV2 = async element => {
    return Promise.resolve({
        stateOfPicture: element.stateOfPicture
    });
}

const getDataFromDB = async (tablePage, rowsPerTablePage, searchText) => {
    try {

        let numberOfExams;

        if (!searchText) {
            numberOfExams = await Exam.estimatedDocumentCount();
        } else {
            const examsContainingSearchText = await Exam.find({
                $or: [{
                        "userName": {
                            "$regex": searchText,
                            "$options": "i"
                        }
                    },
                    {
                        "userLastName": {
                            "$regex": searchText,
                            "$options": "i"
                        }
                    },
                    {
                        "examId": {
                            "$regex": searchText,
                            "$options": "i"
                        }
                    }
                ]
            });
            numberOfExams = examsContainingSearchText.length;
        }


        const result = await Exam.find(
                searchText ? {
                    $or: [{
                            "userName": {
                                "$regex": searchText,
                                "$options": "i"
                            }
                        },
                        {
                            "userLastName": {
                                "$regex": searchText,
                                "$options": "i"
                            }
                        },
                        {
                            "examId": {
                                "$regex": searchText,
                                "$options": "i"
                            }
                        }
                    ]
                } : {},
                null, {
                    sort: {
                        _id: 'descending'
                    }
                })
            .skip(tablePage * rowsPerTablePage)
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