let express = require('express');
let router = express.Router();
let message = require('../setup/messages.json');
let sessionModel=require('../model/session_model');
let examTimersModel=require('../model/exam_timer_model');
let moment 	= require('moment');
let id = require('moment/locale/id');
let dateFormat="DD/MM/YYYY H:m";
let cors = require('cors');
app.use(cors());


router.post('/update', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    let StartDate=query.StartDate;
    let JamMulai=query.JamMulai;
    let EndDate=query.EndDate;
    let JamSelesai=query.JamSelesai;
    if(SessID===undefined||StartDate===undefined||JamMulai===undefined||EndDate===undefined||JamSelesai===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                await examTimersModel.updateExamTimers(query);
                res.status(200).send({success: true, message: "Success Update Exam Timers"});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/get', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    if(SessID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let detailExamTimers=await examTimersModel.getExamTimers();
                detailExamTimers.TanggalMulaiExam=moment(detailExamTimers.start_time).format('LL');
                detailExamTimers.TanggalSelesaiExam=moment(detailExamTimers.end_time).format('LL');
                detailExamTimers.WaktuMulaiExam=moment(detailExamTimers.start_time).format('LT');
                detailExamTimers.WaktuSelesaiExam=moment(detailExamTimers.end_time).format('LT');
                res.status(200).send({success: true, message: "Success Get Exam Timers",detailexamtimers:detailExamTimers});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});
router.post('/check', async(req, res) => {
    let query = req.body;
    console.log(query);
    let SessID=query.SessID;
    if(SessID===undefined){
        res.status(200).send(message.parameter_not_completed);
    }else {
        try{
            if(await sessionModel.promiseCheckSession(SessID)===null)res.status(200).send(message.invalid_session);
            else {
                let detailExamTimers=await examTimersModel.getExamTimers();
                detailExamTimers.TanggalMulaiExam=moment(detailExamTimers.start_time).format('LL');
                detailExamTimers.TanggalSelesaiExam=moment(detailExamTimers.end_time).format('LL');
                detailExamTimers.WaktuMulaiExam=moment(detailExamTimers.start_time).format('LT');
                detailExamTimers.WaktuSelesaiExam=moment(detailExamTimers.end_time).format('LT');
                let dateBetweenTimeServer=moment(new Date());
                if(dateBetweenTimeServer.isBetween(moment(detailExamTimers.start_time),moment(detailExamTimers.end_time))){
                    res.status(200).send({success: true, message: "Exam Time",detailexamtimers:detailExamTimers});
                }else {
                    res.status(200).send({success: false, message: "Not Exam Time",detailexamtimers:detailExamTimers});
                }
            }
        }catch (err){
            console.log(err);
            res.status(200).send(message.server_error);
        }
    }
});

module.exports = router;
