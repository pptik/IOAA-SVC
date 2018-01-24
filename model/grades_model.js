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
                    "nilai_juri":{$push:"$nilai_juri"},
                    "juri_detail":{$push:"$juri_detail"}
                }
            }
        ]).toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results);
        });
    });
};