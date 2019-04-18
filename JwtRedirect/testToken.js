<<<<<<< HEAD
var jwt = require('jsonwebtoken');

let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI5OTAwIiwiZmlyc3RuYW1lIjoiUm9iIiwibGFzdG5hbWUiOiJNXHUwMGZjbGxhIiwiZXhhbV92YWxpZF9mb3IiOiIzNjAwIiwiZXhhbV9pZCI6IjEzMTMxMyIsImV2ZW50X2lkIjoiMzIxIiwiZXhwIjoxNTUxNjc5MDExfQ.cV4oF7i9EbbNggXHJISBHm83Q--M06Niao71dVh-FmA';
var decoded = jwt.decode(token, {complete: true});
console.log(decoded.header);
console.log(decoded.payload);
let secret_key = 'bmp_space_165423106546545';
jwt.verify(token, secret_key, function(err, decoded) {
    if (err) {
        console.log("err", err.name, err.message);
    } else {
        console.log("decoded TRUE", decoded);
    }
  });

  let m =  {
      "ExamVersion_ID": "",
      "ExamVersion_EXTERNAL_ID": "99293945",
      "ExamVersion_Name": "Exam Set for Syllabus ID [105] for Topic with ID [1] - level 0 - rank 0 - de - de set-1 v-1",
      "ExamVersion_Set": 1,
      "ExamVersion_Version": 1,
      "ExamVersion_SampleSet": false,
      "ExamVersion_QuestionNumber": 30,
      "ExamVersion_maxPoints": 30,
      "ExamVersion_passingPoints": 20,
      "ExamVersion_plannedDuration": 45,
      "ExamVersion_Language": "de",
      "ExamVersion_Type": "static",
      "BulkEvent_ID": "",
      "BulkEvent_EXTERNAL_ID": "",
      "Participant_ID": "",
      "Participant_EXTERNAL_ID": "",
      "Participant_MatriculationNumber": "",
      "Participant_Firstname": "",
      "Participant_Lastname": "",
      "Participant_Expert": false,
      "ExamEvent_ID": "",
      "ExamEvent_EXTERNAL_ID": "",
      "ExamEvent_GenerationTime": "",
      "ExamEvent_ReadyTime": "",
      "ExamEvent_StartTime": "",
      "ExamEvent_EndTime": ""
  }

  
  
 // console.log("aaaa",m.ExamVersion_EXTERNAL_ID);


=======
var jwt = require('jsonwebtoken');

let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI5OTAwIiwiZmlyc3RuYW1lIjoiUm9iIiwibGFzdG5hbWUiOiJNXHUwMGZjbGxhIiwiZXhhbV92YWxpZF9mb3IiOiIzNjAwIiwiZXhhbV9pZCI6IjEzMTMxMyIsImV2ZW50X2lkIjoiMzIxIiwiZXhwIjoxNTUxNjc5MDExfQ.cV4oF7i9EbbNggXHJISBHm83Q--M06Niao71dVh-FmA';
var decoded = jwt.decode(token, {complete: true});
console.log(decoded.header);
console.log(decoded.payload);
let secret_key = 'bmp_space_165423106546545';
jwt.verify(token, secret_key, function(err, decoded) {
    if (err) {
        console.log("err", err.name, err.message);
    } else {
        console.log("decoded TRUE", decoded);
    }
  });

  let m =  {
      "ExamVersion_ID": "",
      "ExamVersion_EXTERNAL_ID": "99293945",
      "ExamVersion_Name": "Exam Set for Syllabus ID [105] for Topic with ID [1] - level 0 - rank 0 - de - de set-1 v-1",
      "ExamVersion_Set": 1,
      "ExamVersion_Version": 1,
      "ExamVersion_SampleSet": false,
      "ExamVersion_QuestionNumber": 30,
      "ExamVersion_maxPoints": 30,
      "ExamVersion_passingPoints": 20,
      "ExamVersion_plannedDuration": 45,
      "ExamVersion_Language": "de",
      "ExamVersion_Type": "static",
      "BulkEvent_ID": "",
      "BulkEvent_EXTERNAL_ID": "",
      "Participant_ID": "",
      "Participant_EXTERNAL_ID": "",
      "Participant_MatriculationNumber": "",
      "Participant_Firstname": "",
      "Participant_Lastname": "",
      "Participant_Expert": false,
      "ExamEvent_ID": "",
      "ExamEvent_EXTERNAL_ID": "",
      "ExamEvent_GenerationTime": "",
      "ExamEvent_ReadyTime": "",
      "ExamEvent_StartTime": "",
      "ExamEvent_EndTime": ""
  }

  
  
 // console.log("aaaa",m.ExamVersion_EXTERNAL_ID);


>>>>>>> e67b7ca70cc1c842c725fe60baf866e6a419db9c
  console.log(Math.floor(new Date() / 1000));