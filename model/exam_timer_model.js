app = require('../app');
db = app.db;
ObjectId=app.ObjectId;
let moment 	= require('moment');
let id = require('moment/locale/id');
let dateFormat="DD/MM/YYYY H:m";
let examTimersCollection=db.collection('exam_timers');
let examTimersID="5a66def4de2c61277c23fb28";
exports.updateExamTimers= (query) => {
    return new Promise((resolve, reject)=>{
        let tanggalMulai=query.StartDate;
        let jamMulai=query.JamMulai;
        let tanggalSelesai=query.EndDate;
        let jamSelesai=query.JamSelesai;
        let waktuMulai=moment(tanggalMulai+" "+jamMulai,dateFormat,'id');
        let waktuSelesai=moment(tanggalSelesai+" "+jamSelesai,dateFormat,'id');
        let examTimersUpdateQuery = {
            start_time:waktuMulai.toDate(),
            end_time:waktuSelesai.toDate()
        };
        examTimersCollection.updateOne({_id:new ObjectId(examTimersID)},{$set:examTimersUpdateQuery},function (err,result) {
            if (err)reject(err);
            else resolve(true);
        });
    });
};

exports.getExamTimers= () => {
    return new Promise((resolve, reject)=>{
        examTimersCollection.findOne({_id:new ObjectId(examTimersID)},function (err,result) {
            if (err)reject(err);
            else resolve(result);
        });
    });
};