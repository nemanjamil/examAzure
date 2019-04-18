const shuffle = require('lodash.shuffle');
const sample = require('lodash.sample');
const Common = require('../utils/common');

let test = {
    "ExamVersion_ID": "",
    "ExamVersion_EXTERNAL_ID": "99293945",
    "ExamVersion_Name": "Exam Set for Syllabus ID [105] for Topic with ID [1] - level 0 - rank 0 - de - de set-1 v-1",
    "ExamVersion_Set": 1,
    "ExamVersion_Version": 1,
    "ExamVersion_SampleSet": false,
    "ExamVersion_QuestionNumber": 30,
    "ExamVersion_maxPoints": 30,
    "ExamVersion_passingPoints": 20,
    "ExamVersion_Language": "de",
    "ExamVersion_Type": "static",
    "BulkEvent_ID": "",
    "BulkEvent_EXTERNAL_ID": "333333",
    "Participant_ID": "",
    "Participant_EXTERNAL_ID": "12345",
    "Participant_MatriculationNumber": "",
    "Participant_Firstname": "Nemanja",
    "Participant_Lastname": "Miliv",
    "Participant_Expert": false,
    "ExamEvent_ID": "",
    "ExamEvent_EXTERNAL_ID": "",
    "ExamEvent_GenerationTime": 1551558584,
    "ExamEvent_ReadyTime": "",
    "ExamEvent_StartTime": "",
    "ExamEvent_EndTime": "",
    "examQuestions": [
        {
            "question_id": "0000000212",
            "question_text": "Is this a question with the ID [212]?",
            "answers": [{
                "answer_id": "0000000264",
                "answer_text": "This answer with id [264] is correct. It is associated to question with ID [212]",
                "correct": 1
            },
            {
                "answer_id": "0000000265",
                "answer_text": "This answer with id [265] is correct. It is associated to question with ID [212]",
                "correct": 1
            },
            {
                "answer_id": "0000000268",
                "answer_text": "This answer with id [268] is wrong. It is associated to question with ID [212]",
                "correct": 0
            }],
            "answersSelected": [],
            "answersHashORG": "hash('sha512', 0000000264000000026512345)",
            "answersHash": "323b0db231cc5338f8fafb87659d5917aa88c224846ec1ad69780625c8ab5986b5fb8fe1e4dd5bab55d07809aeea3d0d0591d1421465860d2b0ddfdfa8d0a64f"
        },
        {
            "question_id": "0000000213",
            "question_text": "Is this a question with the ID [213]?",
            "answers": [{
                "answer_id": "0000000270",
                "answer_text": "This answer with id [270] is correct. It is associated to question with ID [213]",
                "correct": 1
            },
            {
                "answer_id": "0000000272",
                "answer_text": "This answer with id [272] is correct. It is associated to question with ID [213]",
                "correct": 1
            },
            {
                "answer_id": "0000000274",
                "answer_text": "This answer with id [274] is wrong. It is associated to question with ID [213]",
                "correct": 0
            }],
            "answersSelected": [],
            "answersHashORG": "hash('sha512', 0000000270000000027212345)",
            "answersHash": "2652520aa56547709aca9ae1f096da2e912dc277fbb57aab997ecf54b0d536d3d5e353c3c431c76b58765c4abe5c91ab111800f26c9b6aadfcfc4f598b4a1a00"
        }
       
        
    ],
    "ExamVersion_plannedDuration": "45"
};

let examQuestions = test.examQuestions;
let oneQuestionShuffle = test.examQuestions.filter(element => {
    let answersSelected = element.answersSelected;
    if (!answersSelected  || !answersSelected.length) {
        return answersSelected;
    }
})
if (Common.isArray(oneQuestionShuffle)) {

    let samples = sample(oneQuestionShuffle)
    let shuffleRsp =  shuffle(samples.answers);
    samples.answers = shuffleRsp;
   
    delete samples['answersSelected']; 
    delete samples['answersHashORG']; 
    delete samples['answersHash']; 

    samples.answers.forEach(element => {
        delete element['correct']; 
    })
    console.log(samples);
} else {
    //console.log("empty");
}

//let sh = shuffle(oneQuestionShuffle);
//let getOneQuestion = sample(sh);
//console.log("getOneQuestion",getOneQuestion);


// let getJsonExamBlobResponse = {
// 	"examQuestions": [{
// 		"question_id": "0000000183",
// 		"question_text": "Is this a question with the ID [183]?",
// 		"answers": [{
// 			"answer_id": "0000000097",
// 			"answer_text": "This answer with id [97] is correct. It is associated to question with ID [183]",
// 			"correct": 1
// 		},
// 		{
// 			"answer_id": "0000000098",
// 			"answer_text": "This answer with id [98] is correct. It is associated to question with ID [183]",
// 			"correct": 1
// 		},
// 		{
// 			"answer_id": "0000000099",
// 			"answer_text": "This answer with id [99] is wrong. It is associated to question with ID [183]",
// 			"correct": 0
// 		}],
// 		"answersSelected": [],
// 		"answersHashORG": "hash('sha512', 0000000097000000009812345)",
// 		"answersHash": "fa26f0ca9708a55a556f1b0522d12c587474691446efe5f9048a17f5b32b22a463eb79c5c2f97c307f1585189d5172f3c4eb9dd2f95630170b2d5ed1940540f0"
// 	}],
// 	"ExamVersion_plannedDuration": "45"
// }


//     console.log("getJsonExamBlobResponse",getJsonExamBlobResponse.examQuestions);