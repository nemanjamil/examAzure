const { isArray } = require('../utils/common');
let answers = ["0000000172","0000000173"];
console.log(isArray(answers)); 


// function isItArrayAnswer(answers){
//     if (isArray(answers)) {
//         return Promise.resolve({message : "ok"})
//     } else {
//         return Promise.reject({message : "Answers is not an array"})
//     }
// }


let m = {
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
	"BulkEvent_EXTERNAL_ID": "333",
	"Participant_ID": "",
	"Participant_EXTERNAL_ID": "111",
	"Participant_MatriculationNumber": "",
	"Participant_Firstname": "Dare",
	"Participant_Lastname": "Ns",
	"Participant_Expert": false,
	"ExamEvent_ID": "",
	"ExamEvent_EXTERNAL_ID": "222",
	"ExamEvent_GenerationTime": 1551732517,
	"ExamEvent_ReadyTime": "",
	"ExamEvent_StartTime": "",
	"ExamEvent_EndTime": "",
	"examQuestions": [{
		"question_id": "0000000183",
		"question_text": "Is this a question with the ID [183]?",
		"answers": [{
			"answer_id": "0000000097",
			"answer_text": "This answer with id [97] is correct. It is associated to question with ID [183]",
			"correct": 1
		},
		{
			"answer_id": "0000000098",
			"answer_text": "This answer with id [98] is correct. It is associated to question with ID [183]",
			"correct": 1
		},
		{
			"answer_id": "0000000099",
			"answer_text": "This answer with id [99] is wrong. It is associated to question with ID [183]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000097000000009812345)",
		"answersHash": "fa26f0ca9708a55a556f1b0522d12c587474691446efe5f9048a17f5b32b22a463eb79c5c2f97c307f1585189d5172f3c4eb9dd2f95630170b2d5ed1940540f0"
	},
	{
		"question_id": "0000000184",
		"question_text": "Is this a question with the ID [184]?",
		"answers": [{
			"answer_id": "0000000092",
			"answer_text": "This answer with id [92] is correct. It is associated to question with ID [184]",
			"correct": 1
		},
		{
			"answer_id": "0000000093",
			"answer_text": "This answer with id [93] is correct. It is associated to question with ID [184]",
			"correct": 1
		},
		{
			"answer_id": "0000000096",
			"answer_text": "This answer with id [96] is wrong. It is associated to question with ID [184]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000092000000009312345)",
		"answersHash": "0063b63a6441129326a86fa3f40f8635286ff6c53f798b0830a51c9414b5f39d0b073e1ec01c3ce3f96d600142ad44662419c101ac28a2ff4dfc5c817a4f4b18"
	},
	{
		"question_id": "0000000185",
		"question_text": "Is this a question with the ID [185]?",
		"answers": [{
			"answer_id": "0000000102",
			"answer_text": "This answer with id [102] is correct. It is associated to question with ID [185]",
			"correct": 1
		},
		{
			"answer_id": "0000000105",
			"answer_text": "This answer with id [105] is wrong. It is associated to question with ID [185]",
			"correct": 0
		},
		{
			"answer_id": "0000000106",
			"answer_text": "This answer with id [106] is wrong. It is associated to question with ID [185]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 000000010212345)",
		"answersHash": "6a993184383c55682b44c04b5bd6c7a17315b5d6fc577a14b75d2f9156b1dd0aa392514652f00429419ef101f0cad3546ad8ea3dbeb90e20a23d1e387f2951f6"
	},
	{
		"question_id": "0000000186",
		"question_text": "Is this a question with the ID [186]?",
		"answers": [{
			"answer_id": "0000000108",
			"answer_text": "This answer with id [108] is correct. It is associated to question with ID [186]",
			"correct": 1
		},
		{
			"answer_id": "0000000110",
			"answer_text": "This answer with id [110] is correct. It is associated to question with ID [186]",
			"correct": 1
		},
		{
			"answer_id": "0000000111",
			"answer_text": "This answer with id [111] is wrong. It is associated to question with ID [186]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000108000000011012345)",
		"answersHash": "49fd037fbfc228051673f943578eccf6223907ad6ff166973991ee4361f3fa48f16208c331afc6bf2a54c772108135779900bfdb02e609ef7168c63ecdf27e47"
	},
	{
		"question_id": "0000000187",
		"question_text": "Is this a question with the ID [187]?",
		"answers": [{
			"answer_id": "0000000114",
			"answer_text": "This answer with id [114] is correct. It is associated to question with ID [187]",
			"correct": 1
		},
		{
			"answer_id": "0000000115",
			"answer_text": "This answer with id [115] is correct. It is associated to question with ID [187]",
			"correct": 1
		},
		{
			"answer_id": "0000000119",
			"answer_text": "This answer with id [119] is wrong. It is associated to question with ID [187]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000114000000011512345)",
		"answersHash": "eb9c9c4c185d6a0cc62887f06314601be56254c9e29343cd0e99e98b405529ae8e60a55b35e7a8d4df5806aa8c514067de3e2f72b2fcf877b9d1d389e2ea693c"
	},
	{
		"question_id": "0000000188",
		"question_text": "Is this a question with the ID [188]?",
		"answers": [{
			"answer_id": "0000000121",
			"answer_text": "This answer with id [121] is correct. It is associated to question with ID [188]",
			"correct": 1
		},
		{
			"answer_id": "0000000124",
			"answer_text": "This answer with id [124] is wrong. It is associated to question with ID [188]",
			"correct": 0
		},
		{
			"answer_id": "0000000125",
			"answer_text": "This answer with id [125] is wrong. It is associated to question with ID [188]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 000000012112345)",
		"answersHash": "b7a82eeee2d54a7a805e1300402ea4d3987e8d9b05ab889b8da17bddbd36b391a168329d66dec99fca37decf947e75957c661b75d0c4a28468f27e8b0981c25f"
	},
	{
		"question_id": "0000000189",
		"question_text": "Is this a question with the ID [189]?",
		"answers": [{
			"answer_id": "0000000126",
			"answer_text": "This answer with id [126] is correct. It is associated to question with ID [189]",
			"correct": 1
		},
		{
			"answer_id": "0000000128",
			"answer_text": "This answer with id [128] is correct. It is associated to question with ID [189]",
			"correct": 1
		},
		{
			"answer_id": "0000000130",
			"answer_text": "This answer with id [130] is wrong. It is associated to question with ID [189]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000126000000012812345)",
		"answersHash": "c578d98d6c12d609483bd8be7d3709da1bee84d3c83e75c74ec0b2b3c1d29299de6f43b5f7f81c53d638c07b251d2321a0ea5a67cb4b1a50a9c04a80420af613"
	},
	{
		"question_id": "0000000190",
		"question_text": "Is this a question with the ID [190]?",
		"answers": [{
			"answer_id": "0000000132",
			"answer_text": "This answer with id [132] is correct. It is associated to question with ID [190]",
			"correct": 1
		},
		{
			"answer_id": "0000000134",
			"answer_text": "This answer with id [134] is correct. It is associated to question with ID [190]",
			"correct": 1
		},
		{
			"answer_id": "0000000137",
			"answer_text": "This answer with id [137] is wrong. It is associated to question with ID [190]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000132000000013412345)",
		"answersHash": "d3fdb8eaa5e8f13cdc1dd677f4687d1f98780a8e150dc2cadc9b725149c2c8f0232195bfc5df7557a9d0ea15c60f8e7058a114507f6ee32748920ee7c31aaf43"
	},
	{
		"question_id": "0000000191",
		"question_text": "Is this a question with the ID [191]?",
		"answers": [{
			"answer_id": "0000000138",
			"answer_text": "This answer with id [138] is correct. It is associated to question with ID [191]",
			"correct": 1
		},
		{
			"answer_id": "0000000139",
			"answer_text": "This answer with id [139] is correct. It is associated to question with ID [191]",
			"correct": 1
		},
		{
			"answer_id": "0000000142",
			"answer_text": "This answer with id [142] is wrong. It is associated to question with ID [191]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000138000000013912345)",
		"answersHash": "9b91e662ea9df653f156289b160749cf6f250f46a5798e0d05787cdf36577853e2f1ab9ea7d818a5acd90eaab1a3a4f2dadae50415625c6fdadf448afcdc7846"
	},
	{
		"question_id": "0000000193",
		"question_text": "Is this a question with the ID [193]?",
		"answers": [{
			"answer_id": "0000000150",
			"answer_text": "This answer with id [150] is correct. It is associated to question with ID [193]",
			"correct": 1
		},
		{
			"answer_id": "0000000151",
			"answer_text": "This answer with id [151] is correct. It is associated to question with ID [193]",
			"correct": 1
		},
		{
			"answer_id": "0000000153",
			"answer_text": "This answer with id [153] is wrong. It is associated to question with ID [193]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000150000000015112345)",
		"answersHash": "3572401e17b4e024e78e72306e1aa2e02ddef06af6aca7049fd8845aab4decd2590beb8eae98c3debff8582f1fe77716d2195334c717603000245455ef655bca"
	},
	{
		"question_id": "0000000194",
		"question_text": "Is this a question with the ID [194]?",
		"answers": [{
			"answer_id": "0000000156",
			"answer_text": "This answer with id [156] is correct. It is associated to question with ID [194]",
			"correct": 1
		},
		{
			"answer_id": "0000000159",
			"answer_text": "This answer with id [159] is wrong. It is associated to question with ID [194]",
			"correct": 0
		},
		{
			"answer_id": "0000000160",
			"answer_text": "This answer with id [160] is wrong. It is associated to question with ID [194]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 000000015612345)",
		"answersHash": "6ed309797ad245edcd48727b8136b55b8559411fae3fff22e4f7a979a780d5f9cb53661023f560983e3e56e8230fb35c3d57e1694ec0a07778e66e896578284d"
	},
	{
		"question_id": "0000000195",
		"question_text": "Is this a question with the ID [195]?",
		"answers": [{
			"answer_id": "0000000161",
			"answer_text": "This answer with id [161] is correct. It is associated to question with ID [195]",
			"correct": 1
		},
		{
			"answer_id": "0000000163",
			"answer_text": "This answer with id [163] is correct. It is associated to question with ID [195]",
			"correct": 1
		},
		{
			"answer_id": "0000000164",
			"answer_text": "This answer with id [164] is wrong. It is associated to question with ID [195]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000161000000016312345)",
		"answersHash": "f691a2a8a9c7942703bc4ae8782f89c023a27b5cb3b35e3c344e1d78b483fbfb9f052ed7071b6b1eef3ddd563250ef4e77276c919cc15b45738af1826f03f731"
	},
	{
		"question_id": "0000000196",
		"question_text": "Is this a question with the ID [196]?",
		"answers": [{
			"answer_id": "0000000168",
			"answer_text": "This answer with id [168] is correct. It is associated to question with ID [196]",
			"correct": 1
		},
		{
			"answer_id": "0000000171",
			"answer_text": "This answer with id [171] is wrong. It is associated to question with ID [196]",
			"correct": 0
		},
		{
			"answer_id": "0000000269",
			"answer_text": "This answer with id [269] is wrong. It is associated to question with ID [196]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 000000016812345)",
		"answersHash": "08575f9214d5eb8d5e404fb451050229b245d4a1aaceea472a9bb8c860fce15a411d632a5d7a1a01d3d411b348d3dc9573c0feafca55f7c64fa7868d6d6f38d3"
	},
	{
		"question_id": "0000000197",
		"question_text": "Is this a question with the ID [197]?",
		"answers": [{
			"answer_id": "0000000172",
			"answer_text": "This answer with id [172] is correct. It is associated to question with ID [197]",
			"correct": 1
		},
		{
			"answer_id": "0000000173",
			"answer_text": "This answer with id [173] is correct. It is associated to question with ID [197]",
			"correct": 1
		},
		{
			"answer_id": "0000000177",
			"answer_text": "This answer with id [177] is wrong. It is associated to question with ID [197]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000172000000017312345)",
		"answersHash": "5a783f40b2da0380e74b221938a9d4ec5c9c97d47f5e0dd0e01c9ff1143a91f427cc9aa861abf65c71e64d3ee2411739d512784e2dafc42b4f934befd14a733e"
	},
	{
		"question_id": "0000000198",
		"question_text": "Is this a question with the ID [198]?",
		"answers": [{
			"answer_id": "0000000180",
			"answer_text": "This answer with id [180] is correct. It is associated to question with ID [198]",
			"correct": 1
		},
		{
			"answer_id": "0000000181",
			"answer_text": "This answer with id [181] is correct. It is associated to question with ID [198]",
			"correct": 1
		},
		{
			"answer_id": "0000000182",
			"answer_text": "This answer with id [182] is wrong. It is associated to question with ID [198]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000180000000018112345)",
		"answersHash": "fbdc17eb1a0fa6300439b54c70237035cb33fe1c2baef829beb04baa10ad53dd711d448ce5078dd0c56f78e62bdc5d7d71390d570ca0a6aaa713f83e0a72f213"
	},
	{
		"question_id": "0000000199",
		"question_text": "Is this a question with the ID [199]?",
		"answers": [{
			"answer_id": "0000000185",
			"answer_text": "This answer with id [185] is correct. It is associated to question with ID [199]",
			"correct": 1
		},
		{
			"answer_id": "0000000186",
			"answer_text": "This answer with id [186] is correct. It is associated to question with ID [199]",
			"correct": 1
		},
		{
			"answer_id": "0000000190",
			"answer_text": "This answer with id [190] is wrong. It is associated to question with ID [199]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000185000000018612345)",
		"answersHash": "9acb3dc81f31e468f862ea845330ac1ce0e4e81a9cc096da98754c982f5f0aca40be035075b799036916c468a1642c9d0a4bd440f528f460f36eba7841799daa"
	},
	{
		"question_id": "0000000200",
		"question_text": "Is this a question with the ID [200]?",
		"answers": [{
			"answer_id": "0000000191",
			"answer_text": "This answer with id [191] is correct. It is associated to question with ID [200]",
			"correct": 1
		},
		{
			"answer_id": "0000000192",
			"answer_text": "This answer with id [192] is correct. It is associated to question with ID [200]",
			"correct": 1
		},
		{
			"answer_id": "0000000196",
			"answer_text": "This answer with id [196] is wrong. It is associated to question with ID [200]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000191000000019212345)",
		"answersHash": "df4b12bed4d7b25493c8c91c25ca3b91d15acd60d6a086e5e3d88eb89a3f0a29bd05dbf6c468e203cd128d84de20d4251906fbd0f81a582e2ec3ddc060aba789"
	},
	{
		"question_id": "0000000204",
		"question_text": "Is this a question with the ID [204]?",
		"answers": [{
			"answer_id": "0000000216",
			"answer_text": "This answer with id [216] is correct. It is associated to question with ID [204]",
			"correct": 1
		},
		{
			"answer_id": "0000000218",
			"answer_text": "This answer with id [218] is wrong. It is associated to question with ID [204]",
			"correct": 0
		},
		{
			"answer_id": "0000000220",
			"answer_text": "This answer with id [220] is wrong. It is associated to question with ID [204]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 000000021612345)",
		"answersHash": "85fe955973da2b3a8390d7e4817ee944993f1a5f3ff41066e83f35494556e3529f81d7d681308b664cd246bcf2d4f0344f53e5d32d1a78a561ec38a79afb894a"
	},
	{
		"question_id": "0000000205",
		"question_text": "Is this a question with the ID [205]?",
		"answers": [{
			"answer_id": "0000000221",
			"answer_text": "This answer with id [221] is correct. It is associated to question with ID [205]",
			"correct": 1
		},
		{
			"answer_id": "0000000222",
			"answer_text": "This answer with id [222] is correct. It is associated to question with ID [205]",
			"correct": 1
		},
		{
			"answer_id": "0000000226",
			"answer_text": "This answer with id [226] is wrong. It is associated to question with ID [205]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000221000000022212345)",
		"answersHash": "0838535fa486e7414a79ef7ca10312e0012c63cc9afe06e0f36b3e3eba023c51db58af589d68370ec8f4fae85f1281e54469396cb424ef24ff53eaf6d4aeb6cd"
	},
	{
		"question_id": "0000000206",
		"question_text": "Is this a question with the ID [206]?",
		"answers": [{
			"answer_id": "0000000227",
			"answer_text": "This answer with id [227] is correct. It is associated to question with ID [206]",
			"correct": 1
		},
		{
			"answer_id": "0000000228",
			"answer_text": "This answer with id [228] is correct. It is associated to question with ID [206]",
			"correct": 1
		},
		{
			"answer_id": "0000000232",
			"answer_text": "This answer with id [232] is wrong. It is associated to question with ID [206]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000227000000022812345)",
		"answersHash": "1961d51c48a0e6dcd3ecbf081d8b2a2729d909bea5586a2fdd0ef612cf987c3274014571cfabb1d9a6d44f5a5fd3c7c784c71d143724acf128c164014b58ee33"
	},
	{
		"question_id": "0000000210",
		"question_text": "Is this a question with the ID [210]?",
		"answers": [{
			"answer_id": "0000000251",
			"answer_text": "This answer with id [251] is correct. It is associated to question with ID [210]",
			"correct": 1
		},
		{
			"answer_id": "0000000252",
			"answer_text": "This answer with id [252] is correct. It is associated to question with ID [210]",
			"correct": 1
		},
		{
			"answer_id": "0000000253",
			"answer_text": "This answer with id [253] is correct. It is associated to question with ID [210]",
			"correct": 1
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 00000002510000000252000000025312345)",
		"answersHash": "12d547dfc98c880f25bf2a4d01ed95ef46bacefcae172e8304d7f618134c73e14dc2e5c60738d27c45760815f6793db7a372b4c4e341b54c2ab2051b7d0b44cb"
	},
	{
		"question_id": "0000000211",
		"question_text": "Is this a question with the ID [211]?",
		"answers": [{
			"answer_id": "0000000257",
			"answer_text": "This answer with id [257] is correct. It is associated to question with ID [211]",
			"correct": 1
		},
		{
			"answer_id": "0000000259",
			"answer_text": "This answer with id [259] is correct. It is associated to question with ID [211]",
			"correct": 1
		},
		{
			"answer_id": "0000000262",
			"answer_text": "This answer with id [262] is wrong. It is associated to question with ID [211]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000257000000025912345)",
		"answersHash": "ebc2be121d98f7dddc56afd67acdd34e8be6d32f30f05fabfc1df4a9c72e732eeccc77d9211e3e0bca21508295f0d1174bdd659d6d646043b92ccdbe5586ba34"
	},
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
	},
	{
		"question_id": "0000000214",
		"question_text": "Is this a question with the ID [214]?",
		"answers": [{
			"answer_id": "0000000278",
			"answer_text": "This answer with id [278] is correct. It is associated to question with ID [214]",
			"correct": 1
		},
		{
			"answer_id": "0000000279",
			"answer_text": "This answer with id [279] is wrong. It is associated to question with ID [214]",
			"correct": 0
		},
		{
			"answer_id": "0000000280",
			"answer_text": "This answer with id [280] is wrong. It is associated to question with ID [214]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 000000027812345)",
		"answersHash": "74ccc9620906f1841ac06024915200d164cb989d3362fee213c36a76e5419cccea7bf989b4aec55107d783fd537cbe2029c7d171acfe2de87237e30f3d44854f"
	},
	{
		"question_id": "0000000215",
		"question_text": "Is this a question with the ID [215]?",
		"answers": [{
			"answer_id": "0000000282",
			"answer_text": "This answer with id [282] is correct. It is associated to question with ID [215]",
			"correct": 1
		},
		{
			"answer_id": "0000000283",
			"answer_text": "This answer with id [283] is correct. It is associated to question with ID [215]",
			"correct": 1
		},
		{
			"answer_id": "0000000284",
			"answer_text": "This answer with id [284] is correct. It is associated to question with ID [215]",
			"correct": 1
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 00000002820000000283000000028412345)",
		"answersHash": "da07cee810362446c82d992c8a3bac75396fcdce463c55028e22c3f8b063739be1c8681a1b7ee6ff141cb0c4c34aae6872b8ecd2aee6265f92afe1450602dda7"
	},
	{
		"question_id": "0000000216",
		"question_text": "Is this a question with the ID [216]?",
		"answers": [{
			"answer_id": "0000000289",
			"answer_text": "This answer with id [289] is correct. It is associated to question with ID [216]",
			"correct": 1
		},
		{
			"answer_id": "0000000292",
			"answer_text": "This answer with id [292] is wrong. It is associated to question with ID [216]",
			"correct": 0
		},
		{
			"answer_id": "0000000293",
			"answer_text": "This answer with id [293] is wrong. It is associated to question with ID [216]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 000000028912345)",
		"answersHash": "0dbf151979b7f9916b3f1ce2b4454b415fc9554f9c583b44d635130878d4a55ee2280c337ca5b477b4c3d5b0aaa6d06997232593d72d754b090a8983982d176b"
	},
	{
		"question_id": "0000000217",
		"question_text": "Is this a question with the ID [217]?",
		"answers": [{
			"answer_id": "0000000295",
			"answer_text": "This answer with id [295] is correct. It is associated to question with ID [217]",
			"correct": 1
		},
		{
			"answer_id": "0000000296",
			"answer_text": "This answer with id [296] is correct. It is associated to question with ID [217]",
			"correct": 1
		},
		{
			"answer_id": "0000000298",
			"answer_text": "This answer with id [298] is wrong. It is associated to question with ID [217]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000295000000029612345)",
		"answersHash": "d468939437caedab1769ed366905e1dfe4383c05dcc2c77faf4c3138f6e21d23a81d63b86f728576bd2fbe6e8113fe51da0ff0ad09a905c5c4223917166687ba"
	},
	{
		"question_id": "0000000218",
		"question_text": "Is this a question with the ID [218]?",
		"answers": [{
			"answer_id": "0000000301",
			"answer_text": "This answer with id [301] is correct. It is associated to question with ID [218]",
			"correct": 1
		},
		{
			"answer_id": "0000000302",
			"answer_text": "This answer with id [302] is correct. It is associated to question with ID [218]",
			"correct": 1
		},
		{
			"answer_id": "0000000305",
			"answer_text": "This answer with id [305] is wrong. It is associated to question with ID [218]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000301000000030212345)",
		"answersHash": "29674aedec281a7420aead9f33a322cf1837dafcf1788edb43a3d3b5d1a0649ae3b4f1d617e5c1e8cb51de08bd74e898fc4c0c96f2b782142f9dc64fd663bcb4"
	},
	{
		"question_id": "0000000220",
		"question_text": "Is this a question with the ID [220]?",
		"answers": [{
			"answer_id": "0000000312",
			"answer_text": "This answer with id [312] is correct. It is associated to question with ID [220]",
			"correct": 1
		},
		{
			"answer_id": "0000000313",
			"answer_text": "This answer with id [313] is correct. It is associated to question with ID [220]",
			"correct": 1
		},
		{
			"answer_id": "0000000315",
			"answer_text": "This answer with id [315] is wrong. It is associated to question with ID [220]",
			"correct": 0
		}],
		"answersSelected": [],
		"answersHashORG": "hash('sha512', 0000000312000000031312345)",
		"answersHash": "f8ba57452775d664093d6f6785ab299bb85aa768134f562e507e4a2672d40208638bcedf25e6a91e836df1a55c37365a89b061be0ee2feed0b58733593f7cf3a"
	}],
	"ExamVersion_plannedDuration": "45"
}
let oneQuestion = m.examQuestions.filter(item => {
    return item.question_id === "0000000197"
})
if (oneQuestion[0].answersSelected === undefined || oneQuestion[0].answersSelected.length == 0) {
    console.log("Empty je");
	oneQuestion[0].answersSelected = [...answers];
	
} else {
    console.log("Nije Empty");
}

