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