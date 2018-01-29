app = require('../app');
db = app.db;
ObjectId=app.ObjectId;
let moment 	= require('moment');
let id = require('moment/locale/id');
let dateFormat="DD/MM/YYYY H:m";
let moderationSchedulesCollection=db.collection('moderation_schedules');
let moderationListCollection=db.collection('moderation_list');

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
exports.createModerationScheduleV2 = function(query) {
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
        let moderationScheduleQuery={
            start_time:waktuMulai.toDate(),
            end_time:waktuSelesai.toDate(),
            durasi:parseInt(query.Durasi),
            status:1,
            jumlah_sesi:moderationSessions
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

exports.getAllModerationandJoinWithListModeration=function () {
    return new Promise((resolve,reject)=>{
        moderationSchedulesCollection.aggregate([
            {
                $lookup:{
                    from:"moderation_list",
                    localField:"_id",
                    foreignField:"id_jadwal_moderasi",
                    as:"listModerasi"
                }
            }
        ]).toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results);
        });
    });
};
exports.getActiveModerationSchedule= () => {
    return new Promise((resolve, reject)=>{
        moderationSchedulesCollection.aggregate([
            {$match:
                {
                status:1
                }
            },
            {
                $lookup:{
                    from:"moderation_list",
                    localField:"_id",
                    foreignField:"id_jadwal_moderasi",
                    as:"listModerasi"
                }
            }
        ],function (err,results) {
            if(err)reject(err);
            else resolve(results[0]);
        });
    });
};
exports.getModerationScheduleDetailByID= (query) => {
    return new Promise((resolve, reject)=>{
        moderationSchedulesCollection.findOne({_id:new ObjectId(query.ModerationScheduleID)},function (err,result) {
            if (err)reject(err);
            else resolve(result);
        });
    });
};
exports.getListModerationByIDandJury=function (query) {
    return new Promise((resolve,reject)=>{
        moderationListCollection.find({id_jadwal_moderasi:new ObjectId(query.ModerationScheduleID),id_juri:new ObjectId(query.JuryID)}).toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results)
        });
    });
};
exports.getListModerationByIDandTeamLeader=function (query) {
    return new Promise((resolve,reject)=>{
        moderationListCollection.find({id_jadwal_moderasi:new ObjectId(query.ModerationScheduleID),id_team_leader:new ObjectId(query.TeamLeaderID)}).toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results)
        });
    });
};
exports.checkJuryInListModerationScheduleByIDandSession=function (query) {
    return new Promise((resolve,reject)=>{
        moderationListCollection.find({id_jadwal_moderasi:new ObjectId(query.ModerationScheduleID),id_juri:new ObjectId(query.JuryID),sesike:parseInt(query.ModerationSession)}).toArray(function (err,results) {
            if(err)reject(err);
            else {
                if(results.length>0)resolve(true);
                else resolve(false);
            }
        });
    });
};
exports.insertToModerationList = function(query) {
    return new Promise((resolve, reject) =>{
        let moderationListQuery={
            id_jadwal_moderasi:new ObjectId(query.ModerationScheduleID),
            id_team_leader:new ObjectId(query.TeamLeaderID),
            kode_team_leader:query.TeamLeaderCode,
            id_juri:new ObjectId(query.JuryID),
            kode_juri:query.JuryCode,
            sesike:parseInt(query.ModerationSession)
        };
        moderationListCollection.insertOne(moderationListQuery, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};
exports.checkListModerasiByIDJuryAndSesi=function (query) {
    return new Promise((resolve,reject)=>{
        moderationListCollection.find({id_jadwal_moderasi:new ObjectId(query.ModerationScheduleID),id_juri:new ObjectId(query.JuryID),id_team_leader:new ObjectId(query.TeamLeaderID)}).toArray(function (err,results) {
            if(err)reject(err);
            else {
                if(results.length>0)resolve(true);
                else resolve(false);
            }
        });
    });
};
exports.getModerationListByModerationScheduleID=function (query) {
    return new Promise((resolve,reject)=>{
        moderationListCollection.find({id_jadwal_moderasi:new ObjectId(query.ModerationScheduleID)}).toArray(function (err,results) {
            if(err)reject(err);
            else resolve(results)
        });
    });
};