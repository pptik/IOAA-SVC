let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let sessionModel=require('../model/session_model');
let moderationSchedulesModel=require('../model/moderation_schedules_model');
let cors = require('cors');
app.use(cors());

router.post('/create', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let StartDate=query.StartDate;
    let JamMulai=query.JamMulai;
    let EndDate=query.EndDate;
    let JamSelesai=query.JamSelesai;
    let Durasi=query.Durasi;
    if(SessID===undefined||StartDate===undefined||JamMulai===undefined||EndDate===undefined||JamSelesai===undefined||Durasi===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                if(await moderationSchedulesModel.checkActiveModerationSchedule()){
                    res.status(200).send({success: false, message: "There is Active Moderation Schedules please check first and change the status to become expired"});
                }else {
                    await moderationSchedulesModel.createModerationScheduleV2(query);
                    res.status(200).send({success: true, message: "Success Create Moderation Schedule"});
                }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/set/active', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let ModerationScheduleID=query.ModerationScheduleID;
    if(SessID===undefined||ModerationScheduleID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                if(await moderationSchedulesModel.checkActiveModerationSchedule()){
                    res.status(200).send({success: false, message: "There is Active Moderation Schedules please check first and change the status to become expired"});
                }else {
                    await moderationSchedulesModel.setModerationScheduleActive(ModerationScheduleID);
                    res.status(200).send({success: true, message: "Success Set Moderation Schedule Active"});
                }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/set/expired', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let ModerationScheduleID=query.ModerationScheduleID;
    if(SessID===undefined||ModerationScheduleID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                await moderationSchedulesModel.setModerationScheduleExpired(ModerationScheduleID);
                res.status(200).send({success: true, message: "Success Set Moderation Schedule Expired"});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/get/all', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    if(SessID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let ListModerationSchedules=await moderationSchedulesModel.getAllModerationandJoinWithListModeration();
                res.status(200).send({success: true, message: "Success Get Data",listmoderationschedules:ListModerationSchedules});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/get/active', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    if(SessID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let ActiveModerationSchedule=await moderationSchedulesModel.getActiveModerationSchedule();
                res.status(200).send({success: true, message: "Success Get Data",schedule:ActiveModerationSchedule});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/add/by/teamleader', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let ModerationScheduleID=query.ModerationScheduleID;
    let TeamLeaderID=query.TeamLeaderID;
    let TeamLeaderCOde=query.TeamLeaderCode;
    let JuryID=query.JuryID;
    let JuryCode=query.JuryCode;
    let ModerationSession=query.ModerationSession;
    if(SessID===undefined||ModerationScheduleID===undefined||TeamLeaderID===undefined||TeamLeaderCOde===undefined||JuryID===undefined
    ||JuryCode===undefined||ModerationSession===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                if(await moderationSchedulesModel.checkJuryInListModerationScheduleByIDandSession(query)){
                    res.status(200).send({success: false, message: "Jury with id "+JuryCode+" already have appointment"});
                }else {
                    if(await moderationSchedulesModel.checkListModerasiByIDJuryAndSesi(query)){
                        res.status(200).send({success: false, message: "You already have appointment with jury, please check your schedule"});
                    }else {
                        await moderationSchedulesModel.insertToModerationList(query);
                        res.status(200).send({success: true, message: "Success add Appointment"});
                    }
                }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/get/by/jury', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let ModerationScheduleID=query.ModerationScheduleID;
    let JuryID=query.JuryID;
    if(SessID===undefined||ModerationScheduleID===undefined||JuryID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let detailModerationSchedule=await moderationSchedulesModel.getModerationScheduleDetailByID(query);
                let listModerationSession=await moderationSchedulesModel.getListModerationByIDandJury(query);
                res.status(200).send({success: true, message: "Success get Data",detail:detailModerationSchedule,list:listModerationSession});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/get/by/teamleader', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let ModerationScheduleID=query.ModerationScheduleID;
    let TeamLeadaerID=query.TeamLeaderID;
    if(SessID===undefined||ModerationScheduleID===undefined||TeamLeadaerID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let detailModerationSchedule=await moderationSchedulesModel.getModerationScheduleDetailByID(query);
                let listModerationSession=await moderationSchedulesModel.getListModerationByIDandTeamLeader(query);
                res.status(200).send({success: true, message: "Success get Data",detail:detailModerationSchedule,list:listModerationSession});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});

module.exports = router;
