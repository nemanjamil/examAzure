const Picture = require('../models/picture');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');


module.exports = async function (context, req) { 

    const examId = req.body.examId;
    const picturessk = process.env.PICTURESSK;
    const tablePage = req.body.tablePage;
    const rowsPerTablePage = req.body.rowsPerTablePage;

    let filters = ['all'];
    if(req.body.hasOwnProperty('filters')){
        filters = req.body.filters;
    }

    let orderFilter = -1 // descending (latestFirst)
    if(req.body.hasOwnProperty('orderFilter')){
        if(req.body.orderFilter === 'oldestFirst') orderFilter = 1  // ascending
    }

    try {
        await connectionToDB();
        const getGalleryData = await getDataFromDB(context, examId, tablePage, rowsPerTablePage, filters, picturessk, orderFilter);
        context.res = await responseOkJson(getGalleryData);
    } catch (error) {
        context.res = await responseErrorJson(error);
    }

}

const getDataFromDB = async (context, examId, tablePage, rowsPerTablePage, filters, picturessk, orderFilter) => {
    try {

        let searchParams = {
            'examId': examId,
            'picturessk' : picturessk,
            'stateOfPicture' : []
        }

        if(filters){
            filters.map(filter => {
                switch(filter){
                    case 'all': delete searchParams['stateOfPicture']; break;
                    case 'noFace': searchParams.stateOfPicture.push(0); break;
                    case 'oneFace': searchParams.stateOfPicture.push(1); break;
                    case 'moreFaces': searchParams.stateOfPicture.push(2); break;
                    default: break;
                }
            })
        }

        const picturesPerRow = 2;

        const galleryData = await Picture
            .find(searchParams)
            .sort({_id: orderFilter})
            .skip(tablePage * rowsPerTablePage * picturesPerRow)
            .limit(rowsPerTablePage * picturesPerRow);

        const numberOfPictures = (await Picture.find(searchParams)).length;
        searchParams.stateOfPicture = 1;
        const numberOfValidPictures = (await Picture.find(searchParams)).length;

        const data = {
            galleryData: galleryData,
            numberOfPictures: numberOfPictures,
            numberOfValidPictures: numberOfValidPictures,
            areAllPicturesValid: numberOfPictures === numberOfValidPictures
        }

        return data
    } catch (error) {
        console.log(error);
        return Promise.reject(error)
    }
}

