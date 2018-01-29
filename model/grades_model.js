app = require('../app');
db = app.db;
ObjectId=app.ObjectId;

let gradesCollection=db.collection('grades');


exports.getAllGrades=()=> {
    return new Promise((resolve, reject)=>{
        gradesCollection.aggregate([
            {$unwind:"$nilai_juri"},
            {
                $lookup:{
                    from:"users",
                    localField:"nilai_juri.id_juri",
                    foreignField:"_id",
                    as:"juri_detail"
                }
            },
            {$unwind:"$juri_detail"},
            {
                $group:{
                    "_id":"$_id",
                    "id_soal":{$push:"$id_soal"},
                    "id_participant":{$push:"$id_participant"},
                    "nilai_team_leader":{$push:"$nilai_team_leader"},
                    "selisih":{$push:"$selisih"},
                    "moderasi_status":{$push:"$moderasi_status"},
                    "nilai_final":{$push:"$nilai_final"},
                    "nilai_juri":{$push:"$nilai_juri"},
                    "juri_detail":{$push:"$juri_detail"}

                }
            },
            {
                $project:{
                    "id_soal":{$arrayElemAt:["$id_soal",0]},
                    "id_participant":{$arrayElemAt:["$id_participant",0]},
                    "nilai_team_leader":{$arrayElemAt:["$nilai_team_leader",0]},
                    "selisih":{$arrayElemAt:["$selisih",0]},
                    "moderasi_status":{$arrayElemAt:["$moderasi_status",0]},
                    "nilai_final":{$arrayElemAt:["$nilai_final",0]},
                    "nilai_juri":"$nilai_juri",
                    "juri_detail":"$juri_detail",

                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"id_participant",
                    foreignField:"_id",
                    as:"participant_detail"
                }
            },
            {$unwind:"$participant_detail"}
        ]).toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results);
        });
    });
};
exports.getListAllGradesWithoutJoins=function () {
    return new Promise((resolve,reject)=>{
        gradesCollection.find().toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results)
        });
    });
};
exports.checkIfGradesWithQuestionIDandParticipantIDExists=(query)=>{
    return new Promise((resolve,reject)=>{
        let findQuestionQuery={
            id_soal:new ObjectId(query.QuestionID),
            id_participant:new ObjectId(query.ParticipantID)
        };
        gradesCollection.find(findQuestionQuery).toArray(function (err,result) {
            if(err)reject(err);
            else {
                if(result.length>0)resolve(true);
                else resolve(false);
            }
        })
    });
};
exports.createGrades = function(query) {
    return new Promise((resolve, reject) =>{
        let gradeInsertQuery={
            id_soal:new ObjectId(query.QuestionID),
            id_participant:new ObjectId(query.ParticipantID),
            kode_participant:query.ParticipantCode,
            nomor_soal:parseInt(query.QuestionNumber),
            nilai_juri:[],
            nilai_team_leader:{},
            selisih:0,
            moderasi_status:0,
            nilai_final:0
        };
        gradesCollection.insertOne(gradeInsertQuery, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};
exports.checkIfJuryAlreadyGiveGradesByQuesionIDandParticipantID=(query)=>{
    return new Promise((resolve,reject)=>{
        let findGradesQuery={
            id_soal:new ObjectId(query.QuestionID),
            id_participant:new ObjectId(query.ParticipantID),
            nilai_juri:{
                $elemMatch:{
                    id_juri:new ObjectId(query.JuryID)
                }
            }
        };
        gradesCollection.find(findGradesQuery).toArray(function (err,result) {
            if(err)reject(err);
            else {
                if(result.length>0)resolve(true);
                else resolve(false);
            }
        })
    });
};
exports.insertJuryGradesbyQuestionIDandParticipantID=(query)=>{
    return new Promise((resolve,reject)=>{
        let pushGradeQuery={
            id_juri:new ObjectId(query.JuryID),
            kode_juri:query.JuryCode,
            nilai:parseInt(query.Grades)
        };
        gradesCollection.updateOne({id_soal:new ObjectId(query.QuestionID),id_participant:new ObjectId(query.ParticipantID)},{$push:{nilai_juri:pushGradeQuery}},function (err,result) {
            if(err)reject(err);
            else resolve(result);
        })
    });
};
exports.updateGradesByJury=(query)=>{
    return new Promise((resolve,reject)=>{
        gradesCollection.updateOne(
            {
                id_soal:new ObjectId(query.QuestionID),
                id_participant:new ObjectId(query.ParticipantID),
                "nilai_juri.id_juri":new ObjectId(query.JuryID)
            },
            {
                $set:{
                    "nilai_juri.$.nilai":parseInt(query.Grades)
                }
            }
            ,function (err,result) {
                if(err)reject(err);
                else resolve(result);
            })
    });
};
exports.findGradeByQuestionIDandParticipantID= (query) => {
    return new Promise((resolve, reject)=>{
        gradesCollection.findOne({id_soal:new ObjectId(query.QuestionID),id_participant:new ObjectId(query.ParticipantID)},function (err,result) {
            if (err)reject(err);
            else resolve(result);
        });
    });
};
exports.updateSelisihModerasiStatusNilaiFinal=(query)=>{
    return new Promise((resolve,reject)=>{
        gradesCollection.updateOne(
            {
                id_soal:new ObjectId(query.QuestionID),
                id_participant:new ObjectId(query.ParticipantID)
            },
            {
                $set:{
                    selisih:parseInt(query.Selisih),
                    moderasi_status:parseInt(query.ModerationStatus),
                    nilai_final:parseInt(query.FinalGrade)
                }
            }
            ,function (err,result) {
                if(err)reject(err);
                else resolve(result);
            })
    });
};

exports.updateGradesByTeamLeader=(query)=>{
    return new Promise((resolve,reject)=>{
        gradesCollection.updateOne(
            {
                id_soal:new ObjectId(query.QuestionID),
                id_participant:new ObjectId(query.ParticipantID)
            },
            {
                $set:{
                    "nilai_team_leader.id_team_leader":new ObjectId(query.TeamLeaderID),
                    "nilai_team_leader.kode_team_leader":query.TeamLeaderCode,
                    "nilai_team_leader.nilai":parseInt(query.Grades)
                }
            }
            ,function (err,result) {
                if(err)reject(err);
                else resolve(result);
            })
    });
};
exports.getGradesByParticipantID=function (ParticipantID) {
    return new Promise((resolve,reject)=>{
        gradesCollection.aggregate([
            {$match:
                {
                    id_participant:new ObjectId(ParticipantID)
                }
            },
            {
                $lookup:{
                    from:"questions",
                    localField:"id_soal",
                    foreignField:"_id",
                    as:"question_detail"
                }
            },
            {$unwind:"$question_detail"},
            {
                $project:{
                    id_participant:1,
                    soal:{$arrayElemAt:["$question_detail.deskripsi",0]},
                    nilai_juri:1,
                    nilai_team_leader:1,
                    selisih:1,
                    moderasi_status:1,
                    nilai_final:1
                }
            }
        ]).toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results);
        });
    });
};