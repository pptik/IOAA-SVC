app = require('../app');
db = app.db;
ObjectId=app.ObjectId;
let moment 	= require('moment');
let id = require('moment/locale/id');
let dateFormat="DD/MM/YYYY H:m";
let moderationSchedulesCollection=db.collection('moderation_schedules');

exports.createModerationSchedule = function(query) {
    return new Promise((resolve, reject) =>{
        let tanggalMulai=query.StartDate;
        let jamMulai=query.JamMulai;
        let tanggalSelesai=query.EndDate;
        let jamSelesai=query.JamSelesai;
        let waktuMulai=moment(tanggalMulai+" "+jamMulai,dateFormat,'id');
        let waktuSelesai=moment(tanggalSelesai+" "+jamSelesai,dateFormat,'id');
        let timeDifference=moment.duration(waktuSelesai.diff(waktuMulai));
        let minuteDifference=timeDifference.asMinutes();
        let moderationSessions=minuteDifference/parseInt(query.Durasi);
        let k_sesi={};
        for(let i = 1; i< moderationSessions+1; i++){
            k_sesi[i]=[];
            console.log(i);
        }
        let moderationScheduleQuery={
            start_time:waktuMulai.toDate(),
            end_time:waktuSelesai.toDate(),
            durasi:parseInt(query.Durasi),
            status:1,
            jumlah_sesi:moderationSessions,
            k_sesi
        };
        moderationSchedulesCollection.insertOne(moderationScheduleQuery, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};
exports.checkActiveModerationSchedule=function () {
    return new Promise((resolve,reject)=>{
        moderationSchedulesCollection.find({status:1}).toArray(function (err,results) {
            if(err)reject(err);
            else {
                if(results.length>0)resolve(true);
                else resolve(false);
            }
        });
    });
};
exports.setModerationScheduleExpired= (ModerationScheduleID) => {
    return new Promise((resolve, reject)=>{
        let moderationScheduleUpdateQuery = {
            status:2
        };
        moderationSchedulesCollection.updateOne({_id:new ObjectId(ModerationScheduleID)},{$set:moderationScheduleUpdateQuery},function (err,result) {
            if (err)reject(err);
            else resolve(true);
        });
    });
};
exports.setModerationScheduleActive= (ModerationScheduleID) => {
    return new Promise((resolve, reject)=>{
        let moderationScheduleUpdateQuery = {
            status:1
        };
        moderationSchedulesCollection.updateOne({_id:new ObjectId(ModerationScheduleID)},{$set:moderationScheduleUpdateQuery},function (err,result) {
            if (err)reject(err);
            else resolve(true);
        });
    });
};
exports.getListAllModerationSchedules=function () {
    return new Promise((resolve,reject)=>{
        moderationSchedulesCollection.find().toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results)
        });
    });
};
exports.getActiveModerationSchedule= () => {
    return new Promise((resolve, reject)=>{
        moderationSchedulesCollection.findOne({status:1},function (err,result) {
            if (err)reject(err);
            else resolve(result);
        });
    });
};
